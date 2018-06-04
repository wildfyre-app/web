import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { ConfirmDeletionDialogComponent } from '../_dialogs/confirmDeletion.dialog.component';
import { ShareDialogComponent } from '../_dialogs/share.dialog.component';
import { Author } from '../_models/author';
import { Comment } from '../_models/comment';
import { Link } from '../_models/link';
import { Post } from '../_models/post';
import { AuthenticationService } from '../_services/authentication.service';
import { CommentService } from '../_services/comment.service';
import { FlagService } from '../_services/flag.service';
import { NavBarService } from '../_services/navBar.service';
import { PostService } from '../_services/post.service';
import { ProfileService } from '../_services/profile.service';
import { RouteService } from '../_services/route.service';

enum TypeOfReport {
  Post,
  Comment
}

@Component({
  templateUrl: 'postView.component.html',
})
export class PostViewComponent implements OnInit, OnDestroy {
  private typeOfReport = TypeOfReport;
  commentCount = 0;
  componentDestroyed: Subject<boolean> = new Subject();
  currentArea: string;
  editName: string;
  expanded = false;
  heightText: string;
  isCopied = false;
  loading: boolean;
  loggedIn = false;
  model: any = {};
  parsedCommentArray: string[] = [];
  post: Post;
  rowsExapanded = 2;
  styleCommentBottom: string;
  styleEditorBottom: string;
  styleTextBottom: string;
  userID: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dialog: MdDialog,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MdSnackBar,
    private authenticationService: AuthenticationService,
    private commentService: CommentService,
    private flagService: FlagService,
    private navBarService: NavBarService,
    private postService: PostService,
    private profileService: ProfileService,
    private routeService: RouteService,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.model.comment = '';

    if (window.screen.width > 600) {
      this.styleTextBottom = '0px';
      this.styleCommentBottom = '-1px';
    } else {
      this.styleTextBottom = '42px';
      this.styleCommentBottom = '44px';
    }

    if (this.authenticationService.token) {
      this.profileService.getSelf()
        .takeUntil(this.componentDestroyed)
        .subscribe( (author: Author) => {
          this.userID = author.user;
          this.loggedIn = true;
        });
    }

