import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Notification } from '../_models/notification';
import { AuthenticationService } from '../_services/authentication.service';
import { NavBarService } from '../_services/navBar.service';
import { NotificationService } from '../_services/notification.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: 'navBar.component.html'
})
export class NavBarComponent implements OnInit {
  activeLinkIndex = 2;
  mobileRouteLinks: any[];
  notificationLength: number;
  routeLinks: any[];
  styleDesktop: string;
  styleMobile: string;

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private navBarService: NavBarService
  ) {
    router.events.subscribe((url: any) => {
      if (this.authenticationService.token) {
        this.notificationService.getSuperNotification(10, 0)
          .subscribe(superNotification => {
            this.navBarService.notifications.next(superNotification.count);
            this.cdRef.detectChanges();
        });
        this.styleMobile = '';
        this.styleDesktop = '';
      } else {
        this.styleMobile = 'none';
        this.styleDesktop = 'none';
      }

      this.setActiveIndex(url.url);
    });

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
    this.navBarService.notifications
      .subscribe(num => {
        this.notificationLength = num;
        this.cdRef.detectChanges();
    });

    if (this.authenticationService.token) {
      this.styleMobile = '';
      this.navBarService.isVisibleSource
        .subscribe((isVisible: string) => {
          this.styleMobile = isVisible;
      });
    } else {
      this.styleMobile = 'none';
    }
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

  setActiveIndex(s: string) {
    if (s === '/profile') {
      this.activeLinkIndex = 0;
    } else if (s === '/notifications') {
      this.activeLinkIndex = 1;
    } else if (s.lastIndexOf('/notifications/') !== -1) {
      this.activeLinkIndex = 1;
    } else if (s === '/') {
      this.activeLinkIndex = 2;
    } else if (s === '/posts') {
      this.activeLinkIndex = 3;
    } else if (s.lastIndexOf('/posts/') !== -1) {
      this.activeLinkIndex = 3;
    }else if (s === '/create') {
      this.activeLinkIndex = 4;
    }
    this.cdRef.detectChanges();
  }
}
