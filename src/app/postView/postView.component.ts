import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmDeletionComponent } from '../_dialogs/confirmDeletion.component';
import { Author } from '../_models/author';
import { Comment } from '../_models/comment';
import { Post } from '../_models/post';
import { AreaService } from '../_services/area.service';
import { CommentService } from '../_services/comment.service';
import { FlagService } from '../_services/flag.service';
import { NavBarService } from '../_services/navBar.service';
import { PostService } from '../_services/post.service';
import { ProfileService } from '../_services/profile.service';
import { RouteService } from '../_services/route.service';

@Component({
  templateUrl: 'postView.component.html',
})
export class PostViewComponent implements OnInit {
  private typeOfReport = TypeOfReport;
  area: string;
  checked: boolean;
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
    private areaService: AreaService,
    private commentService: CommentService,
    private flagService: FlagService,
    private navBarService: NavBarService,
    private postService: PostService,
    private profileService: ProfileService,
    private routeService: RouteService,
  ) {
    this.checked = this.areaService.isAreaChecked;
    this.model.comment = '';
  }

  ngOnInit() {
    let currentUrlArea: string = this.router.url;
    currentUrlArea = currentUrlArea.replace(currentUrlArea.substring(0, 7), '');
    currentUrlArea = currentUrlArea.substring(0, currentUrlArea.indexOf('/'));
    this.areaService.currentAreaName = currentUrlArea;

    if (window.screen.width > 600) {
      this.styleTextBottom = '0px';
      this.styleCommentBottom = '-1px';
    } else {
      this.styleTextBottom = '42px';
      this.styleCommentBottom = '44px';
    }

    this.profileService.getSelf()
      .subscribe( (author: Author) => {
        this.userID = author.user;
        this.loggedIn = true;
      });

    this.route.params
      .subscribe(params => {
        this.area = params['area'];

        if (this.postService.superPosts[this.area]) {
          for (let i = 0; i < this.postService.superPosts[this.area].results.length; i++) {
            if (this.postService.superPosts[this.area].results[i].id === params['id']) {
              this.post = this.postService.superPosts[this.area].results[i];
            }
          }
        } else {
          this.postService.getPost(this.area, params['id'])
            .subscribe(post => {
              this.post =  post;
              this.post.subscribed = post.subscribed;
          });
        }

        let commentIDArray = params['comments'];
        commentIDArray = commentIDArray + '-';

        if (commentIDArray) {
          let checksum = 0;
          while (commentIDArray.indexOf('-') !== -1) {
            checksum += 1;
            this.parsedCommentArray.push(commentIDArray.slice(0, commentIDArray.indexOf('-')));
            commentIDArray = commentIDArray.slice(commentIDArray.indexOf('-') + 1, commentIDArray.length);
          }
        }
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

  getCommentLink(commentID: number) {
    return 'https://client.wildfyre.net/areas/' + this.areaService.currentAreaName + '/' + this.post.id + '/' + commentID;
  }

  getPostLink(postID: number) {
    return 'https://client.wildfyre.net/areas/' + this.areaService.currentAreaName + '/' + postID;
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
    const dialogRef = this.dialog.open(ConfirmDeletionComponent);
    dialogRef.afterClosed()
      .subscribe(result => {
        if (result.bool) {
          this.postService.deletePost(this.areaService.currentAreaName, this.post);
          const snackBarRef = this.snackBar.open('Post deleted successfully', 'Close', {
            duration: 3000
          });
          this.router.navigateByUrl('');
        }
      });
  }

  postComment() {
    this.cdRef.detectChanges();
    this.postService.comment(this.area, this.post, this.model.comment).subscribe();
    this.model.comment = '';
    this.contractBox();
    this.cdRef.detectChanges();
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
