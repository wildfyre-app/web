import { Component, OnDestroy } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { ViewChild } from '@angular/core';
import { RecoverTransaction, RecoverTransactionError } from '../_models/recoverTransaction';
import { RegistrationService } from '../_services/registration.service';
import { ReCaptchaComponent } from 'angular2-recaptcha';

@Component({
  templateUrl: 'recover.component.html'
})
export class RecoverComponent implements OnDestroy {
  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;

  componentDestroyed: Subject<boolean> = new Subject();
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

  ngOnDestroy() {
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }

  recoverPassword() {
    this.registrationService.recoverPasswordStep1(this.model.email2, this.model.username, this.token)
      .takeUntil(this.componentDestroyed)
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
      .takeUntil(this.componentDestroyed)
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
