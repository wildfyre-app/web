import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';
import { Post } from '../_models/post';
import { Area } from '../_models/area';
import { Author } from '../_models/author';
import { Comment } from '../_models/comment';
import { HttpService } from '../_services/http.service';
import { AreaService } from '../_services/area.service';
import { CommentService } from '../_services/comment.service';
import { FlagService } from '../_services/flag.service';
import { PostService } from '../_services/post.service';
import { ProfileService } from '../_services/profile.service';

@Component({
  templateUrl: 'postView.component.html',
})
export class PostViewComponent implements OnInit {
  area: string;
  post: Post;
  model: any = {};
  color = 'warn';
  checked: boolean;
  loading: boolean;
  editName: string;
  private sub: any;
  isCopied = false;
  text = 'https://client.wildfyre.net/';
  userID: number;
  private typeOfReport = TypeOfReport;


  constructor(
    private postService: PostService,
    private areaService: AreaService,
    private httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private commentService: CommentService,
    private flagService: FlagService
  ) {
    this.checked = this.areaService.isAreaChecked;
  }

  ngOnInit() {
    document.getElementById('navB').style.display = 'none';

    let currentUrlArea: string = this.router.url;
    currentUrlArea = currentUrlArea.replace(currentUrlArea.substring(0, 7), '');
    currentUrlArea = currentUrlArea.substring(0, currentUrlArea.indexOf('/'));
    this.areaService.currentAreaName = currentUrlArea;

    this.profileService.getSelf()
      .subscribe( (author: Author) => {
        this.userID = author.user;
      });

    this.sub = this.route
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

  back() {
    this.router.navigateByUrl('');
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
