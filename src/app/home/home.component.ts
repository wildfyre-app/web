import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Post, Area, Reputation } from '../_models/index';
import { PostService, AreaService, HttpService} from '../_services/index';

@Component({
  templateUrl: 'home.component.html',
})
export class HomeComponent implements OnInit {
  posts: Post[] = [];
  areas: Area[] = [];
  rep: Reputation;
  model: any = {};
  color = 'accent';
  checked: boolean;

  constructor(
    private postService: PostService,
    private areaService: AreaService,
    private httpService: HttpService
  ) {
    this.checked = this.areaService.isAreaChecked;
  }

  ngOnInit() {
    document.getElementById('navB').style.display = '';
    // get posts from secure api end point
    this.postService.getPosts()
      .subscribe(post => {
        this.posts =  post;
    });

    this.areaService.getAreas()
      .subscribe(area => {
        this.areas = area;
    });
    this.areaService.getAreaRep(this.areaService.currentAreaName)
      .subscribe(reputation => {
        this.rep = reputation;
    });
  }

  onChange(value) {
    if (value.checked === true) {
      this.areaService.isAreaChecked = true;
      this.areaService.currentAreaName = 'information';
    } else {
      this.areaService.isAreaChecked = false;
      this.areaService.currentAreaName = 'fun';
    }
    this.ngOnInit();
  }

  upSwipe() {
    // Increase post spread
    this.httpService.POST('/areas/' + this.areaService.currentAreaName  +
      '/' + this.posts[0].id + '/spread/1/', JSON.stringify({}))
      .subscribe(
        data => console.log('Burning more wood'));
    this.ngOnInit();
  }

  downSwipe() {
    // Increase post spread
    this.httpService.POST('/areas/' + this.areaService.currentAreaName  +
      '/' + this.posts[0].id + '/spread/0/', JSON.stringify({}))
      .subscribe(
        data => console.log('The air seemingly grew colder'));
    this.ngOnInit();
  }

  postComment() {
    const text = {
      'text': this.model.comment
    };

    this.httpService.POST('/areas/' + this.areaService.currentAreaName  + '/' + this.posts[0].id + '/', text)
      .subscribe(
        data => console.log('Someone said something in the forest, but did anyone hear it?'));
    this.model.comment = '';
    this.ngOnInit();
  }

}
