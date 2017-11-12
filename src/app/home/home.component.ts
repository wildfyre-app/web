import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Area } from '../_models/area';
import { Author } from '../_models/author';
import { Comment } from '../_models/comment';
import { Post } from '../_models/post';
import { Reputation } from '../_models/reputation';
import { AreaService } from '../_services/area.service';
import { CommentService } from '../_services/comment.service';
import { FlagService } from '../_services/flag.service';
import { PostService } from '../_services/post.service';
import { ProfileService } from '../_services/profile.service';
import { RouteService } from '../_services/route.service';

@Component({
  templateUrl: 'home.component.html',
})
export class HomeComponent implements OnInit {
  private typeOfReport = TypeOfReport;
  systemAuthor: Author = new Author(375, 'WildFyre', '', '', false);
  fakePost: Post = new Post(0, this.systemAuthor, false,
    Date(), false, 'No more posts in this area, try creating one?', []);
  checked: boolean;
  isCopied = false;
  model: any = {};
  post: Post = this.fakePost;
  rep: Reputation;
  text = 'https://client.wildfyre.net/';
  userID: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private areaService: AreaService,
    private commentService: CommentService,
    private flagService: FlagService,
    private postService: PostService,
    private profileService: ProfileService,
    private routeService: RouteService
  ) {
    this.checked = this.areaService.isAreaChecked;

    this.profileService.getSelf()
      .subscribe( (author: Author) => {
        this.userID = author.user;
      });
  }

  ngOnInit() {
    this.routeService.resetRoutes();
    this.cdRef.detectChanges();

    this.postService.getNextPost(this.areaService.currentAreaName)
      .subscribe(nextPost => {
        if (nextPost) {
          this.text = 'https://client.wildfyre.net/areas/' + this.areaService.currentAreaName + '/' + nextPost.id;
          this.post = nextPost;
          this.cdRef.detectChanges();
        } else {
          this.text = 'https://client.wildfyre.net';
          this.fakePost = new Post(0, this.systemAuthor, false,
            Date(), false, 'No more posts in this area, try creating one?', []);
          this.post = this.fakePost;
          this.cdRef.detectChanges();
        }
      });

    this.areaService.getAreaRep(this.areaService.currentAreaName)
      .subscribe(reputation => {
        this.rep = reputation;
      });
  }

  deleteComment(c: Comment) {
    this.commentService.deleteComment(
      this.areaService.currentAreaName,
      this.post,
      c
    );
  }

  gotoUser(user: string) {
    this.routeService.addNextRoute(this.router.url);
  }

  onChange(value: any) {
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
          this.cdRef.detectChanges();
        } else {
          this.text = 'https://client.wildfyre.net';
          this.fakePost = new Post(0, this.systemAuthor, false,
            Date(), false, 'No more posts in this area, try creating one?', []);
          this.post = this.fakePost;
          this.cdRef.detectChanges();
        }
      });

    this.areaService.getAreaRep(this.areaService.currentAreaName)
      .subscribe(reputation => {
        this.rep = reputation;
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
    this.cdRef.detectChanges();
    this.postService.comment(
      this.areaService.currentAreaName,
      this.post, this.model.comment
    ).subscribe();
    this.cdRef.detectChanges();
    this.model.comment = '';
  }

  spread(spread: boolean) {
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
          this.cdRef.detectChanges();
        } else {
          this.text = 'https://client.wildfyre.net';
          this.fakePost = new Post(0, this.systemAuthor, false,
            Date(), false, 'No more posts in this area, try creating one?', []);
          this.post = this.fakePost;
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
