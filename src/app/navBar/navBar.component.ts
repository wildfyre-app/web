import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, ViewChild } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MdSidenav, MdDialogRef, MdDialog, MdSnackBar } from '@angular/material';
import {Observable} from 'rxjs/Rx';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { AreaList } from '../_models/areaList';
import { Notification } from '../_models/notification';
import { AreaService } from '../_services/area.service';
import { AuthenticationService } from '../_services/authentication.service';
import { NavBarService } from '../_services/navBar.service';
import { NotificationService } from '../_services/notification.service';
import { BootController } from '../../boot-control';

@Component({
  selector: 'app-nav-bar',
  templateUrl: 'navBar.component.html'
})
export class NavBarComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav: MdSidenav;

  activeLinkIndex = 2;
  areas = new Array<AreaList>(new AreaList('', 0, 0));
  areaReputation: { [area: string]: number; } = { };
  areaSpread: { [area: string]: number; } = { };
  areaVisible = true;
  componentDestroyed: Subject<boolean> = new Subject();
  currentArea = this.areas[0].name;
  mobileRouteLinks: any[];
  notificationLength = 0;
  routeLinks: any[];
  styleDesktop: string;
  styleMobile: string;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dialog: MdDialog,
    private ngZone: NgZone,
    private router: Router,
    public snackBar: MdSnackBar,
    private areaService: AreaService,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private navBarService: NavBarService
  ) {

    this.routeLinks = [
      {label: 'Profile', link: '/profile/', index: '0'},
      {label: 'Notifications', link: '/notifications/1/', index: '1'},
      {label: 'Home', link: '/', index: '2'},
      {label: 'My Posts', link: '/posts/1/', index: '3'},
      {label: 'Create a Post', link: '/create/', index: '4'}
    ];

    this.mobileRouteLinks = [
      {label: '<i class="material-icons">perm_identity</i>', link: '/profile/', index: '0'},
      {label: '<i class="material-icons">notifications_none</i>', link: '/notifications/1/', index: '1'},
      {label: '<i class="material-icons">home</i>', link: '/', index: '2'},
      {label: '<i class="material-icons">content_copy</i>', link: '/posts/1/', index: '3'},
      {label: '<i class="material-icons">create</i>', link: '/create/', index: '4'}
    ];
  }

  ngOnInit() {
    this.navBarService.areaVisible
      .takeUntil(this.componentDestroyed)
      .subscribe((visible: boolean) => {
        this.areaVisible = visible;
        this.cdRef.detectChanges();
    });

    this.navBarService.loggedIn
      .takeUntil(this.componentDestroyed)
      .subscribe((loggedIn: boolean) => {
        if (loggedIn === true) {
          this.login();
          this.styleMobile = '';
          this.styleDesktop = '';
        }
        this.cdRef.detectChanges();
    });

    if (this.authenticationService.token) {
      this.login();
    } else {
      this.styleMobile = 'none';
      this.styleDesktop = 'none';
      this.navBarService.areaVisible.next(false);
      this.cdRef.detectChanges();
    }
  }

  ngOnDestroy() {
    this.cdRef.detach();
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }

  close(reason: string) {
    this.sidenav.close();
  }

  getNotificationLength(nLength: number) {
    if (nLength.toString().length === 4) {
      return nLength.toString().slice(0, 1) + 'K';
    } else if (nLength.toString().length === 5) {
      return nLength.toString().slice(0, 2) + 'K';
    } else if (nLength.toString().length >= 6) {
      return '\u221E';
    } else {
      return nLength.toString();
    }
  }

  login() {
    this.notificationService.getSuperNotification(10, 0)
      .takeUntil(this.componentDestroyed)
      .subscribe(superNotification => {
        this.navBarService.notifications.next(superNotification.count);
        this.cdRef.detectChanges();
    });

    this.styleMobile = '';
    this.styleDesktop = '';

    this.navBarService.notifications
      .takeUntil(this.componentDestroyed)
      .subscribe(num => {
        this.notificationLength = num;
        this.cdRef.detectChanges();
    });

    this.navBarService.isVisibleSource
      .takeUntil(this.componentDestroyed)
      .subscribe((isVisible: string) => {
        this.styleMobile = isVisible;
        this.cdRef.detectChanges();
    });

    Observable.interval(2000 * 60)
      .takeUntil(this.componentDestroyed)
      .subscribe(x => {
        this.notificationService.getSuperNotification(10, 0)
          .takeUntil(this.componentDestroyed)
          .subscribe(superNotification => {
            this.navBarService.notifications.next(superNotification.count);
            this.cdRef.detectChanges();
        });
    });

    this.router.events
      .takeUntil(this.componentDestroyed)
      .subscribe((url: any) => {
        this.setActiveIndex(url.url);
    });

    this.areaService.getAreas()
      .takeUntil(this.componentDestroyed)
      .subscribe(areas => {
        let area;
        this.areas = [];

        for (let i = 0; i < areas.length; i++) {
          this.areaService.getAreaRep(areas[i].name)
            .takeUntil(this.componentDestroyed)
            .subscribe(result => {
              area = new AreaList(
                areas[i].name,
                result.reputation,
                result.spread
              );
              this.areas.push(area);
          });
        }

        this.currentArea = areas[0].name;
        this.cdRef.detectChanges();
      });
  }

  onChange(area: string) {
    for (let i = 0; i <= this.areas.length - 1; i++) {
      if (this.areas[i].name === area) {
        this.navBarService.currentArea.next(this.areas[i]);
      }
    }
  }

  openLogoutDialog() {
    const dialogRef = this.dialog.open(LogoutDialogComponent);
    dialogRef.afterClosed()
      .takeUntil(this.componentDestroyed)
      .subscribe(result => {
        if (result.bool) {
          this.authenticationService.logout();
          // Triggers the reboot in main.ts
          this.ngZone.runOutsideAngular(() => BootController.getbootControl().restart());
          this.cdRef.detach();
          this.componentDestroyed.next(true);
          this.componentDestroyed.complete();

          const snackBarRef = this.snackBar.open('You were logged out successfully', 'Close', {
            duration: 3000
          });
          this.router.navigateByUrl('/login');
        }
      });
  }

  setActiveIndex(s: string) {
    if (s === '/profile') {
      this.activeLinkIndex = 0;
      this.navBarService.areaVisible.next(false);
    }  else if (s === '/notifications/archive') {
      this.activeLinkIndex = 1;
      this.navBarService.areaVisible.next(true);
    } else if (s.lastIndexOf('/notifications/archive/') !== -1) {
      this.activeLinkIndex = 1;
      this.navBarService.areaVisible.next(true);
    } else if (s === '/notifications') {
      this.activeLinkIndex = 1;
      this.navBarService.areaVisible.next(false);
    } else if (s.lastIndexOf('/notifications/') !== -1) {
      this.activeLinkIndex = 1;
      this.navBarService.areaVisible.next(false);
    } else if (s === '/') {
      this.activeLinkIndex = 2;
      this.navBarService.areaVisible.next(true);
    } else if (s === '/posts') {
      this.activeLinkIndex = 3;
      this.navBarService.areaVisible.next(true);
    } else if (s.lastIndexOf('/posts/') !== -1) {
      this.navBarService.areaVisible.next(true);
    } else if (s === '/create') {
      this.activeLinkIndex = 4;
      this.navBarService.areaVisible.next(true);
    } else if (s.lastIndexOf('/areas/') !== -1) {
      this.navBarService.areaVisible.next(false);
    } else if (s.lastIndexOf('/user/') !== -1) {
      this.navBarService.areaVisible.next(false);
    }
    this.cdRef.detectChanges();
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
