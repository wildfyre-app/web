import { Component } from '@angular/core';
import { Author } from '../_models/index';
import { AreaService, PostService } from '../_services';
import { Router } from '@angular/router';
import { PostError } from '../_models';

@Component({
  templateUrl: 'createPost.component.html'
})
export class CreatePostComponent {
  model: any = {};
  color = 'warn';
  checked: boolean;
  loading: boolean;
  errors: PostError;

  constructor(
    private areaService: AreaService,
    private postService: PostService,
    private router: Router
  ) {
    this.checked = this.areaService.isAreaChecked;
  }

  onChange(value: any) {
    if (value.checked === true) {
      this.areaService.isAreaChecked = true;
      this.areaService.currentAreaName = 'information';
    } else {
      this.areaService.isAreaChecked = false;
      this.areaService.currentAreaName = 'fun';
    }
  }

  createPost() {
    this.loading = true;
    this.postService.createPost(this.areaService.currentAreaName, this.model.card)
      .subscribe(result => {
        if (!result.getError()) {
          this.model.post = '';
          this.router.navigate(['']);
        } else {
          this.errors = result.getError();
          this.loading = false;
        }
      });
  }
}
