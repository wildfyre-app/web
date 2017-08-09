import { Component, OnInit } from '@angular/core';
import { Post } from '../_models/index';
import { Router } from '@angular/router';
import { PostService } from '../_services/index';

@Component({
  templateUrl: 'userPosts.component.html'
})
export class UserPostsComponent implements OnInit {
  funPosts: Post[] = [];
  infoPosts: Post[] = [];
  routeLinks: any[];

  constructor(
    private router: Router,
    private postService: PostService
  ) { }

  ngOnInit() {
    // get posts from secure api end point
    this.postService.getOwnPosts('fun')
      .subscribe(posts => {
        this.funPosts = posts;
    });

    this.postService.getOwnPosts('information')
      .subscribe(posts => {
        this.infoPosts = posts;
    });
  }

  goto(areaID: string, postID: string) {
    this.router.navigateByUrl('/areas/' + areaID + '/' + postID);
  }
}
