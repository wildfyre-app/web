import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';
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
  isCopied = false;
  text = 'https://client.wildfyre.net/';

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
            this.post.subscribed = post.subscribed;
            this.text = 'https://client.wildfyre.net/areas/' + this.areaService.currentAreaName + '/' + post.id;
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
  subscribe(s: boolean) {
    this.postService.subscribe(
      this.areaService.currentAreaName,
      this.post,
      s
    ).subscribe();
  }
}
