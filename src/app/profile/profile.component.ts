import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Author } from '../_models/author';
import { Account } from '../_models/account';
import { ProfileService } from '../_services/profile.service';
import { AuthenticationService } from '../_services/authentication.service';
import { MdSnackBar } from '@angular/material';
import { PasswordError } from '../_models';

@Component({
  templateUrl: 'profile.component.html'
})
export class ProfileComponent implements OnInit {
  model: any = {};
  author: Author;
  account: Account;
  bioEdit: boolean;
  emailEdit: boolean;
  passwordEdit: boolean;
  self: boolean;
  errors: PasswordError;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private authenticationService: AuthenticationService,
    public snackBar: MdSnackBar
  ) { }

  ngOnInit() {
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
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  editBio() {
    this.bioEdit = true;
  }

  cancelEditBio() {
    this.bioEdit = false;
  }

  submitEditBio() {
    this.profileService.setBio(this.author, this.model.bio).subscribe();
    this.bioEdit = false;
  }

  editEmail() {
    this.emailEdit = true;
  }

  cancelEditEmail() {
    this.emailEdit = false;
    this.model.email = '';
  }

  submitEditEmail() {
    this.profileService.setEmail(this.model.email).subscribe();
    const snackBarRef = this.snackBar.open('We just sent you a verification email, you must verify your email for it to be set', 'Close');
    this.emailEdit = false;
    this.model.email = '';
  }

  editPassword() {
    this.passwordEdit = true;
  }

  cancelEditPassword() {
    this.passwordEdit = false;
    this.model.oldPassword = '';
    this.model.newPassword1 = '';
    this.model.newPassword2 = '';
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
