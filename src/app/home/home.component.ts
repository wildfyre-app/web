import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';
import { Post } from '../_models/post';
import { Area } from '../_models/area';
import { Reputation } from '../_models/reputation';
import { Author } from '../_models/author';
import { Comment } from '../_models/comment';
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
  checked: boolean;
  isCopied = false;
  model: any = {};
  post: Post;
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
    this.cdRef.detectChanges();
    document.getElementById('navB').style.display = '';
    document.getElementById('navBMobile').style.display = '';

    this.postService.getNextPost(this.areaService.currentAreaName)
      .subscribe((post: Post) => {
        this.post = post;
        if (post) {
          this.text = 'https://client.wildfyre.net/areas/' + this.areaService.currentAreaName + '/' + post.id;
        } else {
          this.text = 'https://client.wildfyre.net';
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
    this.router.navigateByUrl('/user/' + user);
  }

  onChange(value: any) {
    if (value.checked === true) {
      this.areaService.isAreaChecked = true;
      this.areaService.currentAreaName = 'information';
    } else {
      this.areaService.isAreaChecked = false;
      this.areaService.currentAreaName = 'fun';
    }

    this.postService.getNextPost(this.areaService.currentAreaName)
      .subscribe((post: Post) => {
        this.post = post;
        this.cdRef.detectChanges();
        if (post) {
          this.text = 'https://client.wildfyre.net/areas/' + this.areaService.currentAreaName + '/' + post.id;
        } else {
          this.text = 'https://client.wildfyre.net';
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
    this.postService.comment(
      this.areaService.currentAreaName,
      this.post, this.model.comment
    ).subscribe();

    this.model.comment = '';
  }

  spread(spread: boolean) {
    this.postService.spread(
      this.areaService.currentAreaName,
      this.post,
      spread
    );

    this.post = null;  // Avoids last post staying long on slow connection

    this.postService.getNextPost(this.areaService.currentAreaName)
      .subscribe((post: Post) => {
        this.post = post;
        if (post) {
          this.text = 'https://client.wildfyre.net/areas/' + this.areaService.currentAreaName + '/' + post.id;
        } else {
          this.text = 'https://client.wildfyre.net';
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
