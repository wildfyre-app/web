import { Component } from '@angular/core';
import { Author } from '../_models/index';
import { AreaService, HttpService } from '../_services/index';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'createPost.component.html'
})
export class CreatePostComponent {
  model: any = {};
  color = 'warn';
  checked: boolean;

  constructor(
    private areaService: AreaService,
    private httpService: HttpService,
    private router: Router
  ) {
    this.checked = this.areaService.isAreaChecked;
  }

  onChange(value) {
    if (value.checked === true) {
      this.areaService.currentArea = 1;
      this.areaService.isAreaChecked = true;
      this.areaService.currentAreaName = 'information';
    } else {
      this.areaService.currentArea = 0;
      this.areaService.isAreaChecked = false;
      this.areaService.currentAreaName = 'fun';
    }
  }

  createPost() {
    const text = {
      'text': this.model.post
    };

    this.httpService.POST('/areas/' + this.areaService.currentAreaName  + '/', text)
      .subscribe(
        data => console.log('A bright light emerges'));
    this.model.post = '';
    this.router.navigateByUrl('');
  }
}
