import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Post, Area } from '../_models/index';
import { PostService, AreaService, HttpService} from '../_services/index';

@Component({
  templateUrl: 'cardView.component.html',
})
export class CardViewComponent implements OnInit {
  post: Post;
  model: any = {};
  color = 'warn';
  checked: boolean;
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
        const area = params['area'];
        const id = params['id'];

        if (area !== 'fun') {
          this.areaService.currentAreaName = 'information';
        }
        // get post from secure api end point
        this.postService.getPost(area, id)
          .subscribe(post => {
            this.post =  post;
        });
    });
  }

  postComment() {
    const text = {
      'text': this.model.comment
    };
    this.httpService.POST('/areas/' + this.areaService.currentAreaName  + '/' + this.post.id + '/', text)
      .subscribe(
        data => console.log('Someone said something in the forest, but did anyone hear it?'));
    this.model.comment = '';
    this.ngOnInit();
  }

  back() {
    this.router.navigateByUrl('');
  }
}
