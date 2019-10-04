import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Account } from '../../_models/account';
import { Area } from '../../_models/area';
import { Author } from '../../_models/author';
import { Ban } from '../../_models/ban';
import { Choice } from '../../_models/choice';
import * as C from '../../_models/constants';
import { Post } from '../../_models/post';
import { AreaService } from '../../_services/area.service';
import { PostService } from '../../_services/post.service';
import { RouteService } from '../../_services/route.service';

@Component({
  templateUrl: 'myPosts.component.html',
  styleUrls: ['./myPosts.component.scss']
})
export class MyPostsComponent implements OnInit, OnDestroy {
  account: Account;
  author: Author;
  backupPosts: { [area: string]: Post[]; } = {};
  bans: Ban[] = [];
  bioForm: FormGroup;
  choices: Choice[];
  componentDestroyed: Subject<boolean> = new Subject();
  currentArea: Area;
  data: any;
  editBio = false;
  emailForm: FormGroup;
  errors: any;
  imageArray: { [area: string]: string[]; } = {};
  index = 1;
  limit = 10;
  loading = true;
  offset = 10;
  self: boolean;
  superPosts: { [area: string]: Post[]; } = {};
  totalCount = 0;
  url: string;

  constructor(
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar,
    private areaService: AreaService,
    private postService: PostService,
    private routeService: RouteService
  ) { }

  private imageInPosts(posts: Post[], area: string) {
    this.imageArray[area] = [];

    for (let i = 0; i <= posts.length - 1; i++) {
      // Find image markdown data in post.text - Guarenteed by Regex
      const indexOfStart = posts[i].text.search(C.WF_IMAGE_REGEX);
      if (indexOfStart !== -1) {
        // Start at index and parse until we find a closing ')' char
        for (let j = indexOfStart; j <= posts[i].text.length; j++) {
          if (posts[i].text.charAt(j) === ']') {
            // Add data to image array in specific area
              this.imageArray[area][i]  = posts[i].text.slice(indexOfStart, j + 1);
          }
        }
      }
    }
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
      .replace(C.WF_IMAGE_REGEX, '')
      // Remove wildfyre images
      .replace(/(\[img: \d\])/gm, '')
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
    this.route.params.pipe(
    takeUntil(this.componentDestroyed))
    .subscribe(params => {
      if (params['area'] !== undefined) {
        this.areaService.getAreas().pipe(
          takeUntil(this.componentDestroyed))
          .subscribe((areas) => {
            for (let i = 0; i <= areas.length - 1; i++) {
              if (areas[i].name === params['area']) {
                this.currentArea = areas[i];
              }
            }

            if (!this.superPosts[this.currentArea.name]) {
              this.superPosts[this.currentArea.name] = [];
            }
            if (!this.backupPosts[this.currentArea.name]) {
              this.backupPosts[this.currentArea.name] = [];
            }
            const posts: Post[] = [];

            this.postService.getOwnPosts(this.currentArea.name, this.limit, 0).pipe(
              takeUntil(this.componentDestroyed))
              .subscribe(superPost => {
                superPost.results.forEach((obj: any) => {
                  posts.push(Post.parse(obj));
                });

                // Removes binding to original 'superPost' variable
                this.superPosts[this.currentArea.name] = JSON.parse(JSON.stringify(posts));
                this.backupPosts[this.currentArea.name] = posts;
                this.totalCount = superPost.count;

                this.imageInPosts(this.superPosts[this.currentArea.name], this.currentArea.name);

                for (let i = 0; i <= this.backupPosts[this.currentArea.name].length - 1; i++) {
                  this.backupPosts[this.currentArea.name][i].text = this.removeMarkdown(this.backupPosts[this.currentArea.name][i].text);
                }

                this.cdRef.detectChanges();
                this.loading = false;
              });

            this.loading = false;
          });
      }
    });
  }

  ngOnDestroy() {
    this.cdRef.detach();
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }


  back() {
    if (this.routeService.routes.length === 0) {
      this.router.navigateByUrl('');
    } else {
      this.router.navigateByUrl(this.routeService.getNextRoute());
    }
  }

  getPosts(page: any) {
    this.loading = true;
    const posts: Post[] = [];

    this.postService.getOwnPosts(this.currentArea.name, this.limit, (this.offset * page) - this.limit).pipe(
      takeUntil(this.componentDestroyed))
      .subscribe(superPost => {
        superPost.results.forEach((obj: any) => {
          posts.push(Post.parse(obj));
        });

        // Removes binding to original 'superPost' variable
        this.superPosts[this.currentArea.name] = JSON.parse(JSON.stringify(posts));
        this.backupPosts[this.currentArea.name] = posts;
        this.imageInPosts(this.superPosts[this.currentArea.name], this.currentArea.name);

        for (let i = 0; i <= this.backupPosts[this.currentArea.name].length - 1; i++) {
          this.backupPosts[this.currentArea.name][i].text = this.removeMarkdown(this.backupPosts[this.currentArea.name][i].text);
        }
        this.index = page;
        this.totalCount = superPost.count;
        this.cdRef.detectChanges();
        this.loading = false;
      });
  }

  goto(postID: string) {
    this.routeService.addNextRouteByIndex(this.index);
    this.router.navigateByUrl('/areas/' + this.currentArea.name + '/' + postID);
  }
}
