import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '../_models/post';
import { PostService } from '../_services/post.service';
import { RouteService } from '../_services/route.service';

@Component({
  templateUrl: 'userPosts.component.html'
})
export class UserPostsComponent implements OnInit {
  funPosts: Post[] = [];
  infoPosts: Post[] = [];

  constructor(
    private router: Router,
    private postService: PostService,
    private routeService: RouteService
  ) { }

  ngOnInit() {
    document.getElementById('navB').style.display = '';
    document.getElementById('navBMobile').style.display = '';

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
    this.routeService.addNextRoute(this.router.url);
    this.router.navigateByUrl('/areas/' + areaID + '/' + postID);
  }
}
