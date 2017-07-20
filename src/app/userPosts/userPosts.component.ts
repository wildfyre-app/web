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
    this.postService.getFunPosts()
      .subscribe(post1 => {
        this.funPosts = post1;
    });

    this.postService.getInformationPosts()
      .subscribe(post2 => {
        this.infoPosts = post2;
    });
  }

  goto(areaID: string, postID: string) {
    this.router.navigateByUrl('/areas/' + areaID + '/' + postID);
  }
}
