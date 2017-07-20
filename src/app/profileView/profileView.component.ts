import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Author } from '../_models/index';
import { ProfileService, AreaService, HttpService} from '../_services/index';

@Component({
  templateUrl: 'profileView.component.html',
})
export class ProfileViewComponent implements OnInit {
  author: Author;
  banned: boolean;
  private sub: any;

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit() {
    document.getElementById('navB').style.display = 'none';
    this.sub = this.route
      .params
      .subscribe(params => {
        const id = params['id'];

        // get post from secure api end point
        this.profileService.getUser(id)
          .subscribe(author => {
            this.author =  author;
        });
    });
  }

  back() {
    this.router.navigateByUrl('');
  }
}
