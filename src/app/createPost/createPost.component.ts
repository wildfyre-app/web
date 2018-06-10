import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { ConfirmDeletionDialogComponent } from '../_dialogs/confirmDeletion.dialog.component';
import { PictureDialogComponent } from '../_dialogs/picture.dialog.component';
import { PicturesDialogComponent } from '../_dialogs/pictures.dialog.component';
import { YouTubeDialogComponent } from '../_dialogs/youtube.dialog.component';
import { AreaList } from '../_models/areaList';
import { Author } from '../_models/author';
import * as C from '../_models/constants';
import { Image } from '../_models/image';
import { Post, PostError } from '../_models/post';
import { NavBarService } from '../_services/navBar.service';
import { PostService } from '../_services/post.service';
import { RouteService } from '../_services/route.service';

@Component({
  templateUrl: 'createPost.component.html'
})
export class CreatePostComponent implements OnInit, OnDestroy {
  componentDestroyed: Subject<boolean> = new Subject();
  currentArea: string;
  errors: PostError;
  isDraft = false;
  loading: boolean;
  post: Post = new Post(null, null, false, null, null, null, 's', null, [], []);

  constructor(
    private cdRef: ChangeDetectorRef,
    private dialog: MdDialog,
    private snackBar: MdSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private navBarService: NavBarService,
    private postService: PostService,
    private routeService: RouteService
  ) { }

  ngOnInit() {
    this.post.text = '';
    this.routeService.resetRoutes();

    this.navBarService.currentArea
      .takeUntil(this.componentDestroyed)
      .subscribe((currentArea: AreaList) => {
        this.currentArea = currentArea.name;

        this.route.params
          .takeUntil(this.componentDestroyed)
          .subscribe(params => {
            if (params['id'] !== undefined) {
              this.isDraft = true;

              this.postService.getPost(this.currentArea, params['id'], true)
                .takeUntil(this.componentDestroyed)
                .subscribe(post => {
                  this.post = post;
                  this.loading = false;

                  this.cdRef.detectChanges();
              });
            }
        });
    });
  }

  ngOnDestroy() {
    this.cdRef.detach();
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }

