import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { ReCaptchaComponent } from 'angular2-recaptcha';
import { AuthenticationService } from '../_services/authentication.service';
import { RegistrationService } from '../_services/registration.service';
import { RegistrationError } from '../_models/registration';

@Component({
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {
  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;
  model: any = {};
  loading = false;
  token: any;
  errors: RegistrationError;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private registrationService: RegistrationService
  ) { }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();
    document.getElementById('navB').style.display = 'none';
    document.getElementById('navBMobile').style.display = 'none';
  }

  register() {
    this.loading = true;
    this.registrationService.register(this.model.username, this.model.email, this.model.password, this.token)
      .subscribe(result => {
        if (!result.getError()) {
          this.router.navigate(['/register/success']);
        } else {
          this.errors = result.getError();
          this.loading = false;
        }
    });
  }
  setCaptchaResponse(res: any) {
    this.token = this.captcha.getResponse();
  }
}
