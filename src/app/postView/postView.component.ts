import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Post, Area } from '../_models';
import { PostService, AreaService, HttpService} from '../_services';

@Component({
  templateUrl: 'postView.component.html',
})
export class PostViewComponent implements OnInit {
  area: string;
  post: Post;
  model: any = {};
  color = 'warn';
  checked: boolean;
  loading: boolean;
  editName: string;
  private sub: any;

  constructor(
    private postService: PostService,
    private areaService: AreaService,
    private httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.checked = this.areaService.isAreaChecked;
  }

  ngOnInit() {
    document.getElementById('navB').style.display = 'none';
    this.sub = this.route
      .params
      .subscribe(params => {
        this.area = params['area'];

        this.postService.getPost(this.area, params['id'])
          .subscribe(post => {
            this.post =  post;
        });
    });
  }

  postComment() {
    this.postService.comment(this.area, this.post, this.model.comment).subscribe();
    this.model.comment = '';
  }

  back() {
    this.router.navigateByUrl('');
  }
}