    this.route.params
      .takeUntil(this.componentDestroyed)
      .subscribe(params => {
        this.currentArea = params['area'];

        this.postService.getPost(this.currentArea, params['id'])
          .takeUntil(this.componentDestroyed)
          .subscribe(post => {
            this.post =  post;
            this.commentCount = this.post.comments.length;
            this.loading = false;
            this.cdRef.detectChanges();
        });

        let commentIDArray = params['comments'];
        commentIDArray = commentIDArray + '-';

        if (commentIDArray) {
          while (commentIDArray.indexOf('-') !== -1) {
            this.parsedCommentArray.push(commentIDArray.slice(0, commentIDArray.indexOf('-')));
            commentIDArray = commentIDArray.slice(commentIDArray.indexOf('-') + 1, commentIDArray.length);
          }
        }
    });
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.contractBox();
    this.cdRef.detach();
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }

  private addLineBreak(s: string) {
    if (this.model.comment !== '') {
      this.model.comment += '\n';
    }
    this.model.comment += s;
  }

  addBlockQoutes() {
    this.addLineBreak('> Blockquote example');
  }

  addBold() {
    this.addLineBreak('**Example**');
  }

  addItalics() {
    this.addLineBreak('_Example_');
  }

  addStrikethrough() {
    this.addLineBreak('~~Example~~');
  }

  back() {
    if (this.routeService.routes.length === 0) {
      this.router.navigateByUrl('');
    } else {
      this.router.navigateByUrl(this.routeService.getNextRoute());
    }
  }

  contractBox() {
    this.expanded = false;
    this.rowsExapanded = 2;
    this.navBarService.isVisibleSource.next('');

    if (window.screen.width > 600) {
      this.styleTextBottom = '0px';
      this.styleCommentBottom = '-1px';
      this.heightText = '56px';
    } else {
      this.styleTextBottom = '42px';
      this.styleCommentBottom = '44px';
      this.heightText = '40px';
    }
  }

  expandBox() {
    this.expanded = true;
    this.rowsExapanded = 3;
    this.navBarService.isVisibleSource.next('none');
    if (window.screen.width > 600) {
      this.styleTextBottom = '0px';
      this.styleCommentBottom = '-5px';
      this.styleEditorBottom = '30px';
      this.heightText = '71px';
    } else {
      this.styleTextBottom = '0px';
      this.styleCommentBottom = '0px';
      this.styleEditorBottom = '33px';
      this.heightText = '71px';
    }
  }

  getCommentLength(nLength: number) {
    if (nLength.toString().length === 4) {
      return nLength.toString().slice(0, 1) + 'K';
    } else if (nLength.toString().length === 5) {
      return nLength.toString().slice(0, 2) + 'K';
    } else if (nLength.toString().length >= 6) {
      return '\u221E';
    } else {
      return nLength.toString();
    }
  }

  gotoUser(user: string) {
    this.routeService.addNextRoute(this.router.url);
    this.router.navigateByUrl('/user/' + user);
  }

  notificationIndication(commentID: number) {
    if (this.parsedCommentArray.indexOf(commentID.toString()) !== -1) {
      return '2px solid #ed763e';
    } else {
      return '';
    }
  }

  openCommentDeleteDialog(c: Comment) {
    const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent);
    dialogRef.afterClosed()
      .takeUntil(this.componentDestroyed)
      .subscribe(result => {
        if (result.bool) {
          this.commentService.deleteComment(
            this.currentArea,
            this.post,
            c
          );
          this.commentCount -= 1;
          const snackBarRef = this.snackBar.open('Comment deleted successfully', 'Close', {
            duration: 3000
          });
        }
      });
  }

  openFlagDialog(post: Post, comment: Comment, typeOfFlagReport: TypeOfReport) {
    this.flagService.currentComment = comment;
    this.flagService.currentPost = post;

    switch (typeOfFlagReport) {
      case TypeOfReport.Post:
        this.flagService.openDialog(TypeOfReport.Post);
        break;
      case TypeOfReport.Comment:
        this.flagService.openDialog(TypeOfReport.Comment);
        break;
    }
  }

  openPostDeleteDialog() {
    const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent);
    dialogRef.afterClosed()
      .takeUntil(this.componentDestroyed)
      .subscribe(result => {
        if (result.bool) {
          this.postService.deletePost(this.currentArea, this.post.id, false);
          const snackBarRef = this.snackBar.open('Post deleted successfully', 'Close', {
            duration: 3000
          });
          this.router.navigateByUrl(this.routeService.getNextRoute());
        }
      });
  }

  postComment() {
    this.cdRef.detectChanges();
    this.postService.comment(this.currentArea, this.post, this.model.comment)
      .takeUntil(this.componentDestroyed)
      .subscribe();
    this.model.comment = '';
    this.contractBox();
    this.commentCount += 1;
    this.cdRef.detectChanges();
  }

  share(commentID: number) {
    let commentURL = '';
    let authorName = this.post.author.name;
    let description = this.post.text.slice(0, 100);

    if (commentID !== undefined) {
      commentURL = '/' + commentID.toString();

      for (let i = 0; i < this.post.comments.length; i++) {
        if (this.post.comments[i].id === commentID) {
          authorName = this.post.comments[i].author.name;
          description = this.post.comments[i].text.slice(0, 100);
        }
      }
    }

    this.navBarService.link.next(
      new Link('https://client.wildfyre.net/areas/' + this.currentArea + '/' + this.post.id + commentURL,
      description,
      authorName
    ));
    const dialogRef = this.dialog.open(ShareDialogComponent);
    dialogRef.afterClosed()
      .takeUntil(this.componentDestroyed)
      .subscribe(result => {
        if (result.isLink) {
          const snackBarRef = this.snackBar.open('Link copied successfully', 'Close', {
            duration: 3000
          });
        }
      });
  }

  subscribe(s: boolean) {
    this.postService.subscribe(this.currentArea, this.post, s)
      .takeUntil(this.componentDestroyed)
      .subscribe();
  }
}
