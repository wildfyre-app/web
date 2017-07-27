import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Post, Area, Reputation } from '../_models';
import { PostService, AreaService } from '../_services';

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

  constructor(
    private postService: PostService,
    private areaService: AreaService
  ) {
    this.checked = this.areaService.isAreaChecked;

    this.areaService.getAreaRep(this.areaService.currentAreaName)
      .subscribe(reputation => {
        this.rep = reputation;
    });
  }

  ngOnInit() {
    document.getElementById('navB').style.display = '';

    this.postService.getNextPost(this.areaService.currentAreaName)
      .subscribe((post: Post) => {
        this.post = post;
        this.text = 'https://client.wildfyre.net/areas/' + this.areaService.currentAreaName + '/' + post.id;
      });
  }

  onChange(value: any) {
    if (value.checked === true) {
      this.areaService.isAreaChecked = true;
      this.areaService.currentAreaName = 'information';
    } else {
      this.areaService.isAreaChecked = false;
      this.areaService.currentAreaName = 'fun';
    }
    this.ngOnInit();
  }

  spread(spread: boolean) {
    this.postService.spread(
      this.areaService.currentAreaName,
      this.post, spread);

    this.post = null;  // Avoids last post staying long on slow connection
    this.ngOnInit();
  }

  postComment() {
    this.postService.comment(
      this.areaService.currentAreaName,
      this.post, this.model.comment
    ).subscribe();

    this.model.comment = '';
  }

}
