import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmDeletionComponent } from '../_dialogs/confirmDeletion.component';
import { Area } from '../_models/area';
import { Author } from '../_models/author';
import { Comment } from '../_models/comment';
import { Post } from '../_models/post';
import { Reputation } from '../_models/reputation';
import { AreaService } from '../_services/area.service';
import { CommentService } from '../_services/comment.service';
import { FlagService } from '../_services/flag.service';
import { NavBarService } from '../_services/navBar.service';
import { NotificationService } from '../_services/notification.service';
import { PostService } from '../_services/post.service';
import { ProfileService } from '../_services/profile.service';
import { RouteService } from '../_services/route.service';

@Component({
  templateUrl: 'home.component.html',
})
export class HomeComponent implements OnInit {
  private typeOfReport = TypeOfReport;
  systemAuthor: Author = new Author(375, 'WildFyre', '', '', false);
  fakePost: Post = new Post(0, this.systemAuthor, false, Date(), false,
    'No more posts in this area, try creating one?', []);
  checked: boolean;
  expanded = false;
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
  text = 'https://client.wildfyre.net/';
  userID: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dialog: MdDialog,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MdSnackBar,
    private areaService: AreaService,
    private commentService: CommentService,
    private flagService: FlagService,
    private navBarService: NavBarService,
    private notificationService: NotificationService,
    private postService: PostService,
    private profileService: ProfileService,
    private routeService: RouteService
  ) {
    this.checked = this.areaService.isAreaChecked;
    this.model.comment = '';

    this.profileService.getSelf()
      .subscribe( (author: Author) => {
        this.userID = author.user;
    });
  }

  ngOnInit() {
    this.routeService.resetRoutes();
    this.cdRef.detectChanges();
    this.loading = true;
    if (window.screen.width > 600) {
      this.styleTextBottom = '0px';
      this.styleCommentBottom = '-1px';
    } else {
      this.styleTextBottom = '42px';
      this.styleCommentBottom = '44px';
    }

    this.postService.getNextPost(this.areaService.currentAreaName)
      .subscribe(nextPost => {
        if (nextPost) {
          this.text = 'https://client.wildfyre.net/areas/' + this.areaService.currentAreaName + '/' + nextPost.id;
          this.post = nextPost;
          this.loading = false;
          this.cdRef.detectChanges();
        } else {
          this.text = 'https://client.wildfyre.net';
          this.fakePost = new Post(0, this.systemAuthor, false,
            Date(), false, 'No more posts in this area, try creating one?', []);
          this.post = this.fakePost;
          this.loading = false;
          this.cdRef.detectChanges();
        }
      });

    this.areaService.getAreaRep(this.areaService.currentAreaName)
      .subscribe(reputation => {
        this.rep = reputation;
      });
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

  getCommentLink(commentID: number) {
    return 'https://client.wildfyre.net/areas/' + this.areaService.currentAreaName + '/' + this.post.id + '/' + commentID;
  }

  gotoUser(user: string) {
    this.routeService.addNextRoute(this.router.url);
    this.router.navigateByUrl('/user/' + user);
  }

  onChange(value: any) {
    this.contractBox();
    this.loading = true;

    this.cdRef.detectChanges();
    if (value.checked === true) {
      this.areaService.isAreaChecked = true;
      this.areaService.currentAreaName = 'information';
    } else {
      this.areaService.isAreaChecked = false;
      this.areaService.currentAreaName = 'fun';
    }

    this.postService.getNextPost(this.areaService.currentAreaName)
      .subscribe(nextPost => {
        if (nextPost) {
          this.text = 'https://client.wildfyre.net/areas/' + this.areaService.currentAreaName + '/' + nextPost.id;
          this.post = nextPost;
          this.loading = false;
          this.cdRef.detectChanges();
        } else {
          this.text = 'https://client.wildfyre.net';
          this.fakePost = new Post(0, this.systemAuthor, false,
            Date(), false, 'No more posts in this area, try creating one?', []);
          this.post = this.fakePost;
          this.loading = false;
          this.cdRef.detectChanges();
        }
      });

    this.areaService.getAreaRep(this.areaService.currentAreaName)
      .subscribe(reputation => {
        this.rep = reputation;
      });
  }

  openCommentDeleteDialog(c: Comment) {
    const dialogRef = this.dialog.open(ConfirmDeletionComponent);
    dialogRef.afterClosed()
      .subscribe(result => {
        if (result.bool) {
          this.commentService.deleteComment(
            this.areaService.currentAreaName,
            this.post,
            c
          );
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
    this.postService.comment(
      this.areaService.currentAreaName,
      this.post, this.model.comment
    ).subscribe();
    this.cdRef.detectChanges();
    this.contractBox();
    this.model.comment = '';
  }

  spread(spread: boolean) {
    this.loading = true;
    this.contractBox();
    this.cdRef.detectChanges();
    this.postService.spread(
      this.areaService.currentAreaName,
      this.post,
      spread
    );

    this.postService.getNextPost(this.areaService.currentAreaName)
      .subscribe(nextPost => {
        if (nextPost) {
          this.text = 'https://client.wildfyre.net/areas/' + this.areaService.currentAreaName + '/' + nextPost.id;
          this.post = nextPost;
          this.loading = false;
          this.cdRef.detectChanges();
        } else {
          this.text = 'https://client.wildfyre.net';
          this.fakePost = new Post(0, this.systemAuthor, false,
            Date(), false, 'No more posts in this area, try creating one?', []);
          this.post = this.fakePost;
          this.loading = false;
          this.cdRef.detectChanges();
        }
      });
  }

  subscribe(s: boolean) {
    this.postService.subscribe(
      this.areaService.currentAreaName,
      this.post,
      s
    ).subscribe();
  }
}

enum TypeOfReport {
  Post,
  Comment
}
