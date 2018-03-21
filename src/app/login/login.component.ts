import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { AuthError } from '../_models/auth';
import { AuthenticationService } from '../_services/authentication.service';
import { NavBarService } from '../_services/navBar.service';
import { NotificationService } from '../_services/notification.service';
import { RouteService } from '../_services/route.service';

@Component({
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
  componentDestroyed: Subject<boolean> = new Subject();
  errors: AuthError;
  loading = false;
  model: any = {};

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private navBarService: NavBarService,
    private notificationService: NotificationService,
    private routeService: RouteService
  ) { }

  ngOnInit() {
    // reset login status
    this.routeService.resetRoutes();
    this.authenticationService.logout();

    console.log('Turning up the heat');
  }

  ngOnDestroy() {
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }

  login() {
    this.loading = true;
    this.authenticationService.login(this.model.username, this.model.password)
      .takeUntil(this.componentDestroyed)
      .subscribe(result => {
        if (!result.getError()) {
            this.notificationService.getSuperNotification(10, 0)
              .takeUntil(this.componentDestroyed)
              .subscribe(superNotification => {
                this.navBarService.notifications.next(superNotification.count);
            });
          this.router.navigate(['/']);
          this.loading = false;
        } else {
          this.errors = result.getError();
          this.loading = false;
        }
    });
  }
}
