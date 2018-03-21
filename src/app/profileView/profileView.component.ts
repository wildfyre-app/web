import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Author } from '../_models/author';
import { AuthenticationService } from '../_services/authentication.service';
import { ProfileService } from '../_services/profile.service';
import { RouteService } from '../_services/route.service';

@Component({
  templateUrl: 'profileView.component.html',
})
export class ProfileViewComponent implements OnInit, OnDestroy {
  author: Author;
  componentDestroyed: Subject<boolean> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private profileService: ProfileService,
    private routeService: RouteService
  ) { }

  ngOnInit() {
    this.route.params
      .takeUntil(this.componentDestroyed)
      .subscribe(params => {
        const id = params['id'];

        // Get post from secure api end point
        this.profileService.getUser(id)
          .takeUntil(this.componentDestroyed)
          .subscribe(author => {
            this.author =  author;
        });
    });
  }

  ngOnDestroy() {
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }

  back() {
    if (this.routeService.routes.length === 0) {
      this.router.navigateByUrl('');
    } else {
      this.router.navigateByUrl(this.routeService.getNextRoute());
    }
  }
}
