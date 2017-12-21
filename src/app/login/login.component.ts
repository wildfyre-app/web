import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthError } from '../_models/auth';
import { AuthenticationService } from '../_services/authentication.service';
import { NavBarService } from '../_services/navBar.service';
import { NotificationService } from '../_services/notification.service';
import { RouteService } from '../_services/route.service';

@Component({
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
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

  login() {
    this.loading = true;
    this.authenticationService.login(this.model.username, this.model.password)
      .subscribe(result => {
        if (!result.getError()) {
            this.notificationService.getNotifications()
              .subscribe(notifications => {
                this.navBarService.notifications.next(notifications);
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
