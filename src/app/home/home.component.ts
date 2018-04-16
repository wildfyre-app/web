import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { ConfirmDeletionComponent } from '../_dialogs/confirmDeletion.component';
import { AreaList } from '../_models/areaList';
import { Author } from '../_models/author';
import { Comment } from '../_models/comment';
import { Post } from '../_models/post';
import { Reputation } from '../_models/reputation';
import { CommentService } from '../_services/comment.service';
import { FlagService } from '../_services/flag.service';
import { NavBarService } from '../_services/navBar.service';
import { PostService } from '../_services/post.service';
import { ProfileService } from '../_services/profile.service';
import { RouteService } from '../_services/route.service';

@Component({
  templateUrl: 'home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  private systemAuthor: Author = new Author(375, 'WildFyre', '', '', false);
  private typeOfReport = TypeOfReport;
  areaCheck: string;
  commentCount = 0;
  componentDestroyed: Subject<boolean> = new Subject();
  currentArea: string;
  expanded = false;
  fakePost: Post = new Post(0, this.systemAuthor, false, false, Date(), false,
    'No more posts in this area, try creating one?', []);
  heightText: string;
  isCopied = false;
  loading = true;
  model: any = {};
  post: Post = this.fakePost;
  rep: Reputation;
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
    private commentService: CommentService,
    private flagService: FlagService,
    private navBarService: NavBarService,
    private postService: PostService,
    private profileService: ProfileService,
    private routeService: RouteService
  ) { }

  ngOnInit() {
    this.cdRef.detectChanges();
    this.loading = true;
    this.model.comment = '';
    this.routeService.resetRoutes();

    this.profileService.getSelf()
      .takeUntil(this.componentDestroyed)
      .subscribe( (author: Author) => {
        this.userID = author.user;
    });
    this.refresh(true);
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
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

  contractBox() {
    this.expanded = false;
    this.rowsExapanded = 2;
    this.navBarService.isVisibleSource.next('');

    if (window.screen.width > 600) {
      this.styleTextBottom = '0px';
      this.styleCommentBottom = '0px';
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
      this.styleCommentBottom = '0px';
      this.styleEditorBottom = '41px';
      this.heightText = '71px';
    } else {
      this.styleTextBottom = '0px';
      this.styleCommentBottom = '0px';
      this.styleEditorBottom = '33px';
      this.heightText = '71px';
    }
  }

  getCommentLink(commentID: number) {
    return 'https://client.wildfyre.net/areas/' + this.currentArea + '/' + this.post.id + '/' + commentID;
  }

  getPostLink(postID: number) {
    return 'https://client.wildfyre.net/areas/' + this.currentArea + '/' + postID;
  }

  gotoUser(user: string) {
    this.routeService.addNextRoute(this.router.url);
    this.router.navigateByUrl('/user/' + user);
  }

  openCommentDeleteDialog(c: Comment) {
    const dialogRef = this.dialog.open(ConfirmDeletionComponent);
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
    this.contractBox();
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

  postComment() {
    this.cdRef.detectChanges();
    this.postService.comment(this.currentArea, this.post, this.model.comment)
      .takeUntil(this.componentDestroyed)
      .subscribe();
    this.cdRef.detectChanges();
    this.contractBox();
    this.commentCount += 1;
    this.model.comment = '';
  }

  refresh(reload: boolean) {
    this.loading = true;
    this.navBarService.currentArea
      .takeUntil(this.componentDestroyed)
      .subscribe((currentArea: AreaList) => {
        this.currentArea = currentArea.name;

        if (reload === true || this.areaCheck !== currentArea.name) {
          this.postService.getNextPost(currentArea.name)
            .takeUntil(this.componentDestroyed)
            .subscribe(nextPost => {
              if (nextPost) {
                this.post = nextPost;
                this.commentCount = this.post.comments.length;
                this.loading = false;
                this.areaCheck = this.currentArea;
                this.cdRef.detectChanges();
              } else {
                this.fakePost = new Post(0, this.systemAuthor, false, false,
                  Date(), false, 'No more posts in this area, try creating one?', []);
                this.post = this.fakePost;
                this.commentCount = 0;
                this.loading = false;
                this.areaCheck = this.currentArea;
                this.cdRef.detectChanges();
              }
          });
        } else {
          this.postService.getPost(this.currentArea, this.post.id.toString())
            .takeUntil(this.componentDestroyed)
            .subscribe(post => {
              this.post =  post;
              this.commentCount = this.post.comments.length;
              this.loading = false;
              this.areaCheck = this.currentArea;
              this.cdRef.detectChanges();
          });
        }
    });

    if (window.screen.width > 600) {
      this.styleTextBottom = '0px';
      this.styleCommentBottom = '0px';
    } else {
      this.styleTextBottom = '42px';
      this.styleCommentBottom = '44px';
    }

    this.cdRef.detectChanges();
  }

  spread(spread: boolean) {
    this.loading = true;
    this.contractBox();
    this.cdRef.detectChanges();
    this.postService.spread(
      this.currentArea,
      this.post,
      spread
    );

    this.postService.getNextPost(this.currentArea)
      .subscribe(nextPost => {
        if (nextPost) {
          this.post = nextPost;
          this.loading = false;
          this.cdRef.detectChanges();
        } else {
          this.fakePost = new Post(0, this.systemAuthor, false, false,
            Date(), false, 'No more posts in this area, try creating one?', []);
          this.post = this.fakePost;
          this.loading = false;
          this.cdRef.detectChanges();
        }
      });
  }

  subscribe(s: boolean) {
    this.postService.subscribe(this.currentArea, this.post, s)
      .takeUntil(this.componentDestroyed)
      .subscribe();
  }
}

enum TypeOfReport {
  Post,
  Comment
}
