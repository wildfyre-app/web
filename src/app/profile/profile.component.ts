import { Component, OnInit, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Account } from '../_models/account';
import { Author } from '../_models/author';
import { Ban } from '../_models/ban';
import { Choice } from '../_models/choice';
import { PasswordError } from '../_models/password';
import { SuperBan } from '../_models/superBan';
import { AuthenticationService } from '../_services/authentication.service';
import { ProfileService } from '../_services/profile.service';
import { ReasonService } from '../_services/reason.service';
import { RouteService } from '../_services/route.service';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';
import { BootController } from '../../boot-control';

@Component({
  templateUrl: 'profile.component.html'
})
export class ProfileComponent implements OnInit {
  account: Account;
  author: Author;
  choices: Choice[];
  data: any;
  index = 1;
  limit = 2;
  loading = true;
  model: any = {};
  offset = 2;
  url: string;
  self: boolean;
  bans: Ban[] = [];
  totalCount = 0;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dialog: MdDialog,
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private router: Router,
    public snackBar: MdSnackBar,
    private authenticationService: AuthenticationService,
    private profileService: ProfileService,
    private reasonService: ReasonService,
    private routeService: RouteService
  ) { }

  ngOnInit() {
    this.reasonService.getFlagReasons()
      .subscribe((choices) => {
        this.choices = choices;
      });
    this.routeService.resetRoutes();
    this.route.params.subscribe((parms) => {
      if (parms['id']) {
        this.profileService.getUser(parms['id']).subscribe((user: Author) => {
          this.self = false;
          this.author = user;
        });
      } else {
        this.self = true;

        this.profileService.getSelf()
          .subscribe((self: Author) => {
            this.author = self;
            this.model.bio = this.author.bio;
          });

        this.profileService.getAccount()
          .subscribe((self: Account) => {
            this.account = self;
            this.model.email = this.account.email;
          });

        this.profileService.getBans(this.limit, (this.index * this.limit) - this.limit)
          .subscribe((superBan: SuperBan) => {
            superBan.results.forEach((obj: any) => {
              this.bans.push(Ban.parse(obj));
            });
            this.totalCount = superBan.count;
            this.cdRef.detectChanges();
          });

      }
    });

    this.profileService.getAccount().subscribe((self: Account) => {
      this.account = self;
      this.model.email = this.account.email;
      this.self = true;
    });
    this.loading = false;
  }

  getBans(page: number) {
    this.loading = true;
    this.bans = [];

    this.profileService.getBans(this.limit, (this.offset * page) - this.limit)
      .subscribe(superBan => {

        superBan.results.forEach((obj: any) => {
          this.bans.push(Ban.parse(obj));
        });

        this.index = page;
        this.totalCount = superBan.count;
        this.cdRef.detectChanges();
        this.loading = false;
    });
  }

  getReason(number: number): string {
    if (number !== null) {
      return this.choices[number].value;
    } else {
      return this.choices[3].value;
    }
  }

  openBioDialog() {
    const dialogRef = this.dialog.open(BioDialogComponent);
    dialogRef.componentInstance.model.bio = this.author.bio;
    dialogRef.afterClosed()
      .subscribe(result => {
        if (result.bool) {
          this.profileService.setBio(this.author, result.bio).subscribe();
          const snackBarRef = this.snackBar.open('Bio changed successfully', 'Close', {
            duration: 3000
          });
        }
      });
  }

  openEmailDialog() {
    const dialogRef = this.dialog.open(EmailDialogComponent);
    dialogRef.componentInstance.model.email = this.account.email;
    dialogRef.afterClosed()
      .subscribe(result => {
        if (result.bool) {
          this.profileService.setEmail(result.email).subscribe();
          const snackBarRef = this.snackBar
            .open('We just sent you a verification email, you must verify your email for it to be set', 'Close', {
            duration: 3000
          });
        }
      });
  }

  openPasswordDialog() {
    const dialogRef = this.dialog.open(PasswordDialogComponent);
    dialogRef.componentInstance.account = this.account;
    dialogRef.componentInstance.author = this.author;
    dialogRef.afterClosed()
      .subscribe(result => {
        if (result.bool) {
          const snackBarRef = this.snackBar.open('Password changed successfully', 'Close', {
            duration: 3000
          });
        }
      });
  }

  openPictureDialog() {
    const dialogRef = this.dialog.open(AvatarDialogComponent);
    dialogRef.componentInstance.author = this.author;
    dialogRef.afterClosed()
      .subscribe(result => {
        if (result.bool) {
          if (result.profilePicture) {
          this.profileService.setProfilePicture(result.profilePicture)
            .subscribe(result2 => {
              if (!result2.getError()) {
              this.author.avatar = result2.avatar;
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
      });
  }

  openLogoutDialog() {
    const dialogRef = this.dialog.open(LogoutDialogComponent);
    dialogRef.afterClosed()
      .subscribe(result => {
        if (result.bool) {
          this.authenticationService.logout();
          // Triggers the reboot in main.ts
          this.ngZone.runOutsideAngular(() => BootController.getbootControl().restart());
          const snackBarRef = this.snackBar.open('You were logged out successfully', 'Close', {
            duration: 3000
          });
          this.router.navigateByUrl('/login');
        }
      });
  }

    viewProfile() {
      this.routeService.addNextRoute(this.router.url);
      this.router.navigateByUrl('/user/' + this.author.user);
    }
  }

  @Component({
    template: `
    <h1 md-dialog-title>Change Avatar</h1>
    <img-cropper [image]="data" [settings]="cropperSettings" (onCrop)="cropped($event)"></img-cropper>
    <span class="result" *ngIf="data.image">
      <img [src]="data.image" [width]="croppedWidth" [height]="croppedHeight">
    </span>
    <div md-dialog-actions>
      <button md-button md-dialog-close="true" (click)="returnInformation(true)">Change Avatar</button>
      <button md-button md-dialog-close="false" (click)="returnInformation(false)">Cancel</button>
    </div>
    `
  })
  export class AvatarDialogComponent {
    @ViewChild('cropper', undefined) cropper: ImageCropperComponent;
    author: Author;
    croppedHeight: number;
    croppedWidth: number;
    cropperSettings: CropperSettings;
    data: any;
    model: any = {};
    profilePicture: any;

    constructor(
      public dialogRef: MdDialogRef<AvatarDialogComponent>,
      public snackBar: MdSnackBar
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

      returnInformation(bool: boolean) {
        const message = {
          'profilePicture': this.profilePicture,
          'bool': bool
        };

        this.dialogRef.close(message);
      }
  }

  @Component({
    template: `
    <h1 md-dialog-title>Change Bio</h1>
      <md-input-container>
        <textarea mdInput rows="10" cols="80" type="text" class="form-control" name="bio" [(ngModel)]="model.bio" #bio="ngModel"></textarea>
      </md-input-container>
    <div md-dialog-actions>
      <button md-button md-dialog-close="true" (click)="returnInformation(true)">Change Bio</button>
      <button md-button md-dialog-close="false" (click)="returnInformation(false)">Cancel</button>
    </div>
    `
  })
  export class BioDialogComponent {
    model: any = {};

    constructor(
      public dialogRef: MdDialogRef<BioDialogComponent>
      ) { }

      returnInformation(bool: boolean) {
        const message = {
          'bio': this.model.bio,
          'bool': bool
        };

        this.dialogRef.close(message);
      }
  }

  @Component({
    template: `
    <h1 md-dialog-title>Change Email</h1>
      <md-input-container>
        <input mdInput type="text" name="email" [(ngModel)]="model.email" #email="ngModel">
      </md-input-container>
    <div md-dialog-actions>
      <button md-button md-dialog-close="true" (click)="returnInformation(true)">Change Email</button>
      <button md-button md-dialog-close="false" (click)="returnInformation(false)">Cancel</button>
    </div>
    `
  })
  export class EmailDialogComponent {
    model: any = {};

    constructor(
      public dialogRef: MdDialogRef<EmailDialogComponent>
      ) { }

      returnInformation(bool: boolean) {
        const message = {
          'email': this.model.email,
          'bool': bool
        };

        this.dialogRef.close(message);
      }
  }

  @Component({
    template: `
    <h1 md-dialog-title>Are you sure you want to logout?</h1>
    <div md-dialog-actions>
      <button md-button md-dialog-close="true" (click)="returnInformation(true)">Yes</button>
      <button md-button md-dialog-close="false" (click)="returnInformation(false)">Cancel</button>
    </div>
    `
  })
  export class LogoutDialogComponent {
    model: any = {};

    constructor(
      public dialogRef: MdDialogRef<LogoutDialogComponent>
      ) { }

      returnInformation(bool: boolean) {
        const message = {
          'bool': bool
        };

        this.dialogRef.close(message);
      }
  }

  @Component({
    template: `
    <h1 md-dialog-title>Change Password</h1>
    <div class="alert alert-info">
      Passwords must contain at least 8 characters and be alphanumeric (At least 1 letter and 1 number)
    </div>
    <div *ngIf="errors && errors._text" class="help-block">
      <ul *ngFor="let err of errors._text">
        <li>{{err}}</li>
      </ul>
    </div>
    <form name="form" id="change-password-form" (ngSubmit)="f.form.valid && submitEditPassword()" #f="ngForm" novalidate>
      <div *ngIf="errors && errors.non_field_errors" class="alert alert-danger">
        <ul *ngFor="let err of errors.non_field_errors">
          <li>{{err}}</li>
        </ul>
      </div>

      <input placeholder="Username" type="hidden" name="username" [value]="author.name"
        [(ngModel)]="author.name" #username="ngModel" autocomplete="on" readonly />

      <div class="form" [ngClass]="{ 'has-error': f.submitted && (!oldPassword.valid || (errors && errors._oldPassword)) }">
        <md-input-container>
          <input mdInput placeholder="Old Password" type="password" name="oldPassword"
            [(ngModel)]="model.oldPassword" #oldPassword="ngModel" autocomplete="current-password" required />
        </md-input-container>
        <div *ngIf="f.submitted && !oldPassword.valid" class="help-block">Password is required</div>
        <div *ngIf="errors && errors._oldPassword" class="help-block">
          <ul *ngFor="let err of errors._oldPassword">
            <li>{{err}}</li>
          </ul>
        </div>
      </div>

      <div class="form" [ngClass]="{ 'has-error': f.submitted && (!newPassword1.valid || (errors && errors._newPassword1)) }">
        <md-input-container>
          <input mdInput placeholder="New Password" type="password" name="newPassword1"
            [(ngModel)]="model.newPassword1" #newPassword1="ngModel" autocomplete="new-password" required />
        </md-input-container>
        <div *ngIf="f.submitted && !newPassword1.valid" class="help-block">Password is required</div>
        <div *ngIf="errors && errors._newPassword1" class="help-block">
          <ul *ngFor="let err of errors._newPassword1">
            <li>{{err}}</li>
          </ul>
        </div>
      </div>

      <div class="form" [ngClass]="{ 'has-error': f.submitted && (!newPassword2.valid || (errors && errors._newPassword2)) }">
        <md-input-container>
          <input mdInput placeholder="New Password (repeat)" type="password" name="newPassword2"
            [(ngModel)]="model.newPassword2" #newPassword2="ngModel" autocomplete="new-password" required />
        </md-input-container>
        <div *ngIf="f.submitted && !newPassword2.valid" class="help-block">Password is required</div>
        <div *ngIf="errors && errors._newPassword2" class="help-block">
          <ul *ngFor="let err of errors._newPassword2">
            <li>{{err}}</li>
          </ul>
        </div>
      </div>
    </form>
    <div md-dialog-actions>
      <button md-button (click)="submitEditPassword()">Change Password</button>
      <button md-button md-dialog-close="false" (click)="returnInformation(false)">Cancel</button>
    </div>
    `
  })
  export class PasswordDialogComponent {
    account: Account;
    author: Author;
    errors: PasswordError;
    model: any = {};

    constructor(
      public dialogRef: MdDialogRef<PasswordDialogComponent>,
      public snackBar: MdSnackBar,
      private authenticationService: AuthenticationService,
      private profileService: ProfileService,
      ) { }

      submitEditPassword() {
        this.authenticationService.login(this.account.username, this.model.oldPassword)
          .subscribe(result => {
            if (!result.getError()) {
              if (this.model.newPassword1 === this.model.newPassword2) {
                this.profileService.setPassword(this.model.newPassword1).subscribe(result2 => {
                  if (!result2.getError()) {
                    this.authenticationService.login(this.account.username, this.model.newPassword1)
                      .subscribe(result3 => {
                        if (!result3.getError()) {
                          this.model.oldPassword = '';
                          this.model.newPassword1 = '';
                          this.model.newPassword2 = '';
                        this.returnInformation(true);
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

      returnInformation(bool: boolean) {
        const message = {
          'bool': bool
        };

        this.dialogRef.close(message);
      }
  }
