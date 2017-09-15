import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Author } from '../_models/author';
import { HttpService } from '../_services/http.service';
import { AreaService } from '../_services/area.service';
import { ProfileService } from '../_services/profile.service';
import { RouteService } from '../_services/route.service';
import { AuthenticationService } from '../_services/authentication.service';

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
    private router: Router,
    private routeService: RouteService,
    private authenticationService: AuthenticationService
  ) {
  }

  ngOnInit() {
    if (!this.authenticationService.token) {
      document.getElementById('navB').style.display = 'none';
      document.getElementById('navBMobile').style.display = 'none';
    }

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
    if (this.routeService.routes.length === 0) {
      this.router.navigateByUrl('');
    } else {
      this.router.navigateByUrl(this.routeService.getNextRoute());
    }
  }
}
