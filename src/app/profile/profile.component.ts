import { Component, OnInit, ViewChild } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Account } from '../_models/account';
import { Author } from '../_models/author';
import { PasswordError } from '../_models';
import { AuthenticationService } from '../_services/authentication.service';
import { ProfileService } from '../_services/profile.service';
import { RouteService } from '../_services/route.service';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';

@Component({
  templateUrl: 'profile.component.html'
})
export class ProfileComponent implements OnInit {
  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;
  account: Account;
  author: Author;
  bioEdit: boolean;
  croppedHeight: number;
  croppedWidth: number;
  cropperSettings: CropperSettings;
  data: any;
  emailEdit: boolean;
  errors: PasswordError;
  model: any = {};
  passwordEdit: boolean;
  pictureEdit: boolean;
  profilePicture: any;
  url: string;
  self: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public snackBar: MdSnackBar,
    private authenticationService: AuthenticationService,
    private profileService: ProfileService,
    private routeService: RouteService
  ) {
  this.cropperSettings = new CropperSettings();
  this.cropperSettings.width = 200;
  this.cropperSettings.height = 200;

  this.cropperSettings.croppedWidth = 200;
  this.cropperSettings.croppedHeight = 200;

  this.cropperSettings.canvasWidth = 200;
  this.cropperSettings.canvasHeight = 200;

  this.cropperSettings.minWidth = 10;
  this.cropperSettings.minHeight = 10;

  this.cropperSettings.rounded = false;
  this.cropperSettings.keepAspect = true;

  this.cropperSettings.cropperDrawSettings.strokeColor = 'rgb(191, 63, 127)';
  this.cropperSettings.cropperDrawSettings.strokeWidth = 3;

  this.data = {};
   }

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

  cancelEditPicture() {
    this.pictureEdit = false;
  }

  cropped(bounds: Bounds) {
    this.croppedHeight = bounds.bottom - bounds.top;
    this.croppedWidth = bounds.right - bounds.left;
    if (this.data) {
      // convert the data URL to a byte string
      const byteString = atob(this.data.image.split(',')[1]);

      // pull out the mime type from the data URL
      const mimeString = this.data.image.split(',')[0].split(':')[1].split(';')[0];

      // Convert to byte array
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }

      // Create a blob that looks like a file.
      this.profilePicture = new Blob([ab], {'type': mimeString });
      this.profilePicture['name'] = this.author.name + this.author.user;
      switch (this.profilePicture.type) {
        case 'image/jpeg':
          this.profilePicture['name'] += '.jpg';
        break;
        case 'image/png':
          this.profilePicture['name'] += '.png';
        break;
      }
    } else {
      const snackBarRef = this.snackBar.open('You did not select a valid image file', 'Close', {
        duration: 3000
      });
    }
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

  editPicture() {
    this.pictureEdit = true;
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

    submitEditPicture() {
      if (this.profilePicture) {
      this.profileService.setProfilePicture(this.profilePicture)
        .subscribe(result => {
          if (!result.getError()) {
          this.author.avatar = result.avatar;
          this.pictureEdit = false;
        } else {
          const snackBarRef = this.snackBar.open('Your image file must be below 512KiB in size', 'Close', {
            duration: 3000
          });
        }
        });
      } else {
        const snackBarRef = this.snackBar.open('You did not select a valid image file', 'Close', {
          duration: 3000
        });
      }
    }

    viewProfile() {
      this.routeService.addNextRoute(this.router.url);
      this.router.navigateByUrl('/user/' + this.author.user);
    }
  }
