import { Component, OnInit, NgModule, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AreaList } from '../_models/areaList';
import { Notification } from '../_models/notification';
import { Post } from '../_models/post';
import { NavBarService } from '../_services/navBar.service';
import { NotificationService } from '../_services/notification.service';
import { RouteService } from '../_services/route.service';
import { MasonryOptions } from 'angular2-masonry';

@Component({
  selector: 'user-posts',
  templateUrl: 'notificationArchive.component.html'
})
export class NotificationArchiveComponent implements OnInit {
  backupPosts: { [area: string]: Post[]; } = {};
  backupFunPosts: Post[] = [];
  backupInfoPosts: Post[] = [];
  currentArea: string;
  funImageArray: string[] = [];
  funPosts: Post[] = [];
  index = 1;
  infoImageArray: string[] = [];
  infoPosts: Post[] = [];
  limit = 10;
  loading = true;
  model: any = {};
  offset = 10;
  searchArray: Post[] = [];
  searching = false;
  superPosts: { [area: string]: Post[]; } = {};
  totalCount = 0;

  constructor(
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private navBarService: NavBarService,
    private notificationService: NotificationService,
    private routeService: RouteService
  ) { }

  private imageInPosts(posts: Post[], area: string) {
    this.funImageArray = [];
    this.infoImageArray = [];

    for (let i = 0; i <= posts.length - 1; i++) {
      // Find image markdown data in post.text - Guarenteed by Regex
      const indexOfStart = posts[i].text.search(/\!\[.*?\][\[\(].*?[\]\)]/g);
      if (indexOfStart !== -1) {
        // Start at index and parse until we find a closing ')' char
        for (let j = indexOfStart; j <= posts[i].text.length; j++) {
          if (posts[i].text.charAt(j) === ')') {
            // Add data to image array in specific area
            if (area === 'fun') {
              this.funImageArray[i]  = posts[i].text.slice(indexOfStart, j + 1);
            } else {
              this.infoImageArray[i]  = posts[i].text.slice(indexOfStart, j + 1);
            }
          }
        }
      }
    }
    this.loading = false;
  }

  private removeMarkdown(input: string) {
    input = input
      // Remove horizontal rules (stripListHeaders conflict with this rule, which is why it has been moved to the top)
      .replace(/^(-\s*?|\*\s*?|_\s*?){3,}\s*$/gm, '[Horizontal-Rule]')
      // Remove horizontal rules
      .replace(/^(-\s*?|\*\s*?|_\s*?){3,}\s*$/gm, '')
      // Header
      .replace(/\n={2,}/g, '\n')
      // Strikethrough
      .replace(/~~/g, '')
      // Fenced codeblocks
      .replace(/`{3}.*\n/g, '')
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Remove setext-style headers
      .replace(/^[=\-]{2,}\s*$/g, '')
      // Remove footnotes?
      .replace(/\[\^.+?\](\: .*?$)?/g, '')
      .replace(/\s{0,2}\[.*?\]: .*?$/g, '')
      // Remove images
      .replace(/\!\[.*?\][\[\(].*?[\]\)]/g, '')
      // Remove inline links
      .replace(/\[(.*?)\][\[\(].*?[\]\)]/g, '$1')
      // Remove blockquotes
      .replace(/^\s{0,3}>\s?/g, '')
      // Remove reference-style links?
      .replace(/^\s{1,2}\[(.*?)\]: (\S+)( ".*?")?\s*$/g, '')
      // Remove atx-style headers
      .replace(/^(\n)?\s{0,}#{1,6}\s+| {0,}(\n)?\s{0,}#{0,} {0,}(\n)?\s{0,}$/gm, '$1$2$3')
      // Remove emphasis (repeat the line to remove double emphasis)
      .replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g, '$2')
      .replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g, '$2')
      // Remove code blocks
      .replace(/(`{3,})(.*?)\1/gm, '$2')
      // Remove inline code
      .replace(/`(.+?)`/g, '$1')
      // Replace two or more newlines with exactly two? Not entirely sure this belongs here...
      .replace(/\n{2,}/g, '\n\n');
      return input;
  }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        if (params['index'] !== undefined) {
          this.index = params['index'];
        }

        this.navBarService.currentArea
          .subscribe((currentArea: AreaList) => {
            this.currentArea = currentArea.name;
            this.loading = true;
            const posts: Post[] = [];

            this.notificationService.getArchive(currentArea.name, this.limit, 0)
              .subscribe(superPost => {
                superPost.results.forEach((obj: any) => {
                  posts.push(Post.parse(obj));
                });

                // Removes binding to original 'superPost' variable
                this.superPosts[currentArea.name] = JSON.parse(JSON.stringify(posts));
                this.backupPosts[currentArea.name] = posts;
                this.totalCount = superPost.count;

                this.imageInPosts(this.superPosts[currentArea.name], currentArea.name);

                for (let i = 0; i <= this.backupPosts[currentArea.name].length - 1; i++) {
                  this.backupPosts[currentArea.name][i].text = this.removeMarkdown(this.backupPosts[currentArea.name][i].text);
                }
                this.cdRef.detectChanges();
                this.loading = false;
              });
          });
      });
  }

  back() {
    if (this.routeService.routes.length === 0) {
      this.router.navigateByUrl('');
    } else {
      this.router.navigateByUrl(this.routeService.getNextRoute());
    }
  }

  getPosts(page: number) {
    this.loading = true;
    const posts: Post[] = [];

    this.notificationService.getArchive(this.currentArea, this.limit, (this.offset * page) - this.limit)
      .subscribe(superPost => {
        superPost.results.forEach((obj: any) => {
          posts.push(Post.parse(obj));
        });

        // Removes binding to original 'superPost' variable
        this.superPosts[this.currentArea] = JSON.parse(JSON.stringify(posts));
        this.backupPosts[this.currentArea] = posts;
        this.imageInPosts(this.superPosts[this.currentArea], this.currentArea);

        for (let i = 0; i <= this.backupPosts[this.currentArea].length - 1; i++) {
          this.backupPosts[this.currentArea][i].text = this.removeMarkdown(this.backupPosts[this.currentArea][i].text);
        }
        this.index = page;
        this.totalCount = superPost.count;
        this.cdRef.detectChanges();
        this.loading = false;
      });
  }

  goto(areaID: string, postID: string) {
    this.routeService.addNextRouteByIndex(this.index);
    this.router.navigateByUrl('/areas/' + areaID + '/' + postID);
  }

/* Removed as of D114
  searchInput() {
    if (this.areaService.currentAreaName === 'fun') {
      this.searchArray = [];
      if (this.model.postText === '') {
        this.searching = false;
        this.cdRef.detectChanges();
      } else {
        this.searching = true;

        for (let i = 0; i <= this.funPosts.length - 1; i++) {
          if (this.funPosts[i].text.toLowerCase().includes(this.model.postText.toLowerCase())) {
            this.searchArray.push(this.backupFunPosts[i]);
          }
        }
        this.cdRef.detectChanges();
      }
    } else {
      this.searchArray = [];
      if (this.model.postText === '') {
        this.searching = false;
        this.cdRef.detectChanges();
      } else {
        this.searching = true;

        for (let i = 0; i <= this.infoPosts.length - 1; i++) {
          if (this.infoPosts[i].text.toLowerCase().includes(this.model.postText.toLowerCase())) {
            this.searchArray.push(this.backupInfoPosts[i]);
          }
        }
        this.cdRef.detectChanges();
      }
    }
  }
  */
}
