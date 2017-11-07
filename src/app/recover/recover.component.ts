import { Component } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { RecoverTransaction, RecoverTransactionError } from '../_models/recoverTransaction';
import { RegistrationService } from '../_services/registration.service';
import { ReCaptchaComponent } from 'angular2-recaptcha';

@Component({
  templateUrl: 'recover.component.html'
})
export class RecoverComponent {
  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;
  errors: RecoverTransactionError;
  loading = false;
  model: any = {};
  token: any;
  transID: string;

  constructor(
    private snackBar: MdSnackBar,
    private router: Router,
    private registrationService: RegistrationService
  ) { }

  recoverPassword() {
    this.registrationService.recoverPasswordStep1(this.model.email2, this.model.username, this.token)
      .subscribe(result => {
        if (!result.getError()) {
          this.router.navigateByUrl('/recover/password/' + result.transaction);
          this.loading = false;
          this.model.email2 = '';
          this.model.username = '';
          this.captcha.reset();
        } else {
          this.errors = result.getError();
          this.loading = false;
          this.captcha.reset();
        }
      });
  }

  recoverUsername() {
    this.registrationService.recoverUsername(this.model.email, this.token)
      .subscribe(result => {
        if (!result.getError()) {
          const snackBarRef = this.snackBar.open('We will contact you via the information provided', 'Close', {
          duration: 3000
        });
          this.loading = false;
          this.model.email = '';
          this.captcha.reset();
        } else {
          this.errors = result.getError();
          this.loading = false;
          this.captcha.reset();
        }
      });
  }

  setCaptchaResponse(res: any) {
    this.token = res;
  }
}
