import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Author } from '../_models/author';
import { Comment } from '../_models/comment';
import { Post } from '../_models/post';
import { AreaService } from '../_services/area.service';
import { AuthenticationService } from '../_services/authentication.service';
import { CommentService } from '../_services/comment.service';
import { FlagService } from '../_services/flag.service';
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
  isCopied = false;
  loading: boolean;
  model: any = {};
  post: Post;
  text = 'https://client.wildfyre.net/';
  userID: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private areaService: AreaService,
    private authenticationService: AuthenticationService,
    private commentService: CommentService,
    private flagService: FlagService,
    private postService: PostService,
    private profileService: ProfileService,
    private routeService: RouteService,
  ) {
    this.checked = this.areaService.isAreaChecked;
  }

  ngOnInit() {
    let currentUrlArea: string = this.router.url;
    currentUrlArea = currentUrlArea.replace(currentUrlArea.substring(0, 7), '');
    currentUrlArea = currentUrlArea.substring(0, currentUrlArea.indexOf('/'));
    this.areaService.currentAreaName = currentUrlArea;

    this.profileService.getSelf()
      .subscribe( (author: Author) => {
        this.userID = author.user;
      });

    this.route
      .params
      .subscribe(params => {
        this.area = params['area'];

        this.postService.getPost(this.area, params['id'])
          .subscribe(post => {
            this.post =  post;
            this.post.subscribed = post.subscribed;
            this.text = 'https://client.wildfyre.net/areas/' + this.areaService.currentAreaName + '/' + post.id;
        });
    });
  }

  openDialog(post: Post, comment: Comment, typeOfFlagReport: TypeOfReport) {
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
    this.postService.comment(this.area, this.post, this.model.comment).subscribe();
    this.model.comment = '';
  }

  gotoUser(user: string) {
    this.routeService.addNextRoute(this.router.url);
    this.router.navigateByUrl('/user/' + user);
  }

  back() {
    if (this.routeService.routes.length === 0) {
      this.router.navigateByUrl('');
    } else {
      this.router.navigateByUrl(this.routeService.getNextRoute());
    }
  }

  subscribe(s: boolean) {
    this.postService.subscribe(
      this.areaService.currentAreaName,
      this.post,
      s
    ).subscribe();
  }

  deleteComment(c: Comment) {
    this.commentService.deleteComment(this.areaService.currentAreaName, this.post, c);
  }

  deletePost() {
    this.postService.deletePost(this.areaService.currentAreaName, this.post);
    this.router.navigateByUrl('');
  }
}

enum TypeOfReport {
  Post,
  Comment
}
