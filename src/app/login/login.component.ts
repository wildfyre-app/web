import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../_services/index';
import { AuthError } from '../_models';

@Component({
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  errors: AuthError;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();
    document.getElementById('navB').style.display = 'none';
    document.getElementById('navBMobile').style.display = 'none';

    console.log('Turning up the heat');
  }

  login() {
    this.loading = true;
    this.authenticationService.login(this.model.username, this.model.password)
      .subscribe(result => {
        if (!result.getError()) {
          this.router.navigate(['/']);
        } else {
          this.errors = result.getError();
          this.loading = false;
        }
    });
  }
}
