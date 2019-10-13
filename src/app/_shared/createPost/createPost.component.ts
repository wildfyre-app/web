import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmDeletionDialogComponent } from '../../_dialogs/confirmDeletion.dialog.component';
import { PictureDialogComponent } from '../../_dialogs/picture.dialog.component';
import { PicturesDialogComponent } from '../../_dialogs/pictures.dialog.component';
import { YouTubeDialogComponent } from '../../_dialogs/youtube.dialog.component';
import { Area } from '../../_models/area';
import * as C from '../../_models/constants';
import { Image } from '../../_models/image';
import { Post, PostError } from '../../_models/post';
import { AreaService } from '../../_services/area.service';
import { PostService } from '../../_services/post.service';
import { RouteService } from '../../_services/route.service';

@Component({
  templateUrl: 'createPost.component.html',
  styleUrls: ['./createPost.component.scss']
})
export class CreatePostComponent implements OnInit, OnDestroy {
  backupPosts: { [area: string]: Post[]; } = {};
  componentDestroyed: Subject<boolean> = new Subject();
  currentArea: Area;
  errors: PostError;
  imageArray: { [area: string]: string[]; } = {};
  imageData: any;
  index = 1;
  isDraft = false;
  limit = 10;
  loading: boolean;
  offset = 10;
  post: Post = new Post(null, null, false, null, null, null, 's', null, [], []);
  postForm: FormGroup;
  preview = false;
  superPosts: { [area: string]: Post[]; } = {};
  totalCount = 0;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private areaService: AreaService,
    private postService: PostService,
    private routeService: RouteService
  ) { }

  ngOnInit() {
    this.postForm = new FormGroup({
      'post': new FormControl(''),
    });

    this.routeService.resetRoutes();

    this.route.params.pipe(
    takeUntil(this.componentDestroyed))
    .subscribe(params => {
      if (params['area'] !== undefined) {
        this.areaService.getArea(params['area']).subscribe(area => {
          this.currentArea = area;

          this.route.params.pipe(
          takeUntil(this.componentDestroyed))
          .subscribe(params2 => {
            if (params2['id'] !== undefined) {
              this.isDraft = true;

              this.postService.getPost(this.currentArea.name, params2['id'], true).pipe(
                takeUntil(this.componentDestroyed))
                .subscribe(post => {
                  this.post = post;
                  this.loading = false;
                  this.cdRef.detectChanges();
                });
              }
          });
        });
      }
    });
  }

  ngOnDestroy() {
    this.cdRef.detach();
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }

  private addLineBreak(s: string) {
    this.postForm.controls.post.setValue(
      this.postForm.controls.post.value !== '' ? this.postForm.controls.post.value + `${s}\n` : `${s}\n`
    );
  }

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

  addBlockQoutes() {
    this.addLineBreak('> Blockquote example\n> This line is part of the same quote.\n\nQuote break.\n\n>'
    + ' This is a very long line that will still be quoted properly when it wraps. You can *put* **Markdown** into a blockquote.');
  }

  addBold() {
    this.addLineBreak('**Example**');
  }

  addCode() {
    this.addLineBreak('Inline `code` has `back-ticks around` it.\n```javascript\n'
    + 'var s = "JavaScript syntax highlighting";\nalert(s);\n```');
  }

  addHeader(num: number) {
    switch (num) {
      case 1:
      this.addLineBreak('# h1\n');
      break;

      case 2:
      this.addLineBreak('## h2\n');
      break;

      case 3:
      this.addLineBreak('### h3\n');
      break;

      case 4:
      this.addLineBreak('#### h4\n');
      break;

      case 5:
      this.addLineBreak('##### h5\n');
      break;

      case 6:
      this.addLineBreak('###### h6\n');
      break;
      }
  }

  addHorizontalRule() {
    this.addLineBreak('---\n');
  }

  addImage(image: Image) {
    this.addLineBreak(`[img: ${image.num}]\n`);
  }

  addItalics() {
    this.addLineBreak('_Example_');
  }

  addOrderedList() {
    this.addLineBreak('1. First ordered item\n2. Another item\n  * Unordered sub-list.');
  }

  addStrikethrough() {
    this.addLineBreak('~~Example~~');
  }

  addTable() {
    this.addLineBreak('| Tables        | Are           | Cool  |\n| ------------- |:-------------:| -----:|\n'
    + '| col 3 is      | right-aligned | $1600 |\n| col 2 is      | centered      |   $12 |\n| zebra stripes | are neat      |    $1 |');
  }

  addUnorderedList() {
    this.addLineBreak('* Unordered list can use asterisks\n- Or minuses\n+ Or pluses');
  }

  back() {
    if (this.routeService.routes.length === 0) {
      this.router.navigateByUrl('');
    } else {
      this.router.navigateByUrl(this.routeService.getNextRoute());
    }
  }

  createPost(draft: boolean) {
    this.loading = true;
    this.cdRef.detectChanges();
    if (this.postForm.controls.post.value !== '' && this.runImageCheck()) {
      this.postService.createPost(
        this.currentArea.name,
        this.postForm.controls.post.value,
        this.post.anonym,
        this.imageData,
        draft,
        this.post.id
      ).pipe(
      takeUntil(this.componentDestroyed))
      .subscribe(result => {
        if (!result.getError()) {
          this.postForm.controls.post.setValue('');
          let object = 'Post Created';
          if (draft) {
            object = 'Draft Saved';
          }
          this.snackBar.open(object + ' Successfully!', 'Close', {
            duration: 3000
          });
          this.router.navigate(['']);
        } else {
          this.errors = result.getError();
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
      if (this.postForm.controls.post.value === '') {
        this.snackBar.open('You did not input anything', 'Close', {
          duration: 3000
        });
      }
    }
  }

  deleteImage() {
    this.postService.deleteImage(null, this.post.id, this.currentArea.name, this.postForm.controls.post.value.post.text).pipe(
      takeUntil(this.componentDestroyed))
      .subscribe(result2 => {
        this.post.image = '';
        this.imageData = null;
        this.snackBar.open('Your image was deleted successfully', 'Close', {
          duration: 3000
        });
    });
  }

  deleteImages(image: Image) {
    const sourceString = '[img: ' + image.num + ']\n';
    this.postService.deleteImages(this.post.id, this.currentArea.name, image.num);
    for (let i = 0; i < this.post.additional_images.length; i++) {
      if (this.post.additional_images[i].num === image.num) {
        this.post.additional_images.splice(i, 1);

        this.postForm.controls.post.setValue(
          String(this.postForm.controls.post.value)
            .replace(sourceString, '')
            .replace('\n' + sourceString, '')
        );
        this.cdRef.detectChanges();
        this.snackBar.open('Image deleted successfully', 'Close', {
          duration: 3000
        });
        break;
      }
    }
  }

  draftEditor() {
    this.preview = false;
  }

  getDrafts(page: number) {
    this.loading = true;
    const posts: Post[] = [];

    this.postService.getDrafts(this.currentArea.name, this.limit, (this.offset * page) - this.limit).pipe(
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

  getImageMatchesByGroup(index: number, str: string, reg: RegExp): string[] {
    let match: any;
    const matches: string[] = [];
    // Find any occurence of image markdown
    while ((match = reg.exec(str))) {
      if (match[index] !== undefined) {
        matches.push(match[index]);
      }
    }
    return matches;
  }

  makeAnonymous(value: any) {
    this.post.anonym = value.checked;
  }

  openDraftDeleteDialog() {
    const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent);
    dialogRef.afterClosed().pipe(
      takeUntil(this.componentDestroyed))
      .subscribe(result => {
        if (result.bool) {
          this.postService.deletePost(this.currentArea.name, this.post.id, true);
          this.snackBar.open('Draft deleted successfully', 'Close', {
            duration: 3000
          });
          this.router.navigateByUrl('');
        }
      });
  }

  openPictureDialog() {
    const dialogRef = this.dialog.open(PictureDialogComponent);
    dialogRef.afterClosed().pipe(
      takeUntil(this.componentDestroyed))
      .subscribe(result => {
        if (this.postForm.controls.post.value === '') {
          this.postForm.controls.post.setValue(this.postForm.controls.post.value + '.');
        }
        if (result.bool) {
          if (result.picture) {
            if (this.post.id === null) {
              this.postService.createPost(
                this.currentArea.name,
                this.postForm.controls.post.value,
                this.post.anonym,
                '',
                true,
                this.post.id
              ).pipe(
              takeUntil(this.componentDestroyed))
              .subscribe(result3 => {
                this.postService.setPicture(result.picture, result3, this.currentArea.name).pipe(
                  takeUntil(this.componentDestroyed))
                  .subscribe(result4 => {
                    if (result4) {
                      this.imageData = result4.image;
                      this.router.navigateByUrl('/create/' + result3.id);
                    } else {
                      if (result4 === null) {
                        this.snackBar.open(
                          'You have reached the maximum number of images allowed. Please delete some before continuing',
                          'Close', {
                          duration: 3000
                        });
                      } else {
                      this.snackBar.open('Your image file must be below 512KiB in size', 'Close', {
                        duration: 3000
                      });
                    }
                  }
                });
              });
            } else {
              this.postService.setPicture(result.picture, this.post, this.currentArea.name).pipe(
                takeUntil(this.componentDestroyed))
                .subscribe(result2 => {
                  if (!result2.getError()) {
                  this.post.image = result2.image;
                } else {
                  this.snackBar.open('Your image file must be below 512KiB in size', 'Close', {
                    duration: 3000
                  });
                }
                });
            }
          } else {
            this.snackBar.open('You did not select a valid image file', 'Close', {
              duration: 3000
            });
          }
        }
      });
  }

  openPicturesDialog() {
    const dialogRef = this.dialog.open(PicturesDialogComponent);
    let filledSlots: number[] = [];

    if (this.post.additional_images !== []) {
      filledSlots = this.post.additional_images.map(image => image.num);
    }

    dialogRef.componentInstance.nums_taken = filledSlots;
    dialogRef.componentInstance.post = this.post;
    dialogRef.componentInstance.area = this.currentArea.name;

    dialogRef.afterClosed().pipe(
      takeUntil(this.componentDestroyed))
      .subscribe(result => {
        if (this.postForm.controls.post.value === '') {
          this.postForm.controls.post.setValue(this.postForm.controls.post.value + '.');
        }
        if (result.bool) {
          if (result.picture) {
            if (this.post.id === null) {
              this.postService.createPost(
                this.currentArea.name,
                this.postForm.controls.post.value,
                this.post.anonym,
                '',
                true,
                this.post.id
              ).pipe(
              takeUntil(this.componentDestroyed))
              .subscribe(result3 => {
                this.postService.setDraftPictures(result.picture, result3, this.currentArea.name, result.comment, result.slot).pipe(
                  takeUntil(this.componentDestroyed))
                  .subscribe(result4 => {
                    if (result4) {
                      this.post.additional_images.splice(result.slot, 0, result4);
                      this.router.navigateByUrl('/create/' + result3.id);
                    } else {
                      if (result4 === null) {
                        this.snackBar.open(
                          'You have reached the maximum number of images allowed. Please delete some before continuing',
                          'Close', {
                          duration: 3000
                        });
                      } else {
                      this.snackBar.open('Your image file must be below 1MB in size', 'Close', {
                        duration: 3000
                      });
                    }
                  }
                });
              });
            } else {
              this.postService.setDraftPictures(result.picture, this.post, this.currentArea.name, result.comment, result.slot).pipe(
                takeUntil(this.componentDestroyed))
                .subscribe(result2 => {
                  if (result2) {
                    this.post.additional_images.splice(result.slot, 0, result2);
                  } else {
                    if (result2 === null) {
                      this.snackBar.open(
                        'You have reached the maximum number of images allowed. Please delete some before continuing',
                        'Close', {
                        duration: 3000
                      });
                    } else {
                    this.snackBar.open('Your image file must be below 1MB in size', 'Close', {
                      duration: 3000
                    });
                  }
                }
              });
            }
          } else {
            this.snackBar.open('You did not select a valid image file', 'Close', {
              duration: 3000
            });
          }
        }
      });
  }

  openYoutubeDialog() {
    const dialogRef = this.dialog.open(YouTubeDialogComponent);
    dialogRef.afterClosed().pipe(
      takeUntil(this.componentDestroyed))
      .subscribe(result => {
        if (result.url) {
          result.url = result.url
          .replace('https://', '')
          .replace('http://', '')
          .replace('http://', '')
          .replace('www.', '')
          .replace('m.', '')
          .replace('youtube.com/watch?v=', '')
          .replace('youtu.be/', '')
          .replace('youtube.com/', '');

          if (result.url.indexOf('?') !== -1) {
            result.url = result.url.slice(0, result.url.indexOf('?'));
          }
          this.postForm.controls.post.setValue(this.postForm.controls.post.value === undefined ?
            `[![${result.altText}](https://img.youtube.com/vi/${result.url}/0.jpg)](https://www.youtube.com/watch?v=${result.url})\n` :
            `[![${result.altText}](https://img.youtube.com/vi/${result.url}/0.jpg)](https://www.youtube.com/watch?v=${result.url})\n
              ${this.postForm.controls.post.value}`
          );
        }
      });
  }

  previewDraft() {
    this.preview = true;
  }

  publishDraft() {
    this.loading = true;
    this.cdRef.detectChanges();
    if (this.postForm.controls.post.value !== '' && this.runImageCheck()) {
      this.postService.createPost(
        this.currentArea.name,
        this.postForm.controls.post.value,
        this.post.anonym,
        this.imageData,
        true,
        this.post.id
      ).pipe(
      takeUntil(this.componentDestroyed))
      .subscribe(result => {
        if (!result.getError()) {
          this.postService.publishDraft(this.currentArea.name, this.post.id);
          this.postForm.controls.post.setValue('');
          this.snackBar.open('Post Created Successfully!', 'Close', {
            duration: 3000
          });
          this.router.navigate(['']);
        } else {
          this.errors = result.getError();
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
      this.snackBar.open('You did not input anything or you have unsupported markdown', 'Close', {
        duration: 3000
      });
    }
  }

  runImageCheck(): boolean {
    this.cdRef.detectChanges();
    let valid = true;
    const linkMatch = this.getImageMatchesByGroup(1, this.postForm.controls.post.value, C.WF_IMAGE_REGEX);
    const usedMarkdownIndexes: string[] = [];
    const invalidMatch = this.getImageMatchesByGroup(2, this.postForm.controls.post.value, C.WF_IMAGE_REGEX);

    // Find duplicates and invalids
    if (linkMatch.length <= 4) {
      if (linkMatch.length > this.post.additional_images.length) {
        valid = false;
        this.snackBar.open(
          'This markdown does not work here',
           'Close', {
          duration: 3000
        });
      } else {
        for (let i = 0; i < invalidMatch.length; i++) {
          if (parseInt(invalidMatch[i], 10) !== this.post.additional_images[i].num) {
            valid = false;
            this.snackBar.open(
              'This markdown does not work here',
               'Close', {
              duration: 3000
            });
          }
        }
      }
      for (let z = 0; z < linkMatch.length; z++) {
        if (valid) {
          if (usedMarkdownIndexes.indexOf(linkMatch[z]) !== -1) {
            valid = false;
            this.snackBar.open(
              'It appears as if you have duplicate image markdown, we do not allow this',
               'Close', {
              duration: 3000
            });
          } else {
            usedMarkdownIndexes.push(linkMatch[z]);
          }
        }
      }
    } else {
      valid = false;
      this.snackBar.open('You have to much image markdown in your text, the limit is 4', 'Close', {
        duration: 3000
      });
    }
    return valid;
  }
}
