import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, ViewChild } from '@angular/core';
import { MatSidenav, MatDialog, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { LogoutDialogComponent } from '../_dialogs/logout.dialog.component';
import { PictureDialogComponent } from '../_dialogs/picture.dialog.component';
import { Area } from '../_models/area';
import { CommentData } from '../_models/commentData';
import { AreaService } from '../_services/area.service';
import { AuthenticationService } from '../_services/authentication.service';
import { NavBarService } from '../_services/navBar.service';
import { NotificationService } from '../_services/notification.service';
import { BootController } from '../../boot-control';

@Component({
  selector: 'app-nav-bar',
  templateUrl: 'navBar.component.html',
  styleUrls: ['./navBar.component.scss']
})
export class NavBarComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav: MatSidenav;

  activeLinkIndex = 1;
  areas = new Array<Area>(new Area('', '', 0, 0));
  areaReputation: { [area: string]: number; } = { };
  areaSpread: { [area: string]: number; } = { };
  areaVisible = true;
  comment: CommentData = new CommentData('', null);
  commentDisabled = false;
  componentDestroyed: Subject<boolean> = new Subject();
  currentArea: Area = this.areas[0];
  expanded = false;
  hasPost = false;
  heightText: string;
  loggedIn = false;
  mobileRouteLinks: any[];
  notificationLength = 0;
  routeLinks: any[];
  rowsExapanded = 2;
  styleBottomEditor: string;
  styleBottomSend: string;
  styleBottomTextarea: string;
  styleDesktop: string;
  styleHeightEditor: string;
  styleHeightSend: string;
  styleHeightTextarea: string;
  styleMobile: string;
  stylePage: boolean;
  width: string;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private ngZone: NgZone,
    private router: Router,
    public snackBar: MatSnackBar,
    private areaService: AreaService,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private navBarService: NavBarService
  ) { }

  ngOnInit() {
    this.router.events
      .takeUntil(this.componentDestroyed)
      .subscribe((url: any) => {
        this.setActiveIndex(url.url);
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
      this.loggedIn = true;
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

    this.areaService.getAreas()
      .takeUntil(this.componentDestroyed)
      .subscribe(areas => {
        this.areas = [];

        for (let i = 0; i < areas.length; i++) {
          this.areaService.getAreaRep(areas[i].name)
            .takeUntil(this.componentDestroyed)
            .subscribe(result => {
              let area;
              area = new Area(
                areas[i].name,
                areas[i].displayname,
                result.reputation,
                result.spread
              );

              this.areas.push(area);

              this.currentArea = this.areas[0];
              this.areaService.currentAreaName = this.currentArea.name;
              this.navBarService.currentArea.next(this.currentArea);
              this.cdRef.detectChanges();
          });
        }
      });
      this.loggedIn = true;
  }

  onChange(area: Area) {
    this.currentArea = area;
    this.areaService.currentAreaName = this.currentArea.name;
    this.navBarService.currentArea.next(this.currentArea);
  }

  openLogoutDialog() {
    const dialogRef = this.dialog.open(LogoutDialogComponent);
    dialogRef.afterClosed()
      .takeUntil(this.componentDestroyed)
      .subscribe(result => {
        if (result.bool) {
          this.loggedIn = false;
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

  postComment() {
    this.commentDisabled = true;
    this.navBarService.comment.next(this.comment);
  }

  setActiveIndex(s: string) {
    this.width = '100%';
    if (s === undefined) {
      s = '/';
    }
    if (s === '/profile') {
      this.stylePage = false;
      this.activeLinkIndex = 4;
    } else if (s === '/notifications/archive') {
      this.stylePage = false;
      this.activeLinkIndex = 2;
    } else if (s.lastIndexOf('/notifications/archive/') !== -1) {
      this.stylePage = false;
      this.activeLinkIndex = 2;
    } else if (s === '/notifications') {
      this.activeLinkIndex = 2;
    } else if (s.lastIndexOf('/notifications/') !== -1) {
      this.activeLinkIndex = 2;
    } else if (s === '/') {
      this.activeLinkIndex = 1;
    } else if (s === '/posts') {
      this.activeLinkIndex = 3;
    } else if (s.lastIndexOf('/posts/') !== -1) {
      this.activeLinkIndex = 3;
    } else if (s === '/create') {
      this.activeLinkIndex = -1;
    } else if (s.lastIndexOf('/create/') !== -1) {
      this.activeLinkIndex = -1;
    } else if (s === '/drafts') {
      this.activeLinkIndex = -1;
    } else if (s.lastIndexOf('/areas/') !== -1) {
      this.activeLinkIndex = -1;
    } else if (s.lastIndexOf('/user/') !== -1) {
      this.activeLinkIndex = -1;
    } else if (s.lastIndexOf('/login') !== -1) {
      this.activeLinkIndex = -1;
    }
    this.cdRef.detectChanges();
  }

  switchRoute(s: string) {
    if (s === 'home') {
      this.router.navigateByUrl('/');
    } else if (s === 'profile') {
      this.router.navigateByUrl('/profile');
    } else if (s === 'notifications') {
      this.router.navigateByUrl('/notifications');
    } else if (s === 'my-posts') {
      this.router.navigateByUrl('/posts');
    }
  }
}