  private addLineBreak(s: string) {
    if (this.post.text !== '') {
      this.post.text += '\n';
    }
    this.post.text += s;
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
    this.addLineBreak('[img: ' + image.num  + ']\n');
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

  createPost(draft: boolean, publish: boolean = false) {
    this.loading = true;
    if (this.post.text !== '' && this.runImageCheck()) {
      this.postService.createPost(this.currentArea, this.post.text, this.post.anonym, this.post.image, draft, this.post.id)
        .takeUntil(this.componentDestroyed)
        .subscribe(result => {
          if (!result.getError()) {
            if (publish) {
              this.publishDraft();
            } else {
              this.post.text = '';
              let object = 'Post Created';
              if (draft) {
                object = 'Draft Saved';
              }
              const snackBarRef = this.snackBar.open(object + ' Successfully!', 'Close', {
                duration: 3000
              });
            }
            this.router.navigate(['']);
          } else {
            this.errors = result.getError();
            this.loading = false;
          }
        });
    } else {
      this.loading = false;
      if (this.post.text === '') {
        const snackBarRef = this.snackBar.open('You did not input anything', 'Close', {
          duration: 3000
        });
      }
    }
  }

  deleteImage() {
    this.postService.deleteImage(null, this.post.id, this.currentArea, this.post.text)
      .takeUntil(this.componentDestroyed)
      .subscribe(result2 => {
        this.post.image = result2.image;
        const snackBarRef = this.snackBar.open('Your image was deleted successfully', 'Close', {
          duration: 3000
        });
    });
  }

  deleteImages(image: Image) {
    const sourceString = '[img: ' + image.num + ']\n';
    this.postService.deleteImages(this.post.id, this.currentArea, image.num);
    for (let i = 0; i < this.post.additional_images.length; i++) {
      if (this.post.additional_images[i].num === image.num) {
        this.post.additional_images.splice(i, 1);
        this.post.text = this.post.text.replace(sourceString, '');
        this.post.text = this.post.text.replace('\n' + sourceString, '');
        const snackBarRef = this.snackBar.open('Image deleted successfully', 'Close', {
          duration: 3000
        });
        break;
      }
    }
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

  loadDrafts() {
    this.routeService.addNextRoute('/create');
    this.router.navigateByUrl('/drafts');
  }

  makeAnonymous(value: any) {
    this.post.anonym = value.checked;
  }

  publishDraft() {
    this.loading = true;
    if (this.post.text !== '') {
      this.createPost(true);
      this.postService.publishDraft(this.currentArea, this.post.id);
      this.post.text = '';
      const snackBarRef = this.snackBar.open('Post Created Successfully!', 'Close', {
        duration: 3000
      });
      this.router.navigate(['']);
      this.loading = false;
    } else {
      this.loading = false;
      const snackBarRef = this.snackBar.open('You did not input anything', 'Close', {
        duration: 3000
      });
    }
  }

  openDraftDeleteDialog() {
    const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent);
    dialogRef.afterClosed()
      .takeUntil(this.componentDestroyed)
      .subscribe(result => {
        if (result.bool) {
          this.postService.deletePost(this.currentArea, this.post.id, true);
          const snackBarRef = this.snackBar.open('Draft deleted successfully', 'Close', {
            duration: 3000
          });
          this.router.navigateByUrl('');
        }
      });
  }

  openPictureDialog() {
    const dialogRef = this.dialog.open(PictureDialogComponent);
    dialogRef.componentInstance.postID = this.post.id;
    dialogRef.afterClosed()
      .takeUntil(this.componentDestroyed)
      .subscribe(result => {
        if (result.bool) {
          if (result.picture) {
            if (this.post.id === null) {
              this.postService.createPost(this.currentArea, this.post.text + '.', this.post.anonym, '', true, this.post.id)
              .takeUntil(this.componentDestroyed)
              .subscribe(result3 => {
                this.postService.setPicture(result.picture, result3, this.currentArea)
                  .takeUntil(this.componentDestroyed)
                  .subscribe(result4 => {
                    if (result4) {
                      this.post.image = result4.image;
                      this.router.navigateByUrl('/create/' + result3.id);
                    } else {
                      if (result4 === null) {
                        const snackBarRef = this.snackBar.open(
                          'You have reached the maximum number of images allowed. Please delete some before continuing',
                          'Close', {
                          duration: 3000
                        });
                      } else {
                      const snackBarRef = this.snackBar.open('Your image file must be below 512KiB in size', 'Close', {
                        duration: 3000
                      });
                    }
                  }
                });
              });
            } else {
              this.postService.setPicture(result.picture, this.post, this.currentArea)
                .takeUntil(this.componentDestroyed)
                .subscribe(result2 => {
                  if (!result2.getError()) {
                  this.post.image = result2.image;
                } else {
                  const snackBarRef = this.snackBar.open('Your image file must be below 512KiB in size', 'Close', {
                    duration: 3000
                  });
                }
                });
            }
          } else {
            const snackBarRef = this.snackBar.open('You did not select a valid image file', 'Close', {
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
    dialogRef.componentInstance.area = this.currentArea;

    dialogRef.afterClosed()
      .takeUntil(this.componentDestroyed)
      .subscribe(result => {
        if (result.bool) {
          if (result.picture) {
            if (this.post.id === null) {
              this.postService.createPost(this.currentArea, this.post.text + '.', this.post.anonym, '', true, this.post.id)
                .takeUntil(this.componentDestroyed)
                .subscribe(result3 => {
                  this.postService.setDraftPictures(result.picture, result3, this.currentArea, result.comment, result.slot)
                    .takeUntil(this.componentDestroyed)
                    .subscribe(result4 => {
                      if (result4) {
                        this.post.additional_images.splice(result.slot, 0, result4);
                        this.router.navigateByUrl('/create/' + result3.id);
                      } else {
                        if (result4 === null) {
                          const snackBarRef = this.snackBar.open(
                            'You have reached the maximum number of images allowed. Please delete some before continuing',
                            'Close', {
                            duration: 3000
                          });
                        } else {
                        const snackBarRef = this.snackBar.open('Your image file must be below 1MB in size', 'Close', {
                          duration: 3000
                        });
                      }
                    }
                  });
                });
            } else {
              this.postService.setDraftPictures(result.picture, this.post, this.currentArea, result.comment, result.slot)
                .takeUntil(this.componentDestroyed)
                .subscribe(result2 => {
                  if (result2) {
                    this.post.additional_images.splice(result.slot, 0, result2);
                  } else {
                    if (result2 === null) {
                      const snackBarRef = this.snackBar.open(
                        'You have reached the maximum number of images allowed. Please delete some before continuing',
                        'Close', {
                        duration: 3000
                      });
                    } else {
                    const snackBarRef = this.snackBar.open('Your image file must be below 1MB in size', 'Close', {
                      duration: 3000
                    });
                  }
                }
              });
            }
          } else {
            const snackBarRef = this.snackBar.open('You did not select a valid image file', 'Close', {
              duration: 3000
            });
          }
        }
      });
  }

  openYoutubeDialog() {
    const dialogRef = this.dialog.open(YouTubeDialogComponent);
    dialogRef.afterClosed()
      .takeUntil(this.componentDestroyed)
      .subscribe(result => {
        if (result.url) {
          result.url = result.url.replace('https://', '');
          result.url = result.url.replace('http://', '');
          result.url = result.url.replace('www.', '');
          result.url = result.url.replace('m.', '');
          result.url = result.url.replace('youtube.com/watch?v=', '');
          result.url = result.url.replace('youtu.be/', '');
          result.url = result.url.replace('youtube.com/', '');

          if (result.url.indexOf('?') !== -1) {
            result.url = result.url.slice(0, result.url.indexOf('?'));
          }

          if (this.post.text === undefined) {
            this.post.text = '[![' + result.altText + '](https://img.youtube.com/vi/'
            + result.url + '/0.jpg)](https://www.youtube.com/watch?v=' + result.url + ')\n';
          } else {
            this.post.text = '[![' + result.altText + '](https://img.youtube.com/vi/'
            + result.url + '/0.jpg)](https://www.youtube.com/watch?v=' + result.url + ')\n' + this.post.text;
          }
      }
      });
  }

  runImageCheck(): boolean {
    let valid = true;
    const linkMatch = this.getImageMatchesByGroup(1, this.post.text, C.WF_IMAGE_REGEX);
    const usedMarkdownIndexes: string[] = [];
    const invalidMatch = this.getImageMatchesByGroup(2, this.post.text, /(\[img: (\d)\])/gm);

    // Find duplicates and invalids
    if (linkMatch.length <= 4) {
      if (!(linkMatch.length > 0 && this.post.additional_images.length === 0)) {
        if (invalidMatch.length > this.post.additional_images.length) {
          valid = false;
          const snackBarRef = this.snackBar.open(
            'This markdown does not work here',
             'Close', {
            duration: 3000
          });
        } else {
          for (let i = 0; i < invalidMatch.length; i++) {
            if (Number.parseInt(invalidMatch[i]) !== this.post.additional_images[i].num) {
              valid = false;
              const snackBarRef = this.snackBar.open(
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
              const snackBarRef = this.snackBar.open(
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
        const snackBarRef = this.snackBar.open(
          'This markdown does not work here',
           'Close', {
          duration: 3000
        });
      }
    } else {
      valid = false;
      const snackBarRef = this.snackBar.open('You have to much image markdown in your text, the limit is 4', 'Close', {
        duration: 3000
      });
    }
    return valid;
  }
}
