import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef, } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LogoutDialogComponent } from '../../_dialogs/logout.dialog.component';
import { Account } from '../../_models/account';
import { Author } from '../../_models/author';
import { Ban } from '../../_models/ban';
import { Post } from '../../_models/post';
import { SuperBan } from '../../_models/superBan';
import { AuthenticationService } from '../../_services/authentication.service';
import { ProfileService } from '../../_services/profile.service';
import { RouteService } from '../../_services/route.service';
import { BootController } from '../../../boot-control';

declare const Compressor: any;

@Component({
  templateUrl: 'profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  account: Account;
  author: Author;
  bans: Ban[] = [];
  bioForm: FormGroup;
  componentDestroyed: Subject<boolean> = new Subject();
  editBio = false;
  emailForm: FormGroup;
  errors: any;
  imageArray: { [area: string]: string[]; } = {};
  index = 1;
  limit = 10;
  loading = true;
  offset = 10;
  passwordForm: FormGroup;
  path = '';
  self: boolean;
  superPosts: { [area: string]: Post[]; } = {};
  totalCount = 0;
  url: string;

  constructor(
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private ngZone: NgZone,
    private router: Router,
    public snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private profileService: ProfileService,
    private routeService: RouteService
  ) { }

  ngOnInit() {
    this.loading = true;

    this.emailForm = new FormGroup({
      'email': new FormControl(''),
    });

    this.bioForm = new FormGroup({
      'bio': new FormControl(''),
    });

    this.route.url
      .subscribe(r => {
        if (r[0]) {
          this.path = r[0].path;
        }

        if (r[1]) {
          this.self = false;

          this.profileService.getUser(r[1].path).pipe(
            takeUntil(this.componentDestroyed))
          .subscribe((self: Author) => {
            this.author = self;

            if (this.author.bio === '') {
              this.author.bio = '*No Bio*';
            }
            this.loading = false;
            this.bioForm.controls.bio.setValue(this.author.bio);
          });
        } else {
          this.self = true;
          this.profileService.getSelf().pipe(
            takeUntil(this.componentDestroyed))
          .subscribe((self: Author) => {
            this.author = self;
            if (this.author.bio === '') {
              this.author.bio = '*No Bio*';
            }
            this.loading = false;
            this.bioForm.controls.bio.setValue(this.author.bio);
          });

          this.profileService.getAccount().pipe(
            takeUntil(this.componentDestroyed))
            .subscribe((self: Account) => {
              this.account = self;
              if (this.account.email === '') {
                this.account.email = '*Please verify your email*';
              }
              this.emailForm.controls.email.setValue(this.account.email);
            });

          this.profileService.getBans(this.limit, (this.index * this.limit) - this.limit).pipe(
            takeUntil(this.componentDestroyed))
            .subscribe((superBan: SuperBan) => {
              superBan.results.forEach((obj: any) => {
                this.bans.push(Ban.parse(obj));
              });
              this.totalCount = superBan.count;
            });
        }
      });
  }

  ngOnDestroy() {
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }

  backOrLogout(event: any) {
    event.stopPropagation();
    if (this.self) {
      this.openLogoutDialog();
    } else {
      if (this.routeService.routes.length === 0) {
        this.router.navigateByUrl('');
      } else {
        this.router.navigateByUrl(this.routeService.getNextRoute());
      }
    }
  }

  getBans(page: number) {
    this.loading = true;
    this.bans = [];

    this.profileService.getBans(this.limit, (this.offset * page) - this.limit).pipe(
      takeUntil(this.componentDestroyed))
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

  goto(s: string) {
    if (this.self) {
      if (s === 'password') {
        this.routeService.addNextRoute(this.path);
        this.router.navigateByUrl('/tools/password');
      } else if (this.self) {
        this.routeService.addNextRoute(this.path);
        this.router.navigateByUrl('/tools/image-upload');
      }
    } else {
      if (s === 'report') {
        this.routeService.addNextRoute(this.path);
        this.router.navigateByUrl(`/tools/report/${this.account.id}`);
      }
    }
  }

  info(event: any) {
    if (this.self) {
      event.stopPropagation();
      this.snackBar.open('Touch the item you want to edit', 'Close', {
        duration: 3000
      });
    }
  }

  infoNo() {
    if (this.self) {
      this.snackBar.open('You can not edit this', 'Close', {
        duration: 3000
      });
    }
  }

  openLogoutDialog() {
    const dialogRef = this.dialog.open(LogoutDialogComponent);
    dialogRef.afterClosed().pipe(
      takeUntil(this.componentDestroyed))
      .subscribe(result => {
        if (result.bool) {
          this.authenticationService.logout();
          // Triggers the reboot in main.ts
          this.ngZone.runOutsideAngular(() => BootController.getbootControl().restart());
          this.cdRef.detach();
          this.componentDestroyed.next(true);
          this.componentDestroyed.complete();

          this.snackBar.open('You were logged out successfully', 'Close', {
            duration: 3000
          });
          this.router.navigateByUrl('/login');
        }
      });
  }

  setBio() {
    if (this.self) {
      this.loading = true;

      if (this.bioForm.valid) {
        this.profileService.setBio(this.author, this.bioForm.controls.bio.value).pipe(
          takeUntil(this.componentDestroyed))
        .subscribe(result => {
          if (!result.getError()) {
            this.author = result;
            this.snackBar.open('Bio changed successfully', 'Close', {
              duration: 3000
            });
            this.toggleBio();
            this.loading = false;
          } else {
            this.errors = result.getError();
            this.loading = false;
          }
        });
      } else {
        this.loading = false;
        this.snackBar.open('Your information is incorrect', 'Close', {
          duration: 3000
        });
      }
    }
  }

  setEmail() {
    this.loading = true;
    if (this.bioForm.valid) {
      this.profileService.setEmail(this.emailForm.controls.email.value).pipe(
        takeUntil(this.componentDestroyed))
      .subscribe(result => {
        if (!result.getError()) {
          this.account = result;
          this.snackBar.open('We just sent you a verification email, you must verify your email for it to be set', 'Close', {
            duration: 3000
          });
          this.undoEmail();
          this.loading = false;
        } else {
          this.errors = result.getError();
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
      this.snackBar.open('Your information is incorrect', 'Close', {
        duration: 3000
      });
    }
  }

  toggleBio() {
    if (this.self) {
      this.editBio = !this.editBio;

      if (!this.editBio) {
        this.bioForm.controls.bio.setValue(this.author.bio);
      }
    }
  }

  undoEmail() {
    this.emailForm.controls.email.setValue(this.account.email);
  }

  viewProfile() {
    this.routeService.addNextRoute(this.router.url);
    this.router.navigateByUrl('/user/' + this.author.user);
  }

  /* Removed as of D114
  searchInput() {
    if (this.areaService.currentAreaName === 'fun') {
      this.searchArray = [];
      if (this.model.postText === '') {
        this.searching = false;
        this.cdRef.detectChanges();
      } else {
        this.searching = true;

        for (let i = 0; i <= this.funPosts.length - 1; i++) {
          if (this.funPosts[i].text.toLowerCase().includes(this.model.postText.toLowerCase())) {
            this.searchArray.push(this.backupFunPosts[i]);
          }
        }
        this.cdRef.detectChanges();
      }
    } else {
      this.searchArray = [];
      if (this.model.postText === '') {
        this.searching = false;
        this.cdRef.detectChanges();
      } else {
        this.searching = true;

        for (let i = 0; i <= this.infoPosts.length - 1; i++) {
          if (this.infoPosts[i].text.toLowerCase().includes(this.model.postText.toLowerCase())) {
            this.searchArray.push(this.backupInfoPosts[i]);
          }
        }
        this.cdRef.detectChanges();
      }
    }
  }
  */
}
