import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { ConfirmDeletionDialogComponent } from '../_dialogs/confirmDeletion.dialog.component';
import { AreaList } from '../_models/areaList';
import { Author } from '../_models/author';
import { PostError } from '../_models/post';
import { NavBarService } from '../_services/navBar.service';
import { PostService } from '../_services/post.service';
import { RouteService } from '../_services/route.service';

@Component({
  templateUrl: 'createPost.component.html'
})
export class CreatePostComponent implements OnInit, OnDestroy {
  anonymous = false;
  componentDestroyed: Subject<boolean> = new Subject();
  currentArea: string;
  errors: PostError;
  isDraft = false;
  loading: boolean;
  model: any = {};
  postID: number = null;

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
    this.model.card = '';
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
                  this.model.card =  post.text;
                  this.postID = post.id;
                  this.anonymous = post.anonym;
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
    if (this.model.card !== '') {
      this.model.card += '\n';
    }
    this.model.card += s;
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

  createPost(draft: boolean) {
    this.loading = true;
    if (this.model.card !== '') {
      this.postService.createPost(this.currentArea, this.model.card, this.anonymous, draft, this.postID)
        .takeUntil(this.componentDestroyed)
        .subscribe(result => {
          if (!result.getError()) {
            this.model.card = '';
            let object = 'Post Created';
            if (draft === true) {
              object = 'Draft Saved';
            }
            const snackBarRef = this.snackBar.open(object + ' Successfully!', 'Close', {
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
      const snackBarRef = this.snackBar.open('You did not input anything', 'Close', {
        duration: 3000
      });
    }
  }

  loadDrafts() {
    this.routeService.addNextRoute('/create');
    this.router.navigateByUrl('/drafts');
  }

  makeAnonymous(value: any) {
    this.anonymous = value.checked;
  }

  publishDraft() {
    this.loading = true;
    if (this.model.card !== '') {
      this.createPost(true);
      this.postService.publishDraft(this.currentArea, this.postID)
        .takeUntil(this.componentDestroyed)
        .subscribe(result => {
          if (!result.getError()) {
            this.model.card = '';
            const snackBarRef = this.snackBar.open('Post Created Successfully!', 'Close', {
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
          this.postService.deletePost(this.currentArea, this.postID, true);
          const snackBarRef = this.snackBar.open('Draft deleted successfully', 'Close', {
            duration: 3000
          });
          this.router.navigateByUrl('');
        }
      });
  }

  openPictureDialog() {
    const dialogRef = this.dialog.open(PictureDialogComponent);
    dialogRef.afterClosed()
      .takeUntil(this.componentDestroyed)
      .subscribe(result => {
        if (result.url) {
          if (this.model.card === undefined) {
            this.model.card = '[![' + result.altText + '](' + result.url + ' "' + result.description + '")](' + result.url + ')\n';
          } else {
            this.model.card = '[![' + result.altText + '](' + result.url + ' "'
              + result.description + '")](' + result.url + ')\n' + this.model.card;
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

          if (this.model.card === undefined) {
            this.model.card = '[![' + result.altText + '](https://img.youtube.com/vi/'
            + result.url + '/0.jpg)](https://www.youtube.com/watch?v=' + result.url + ')\n';
          } else {
            this.model.card = '[![' + result.altText + '](https://img.youtube.com/vi/'
            + result.url + '/0.jpg)](https://www.youtube.com/watch?v=' + result.url + ')\n' + this.model.card;
          }
      }
      });
  }
}

@Component({
  template: `
  <h1 md-dialog-title>Enter in the picture information</h1>

    <div md-dialog-actions>
      <md-input-container>
        <input mdInput name="comment" type="text" name="url"
        [(ngModel)]="model.url" #url="ngModel" placeholder="Url of picture, must start with https">
      </md-input-container>
      <md-input-container>
        <input mdInput name="comment" type="text" name="description"
        [(ngModel)]="model.description" #description="ngModel" placeholder="Describe your picture">
      </md-input-container>
      <md-input-container>
        <input mdInput name="comment" type="text" name="altText"
        [(ngModel)]="model.altText" #altText="ngModel" placeholder="Alt text if the picture gets removed">
      </md-input-container>
    </div>

  <div md-dialog-actions>
    <button md-button md-dialog-close="true" (click)="sendPictureInformation()">Ok</button>
    <button md-button md-dialog-close="false">Cancel</button>
  </div>
  `
})
export class PictureDialogComponent {
  model: any = {};
  constructor(
    public dialogRef: MdDialogRef<PictureDialogComponent>
    ) { }

    sendPictureInformation() {
      const message = {
        'url': this.model.url,
        'description' : this.model.description,
        'altText' : this.model.altText
      };

      this.dialogRef.close(message);
    }
}

@Component({
  template: `
  <h1 md-dialog-title>Enter in the YouTube information</h1>

    <div md-dialog-actions>
      <md-input-container>
        <input mdInput name="comment" type="text" name="url"
        [(ngModel)]="model.url" #url="ngModel" placeholder="Url of full youtube link">
      </md-input-container>
      <md-input-container>
        <input mdInput name="comment" type="text" name="altText"
        [(ngModel)]="model.altText" #altText="ngModel" placeholder="Alt text if the video gets removed">
      </md-input-container>
    </div>

  <div md-dialog-actions>
    <button md-button md-dialog-close="true" (click)="sendYouTubeInformation()">Ok</button>
    <button md-button md-dialog-close="false">Cancel</button>
  </div>
  `
})
export class YouTubeDialogComponent {
  model: any = {};
  constructor(
    public dialogRef: MdDialogRef<YouTubeDialogComponent>
    ) { }

    sendYouTubeInformation() {
      const message = {
        'url': this.model.url,
        'altText' : this.model.altText
      };

      this.dialogRef.close(message);
    }
}
