import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';
import { NavBarService } from '../_services/navBar.service';
import { NotificationService } from '../_services/notification.service';
import { RegistrationService } from '../_services/registration.service';
import { RouteService } from '../_services/route.service';
import { ReCaptchaComponent } from 'angular2-recaptcha';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild(ReCaptchaComponent, {static: true}) captcha: ReCaptchaComponent;

  componentDestroyed: Subject<boolean> = new Subject();
  errors: any;
  loading = false;
  loginForm: FormGroup;
  registerForm: FormGroup;
  recoverUsernameForm: FormGroup;
  recoverPasswordForm: FormGroup;
  recoverPasswordForm2: FormGroup;
  resetTransaction: string;
  token: any;
  submitted = false;

  constructor(
    private router: Router,
    public snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private navBarService: NavBarService,
    private notificationService: NotificationService,
    private registrationService: RegistrationService,
    private routeService: RouteService
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'usernamel': new FormControl(''),
      'passwordl': new FormControl(''),
    });

    this.registerForm = new FormGroup({
      'usernamer': new FormControl(''),
      'emailr': new FormControl(''),
      'passwordr': new FormControl(''),
      'password2r': new FormControl(''),
    });

    this.recoverUsernameForm = new FormGroup({
      'emailru': new FormControl(''),
    });

    this.recoverPasswordForm = new FormGroup({
      'emailrp': new FormControl(''),
      'usernamerp': new FormControl(''),
    });

    this.recoverPasswordForm2 = new FormGroup({
      'tokenrp2': new FormControl(''),
      'passwordrp2': new FormControl(''),
      'password2rp2': new FormControl(''),
    });

    // reset login status
    this.routeService.resetRoutes();
    this.authenticationService.logout();

    console.log('Turning up the heat');
  }

  ngOnDestroy() {
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }

  switchView(s: string) {
    if (s === 'register') {
      this.hideViews();
      document.getElementById('register').style.display = 'flex';
    } else if (s === 'login') {
      this.hideViews();
      document.getElementById('login').style.display = 'flex';
    } else if (s === 'landing') {
      this.hideViews();
      document.getElementById('landing').style.display = 'flex';
    } else if (s === 'recover-password') {
      this.hideViews();
      document.getElementById('recover-password').style.display = 'flex';
    } else if (s === 'recover-password2') {
      this.hideViews();
      document.getElementById('recover-password2').style.display = 'flex';
    } else if (s === 'recover-username') {
      this.hideViews();
      document.getElementById('recover-username').style.display = 'flex';
    }
  }

  hideViews() {
    document.getElementById('register').style.display = 'none';
    document.getElementById('login').style.display = 'none';
    document.getElementById('landing').style.display = 'none';
    document.getElementById('recover-password').style.display = 'none';
    document.getElementById('recover-password2').style.display = 'none';
    document.getElementById('recover-username').style.display = 'none';
    this.errors = null;
    this.loading = false;
    this.submitted = false;
  }

  login() {
    this.errors = null;
    this.loading = true;
    this.submitted = false;

    if (this.loginForm.valid) {
      this.authenticationService.login(this.loginForm.controls.usernamel.value, this.loginForm.controls.passwordl.value).pipe(
        takeUntil(this.componentDestroyed))
        .subscribe(result => {
          if (!result.getError()) {
            this.notificationService.getSuperNotification(10, 0).pipe(
              takeUntil(this.componentDestroyed))
              .subscribe(superNotification => {
                this.navBarService.notifications.next(superNotification.count);

                interval(2000 * 60).pipe(
                  takeUntil(this.componentDestroyed))
                  .subscribe(x => {
                    this.notificationService.getSuperNotification(10, 0).pipe(
                      takeUntil(this.componentDestroyed))
                      .subscribe(superNotification => {
                        this.navBarService.notifications.next(superNotification.count);
                    });
                });
            });
            this.navBarService.loggedIn.next(true);
            this.navBarService.areaVisible.next(true);
            this.router.navigate(['/']);
            this.loading = false;
            this.submitted = true;
          } else {
            this.errors = result.getError();
            this.loading = false;
            this.submitted = true;
          }
      });
    } else {
      this.loading = false;
      this.submitted = true;
      this.snackBar.open('Your information is incorrect', 'Close', {
        duration: 3000
      });
    }
  }

  recoverPassword() {
    this.errors = null;
    this.loading = true;
    this.submitted = false;
    if (this.recoverPasswordForm.valid) {
      this.registrationService.recoverPasswordStep1(
        this.recoverPasswordForm.controls.emailrp.value,
        this.recoverPasswordForm.controls.usernamerp.value,
        this.token).pipe(
        takeUntil(this.componentDestroyed))
        .subscribe(result => {
          if (!result.getError()) {
            this.router.navigateByUrl('/recover/password/' + result.transaction);
            this.resetTransaction = result.transaction;
            this.loading = false;
            this.submitted = true;
          } else {
            this.errors = result.getError();
            this.loading = false;
            this.submitted = true;
          }
        });
    } else {
      this.loading = false;
      this.submitted = true;
      this.snackBar.open('Your information is incorrect', 'Close', {
        duration: 3000
      });
    }
  }

  recoverUsername() {
    this.errors = null;
    this.loading = true;
    this.submitted = false;

    if (this.recoverUsernameForm.valid) {
      this.registrationService.recoverUsername(this.recoverUsernameForm.controls.emailru.value, this.token).pipe(
      takeUntil(this.componentDestroyed))
      .subscribe(result => {
        if (!result.getError()) {
          this.snackBar.open('We will contact you via the information provided', 'Close', {
            duration: 3000
          });
          this.loading = false;
          this.submitted = true;
        } else {
          this.errors = result.getError();
          this.loading = false;
          this.submitted = true;
        }
      });
    } else {
      this.loading = false;
      this.submitted = true;
      this.snackBar.open('Your information is incorrect', 'Close', {
        duration: 3000
      });
    }
  }

  register() {
    this.errors = null;
    this.loading = true;
    this.submitted = false;

    if (this.registerForm.valid) {
      if (this.registerForm.controls.passwordr.value === this.registerForm.controls.password2r.value) {
        this.registrationService.register(
          this.registerForm.controls.usernamer.value,
          this.registerForm.controls.emailr.value,
          this.registerForm.controls.passwordr.value,
          this.token).pipe(
          takeUntil(this.componentDestroyed))
          .subscribe(result => {
            if (!result.getError()) {
              this.router.navigate(['/register/success']);
              this.loading = false;
              this.submitted = true;
            } else {
              this.errors = result.getError();
              this.loading = false;
              this.submitted = true;
            }
        });
      } else {
        this.loading = false;
        this.submitted = true;
        this.snackBar.open('Your passwords do not match', 'Close', {
          duration: 3000
        });
      }
    } else {
      this.loading = false;
      this.submitted = true;
      this.snackBar.open('Your information is incorrect', 'Close', {
        duration: 3000
      });
    }
  }

  resetPassword() {
    if (this.recoverPasswordForm2.valid) {
      if (this.recoverPasswordForm2.controls.passwordrp2.value === this.recoverPasswordForm2.controls.password2rp2.value) {
        this.registrationService.recoverPasswordStep2(
          this.recoverPasswordForm2.controls.passwordrp2.value,
          this.recoverPasswordForm2.controls.tokenrp2.value,
          this.resetTransaction,
          this.token).pipe(
          takeUntil(this.componentDestroyed))
          .subscribe(result => {
            if (!result.getError()) {
              this.snackBar.open('Your new password is now set', 'Close', {
                duration: 3000
              });
              this.router.navigateByUrl('login');
              this.loading = false;
              this.captcha.reset();
            } else {
              this.snackBar.open('You inputted something incorrectly', 'Close', {
                duration: 3000
              });
              this.errors = result.getError();
              this.loading = false;
              this.captcha.reset();
            }
          });
        } else {
          this.snackBar.open('Your passwords did not match', 'Close', {
            duration: 3000
          });
        }
    } else {
      this.loading = false;
      this.submitted = true;
      this.snackBar.open('Your information is incorrect', 'Close', {
        duration: 3000
      });
    }
  }

  setCaptchaResponse(res: any) {
    this.token = res;
  }
}
