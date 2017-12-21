import { Component, OnInit, NgModule, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Notification } from '../_models/notification';
import { Post } from '../_models/post';
import { AreaService } from '../_services/area.service';
import { NotificationService } from '../_services/notification.service';
import { RouteService } from '../_services/route.service';
import { MasonryOptions } from 'angular2-masonry';

@Component({
  selector: 'user-posts',
  templateUrl: 'notificationArchive.component.html'
})
export class NotificationArchiveComponent implements OnInit {
  backupFunPosts: Post[] = [];
  backupInfoPosts: Post[] = [];
  checked: boolean;
  funImageArray: string[] = [];
  funPosts: Post[] = [];
  infoImageArray: string[] = [];
  infoPosts: Post[] = [];
  loading = true;
  model: any = {};
  searchArray: Post[] = [];
  searching = false;

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private areaService: AreaService,
    private notificationService: NotificationService,
    private routeService: RouteService
  ) {
    this.checked = this.areaService.isAreaChecked;
   }

  private imageInPosts(posts: Post[], area: string) {
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
    // get posts from secure api end point
    this.notificationService.getArchive('fun')
      .subscribe(posts => {
        // Removes binding to original 'posts' variable
        const noMarkdownPosts = JSON.parse(JSON.stringify(posts));

        this.funPosts = posts;
        this.imageInPosts(this.funPosts, 'fun');
        this.backupFunPosts = noMarkdownPosts;

        for (let i = 0; i <= this.backupFunPosts.length - 1; i++) {
          this.backupFunPosts[i].text = this.removeMarkdown(this.backupFunPosts[i].text);
        }
    });

    this.notificationService.getArchive('information')
      .subscribe(posts => {
        // Removes binding to original 'posts' variable
        const noMarkdownPosts = JSON.parse(JSON.stringify(posts));

        this.infoPosts = posts;
        this.imageInPosts(this.infoPosts, 'information');
        this.backupInfoPosts = noMarkdownPosts;

        for (let i = 0; i <= this.backupInfoPosts.length - 1; i++) {
          this.backupInfoPosts[i].text = this.removeMarkdown(this.backupInfoPosts[i].text);
        }
    });
  }

  back() {
    if (this.routeService.routes.length === 0) {
      this.router.navigateByUrl('');
    } else {
      this.router.navigateByUrl(this.routeService.getNextRoute());
    }
  }

  goto(areaID: string, postID: string) {
    this.routeService.addNextRoute(this.router.url);
    this.router.navigateByUrl('/areas/' + areaID + '/' + postID);
  }

  onChange(value: any) {
    if (value.checked === true) {
      this.checked = true;
      this.areaService.isAreaChecked = true;
      this.areaService.currentAreaName = 'information';
    } else {
      this.checked = false;
      this.areaService.isAreaChecked = false;
      this.areaService.currentAreaName = 'fun';
    }
  }

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
}
