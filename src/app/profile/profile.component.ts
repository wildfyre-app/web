import { Component, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Account } from '../_models/account';
import { Author } from '../_models/author';
import { PasswordError } from '../_models';
import { AuthenticationService } from '../_services/authentication.service';
import { ProfileService } from '../_services/profile.service';
import { RouteService } from '../_services/route.service';

@Component({
  templateUrl: 'profile.component.html'
})
export class ProfileComponent implements OnInit {
  account: Account;
  author: Author;
  bioEdit: boolean;
  emailEdit: boolean;
  errors: PasswordError;
  model: any = {};
  passwordEdit: boolean;
  self: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public snackBar: MdSnackBar,
    private authenticationService: AuthenticationService,
    private profileService: ProfileService,
    private routeService: RouteService
  ) { }

  ngOnInit() {
    this.routeService.resetRoutes();
    this.route.params.subscribe((parms) => {
      if (parms['id']) {
        this.profileService.getUser(parms['id']).subscribe((user: Author) => {
          this.self = false;
          this.author = user;
        });
      } else {
        this.profileService.getSelf().subscribe((self: Author) => {
          this.author = self;
          this.model.bio = this.author.bio;
          this.self = true;
        });

        this.profileService.getAccount().subscribe((self: Account) => {
          this.account = self;
          this.model.email = this.account.email;
          this.self = true;
        });

      }
    });

    this.profileService.getAccount().subscribe((self: Account) => {
      this.account = self;
      this.model.email = this.account.email;
      this.self = true;
    });
  }

  editBio() {
    this.bioEdit = true;
  }

  editEmail() {
    this.emailEdit = true;
  }

  editPassword() {
    this.passwordEdit = true;
  }

  cancelEditBio() {
    this.bioEdit = false;
  }

  cancelEditEmail() {
    this.emailEdit = false;
    this.model.email = '';
  }

  cancelEditPassword() {
    this.passwordEdit = false;
    this.model.oldPassword = '';
    this.model.newPassword1 = '';
    this.model.newPassword2 = '';
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigateByUrl('/login');
  }

  submitEditBio() {
    this.profileService.setBio(this.author, this.model.bio).subscribe();
    this.bioEdit = false;
  }

  submitEditEmail() {
    this.profileService.setEmail(this.model.email).subscribe();
    const snackBarRef = this.snackBar.open('We just sent you a verification email, you must verify your email for it to be set', 'Close');
    this.emailEdit = false;
    this.model.email = '';
  }

  submitEditPassword() {
    this.authenticationService.login(this.account.username, this.model.oldPassword)
      .subscribe(result => {
        if (!result.getError()) {
          if (this.model.newPassword1 === this.model.newPassword2) {
            this.profileService.setPassword(this.model.newPassword1).subscribe(result2 => {
              if (!result2.getError()) {
                this.passwordEdit = false;
                this.authenticationService.login(this.account.username, this.model.newPassword1)
                  .subscribe(result3 => {
                    if (!result3.getError()) {
                      this.model.oldPassword = '';
                      this.model.newPassword1 = '';
                      this.model.newPassword2 = '';
                    const snackBarRef = this.snackBar.open('Password change successful!', 'Close');
                  } else {
                    const snackBarRef = this.snackBar.open('Error could not set token', 'Close');
                  }
                  });
              } else {
                this.errors = result2.getError();
                const snackBarRef = this.snackBar.open('You did not follow the requirements', 'Close');
              }
            });

          } else {
            this.errors = result.getError();
            const snackBarRef = this.snackBar.open('Your new passwords do not match', 'Close');
          }
        } else {
          this.errors = result.getError();
          const snackBarRef = this.snackBar.open('This is not your current password', 'Close');
        }
    });
    }
  }
