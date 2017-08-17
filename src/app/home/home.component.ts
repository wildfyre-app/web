import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

@Component({
  templateUrl: 'home.component.html',
})
export class HomeComponent implements OnInit {
  post: Post;
  rep: Reputation;
  model: any = {};
  color = 'warn';
  checked: boolean;
  isCopied = false;
  text = 'https://client.wildfyre.net/';
  userID: number;
  private typeOfReport = TypeOfReport;

  constructor(
    private postService: PostService,
    private areaService: AreaService,
    private profileService: ProfileService,
    private commentService: CommentService,
    private cdRef: ChangeDetectorRef,
    private flagService: FlagService
  ) {
    this.checked = this.areaService.isAreaChecked;

    this.profileService.getSelf()
      .subscribe( (author: Author) => {
        this.userID = author.user;
      });
  }

  ngOnInit() {
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

  postComment() {
    this.postService.comment(
      this.areaService.currentAreaName,
      this.post, this.model.comment
    ).subscribe();

    this.model.comment = '';
  }

  subscribe(s: boolean) {
    this.postService.subscribe(
      this.areaService.currentAreaName,
      this.post,
      s
    ).subscribe();
  }

  deleteComment(c: Comment) {
    this.commentService.deleteComment(
      this.areaService.currentAreaName,
      this.post,
      c
    );
  }
}

enum TypeOfReport {
  Post,
  Comment
}
