import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { ReCaptchaComponent } from 'angular2-recaptcha';
import { AuthenticationService, RegistrationService } from '../_services/index';

@Component({
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {
  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;
  model: any = {};
  loading = false;
  error = '';
  token: any;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private registrationService: RegistrationService
  ) { }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();
    document.getElementById('navB').style.display = 'none';
  }

  register() {
    this.loading = true;
    this.registrationService.register(this.model.username, this.model.email, this.model.password, this.token)
      .subscribe(result => {
        if (result === true) {
          this.error = 'Registration Successful';
          this.router.navigate(['/login']);
        } else {
          this.error = 'Registration Failed, you did something wrong';
        }
    });
  }
  setCaptchaResponse() {
    this.token = this.captcha.getResponse();
  }
}
