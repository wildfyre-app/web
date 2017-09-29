import { Component, OnInit } from '@angular/core';
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
    private router: Router,
    private authenticationService: AuthenticationService,
    private registrationService: RegistrationService
  ) { }

  ngOnInit() {
    // Reset login status
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
