import { Component, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { RegistrationError } from '../_models/registration';
import { AuthenticationService } from '../_services/authentication.service';
import { RegistrationService } from '../_services/registration.service';
import { ReCaptchaComponent } from 'angular2-recaptcha';

@Component({
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {
  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;
  errors: RegistrationError;
  loading = false;
  model: any = {};
  token: any;

  constructor(
    private snackBar: MdSnackBar,
    private router: Router,
    private authenticationService: AuthenticationService,
    private registrationService: RegistrationService
  ) { }

  ngOnInit() {
    // Reset login status
    this.authenticationService.logout();
  }

  register() {
    this.loading = true;

    if (this.model.password === this.model.password2) {
      this.registrationService.register(this.model.username, this.model.email, this.model.password, this.token)
        .subscribe(result => {
          if (!result.getError()) {
            this.router.navigate(['/register/success']);
          } else {
            this.errors = result.getError();
            this.loading = false;
          }
      });
  } else {
    this.loading = false;
    const snackBarRef = this.snackBar.open('Your passwords do not match', 'Close', {
      duration: 3000
    });
  }
  }
  setCaptchaResponse(res: any) {
    this.token = this.captcha.getResponse();
  }
}
