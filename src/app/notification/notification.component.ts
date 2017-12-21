import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Notification } from '../_models/notification';
import { Post } from '../_models/post';
import { NavBarService } from '../_services/navBar.service';
import { NotificationService } from '../_services/notification.service';
import { RouteService } from '../_services/route.service';

@Component({
  templateUrl: 'notification.component.html'
})
export class NotificationComponent implements OnInit {
  archivedPosts: Post[] = [];
  loading = true;
  notifications: Notification[] = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private navBarService: NavBarService,
    private notificationService: NotificationService,
    private routeService: RouteService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.routeService.resetRoutes();
    // get notifications from secure api end point
    this.notificationService.getNotifications()
      .subscribe(notification => {
        this.notifications = notification;
        this.navBarService.notifications.next(this.notifications);
        this.loading = false;
    });
  }

  deleteNotifications() {
    this.notificationService.deleteNotifications();
    this.notifications = [];
    this.navBarService.notifications.next([]);
    this.cdRef.detectChanges();
  }

  loadArchive() {
    this.routeService.addNextRoute(this.router.url);
    this.router.navigateByUrl('/notifications/archive');
  }

  goto(areaID: string, postID: number, comments: number[] = []) {
    let commentString = '';
    let index: number;
    for (let i = 0; i < comments.length; i++) {
      if (i !== 0) {
        commentString += '-';
      }
      commentString += comments[i];
    }
    for (let i = 0; i < this.notificationService.notifications.length; i++) {
      if (this.notificationService.notifications[i].post.id === postID) {
        index = i;
      }
    }

    this.notificationService.removeNotification(index)
      .subscribe(notification => {
        this.notifications = notification;
        this.navBarService.notifications.next(this.notifications);
    });

    this.routeService.addNextRoute(this.router.url);
    this.router.navigateByUrl('/areas/' + areaID + '/' + postID + '/' + commentString);
  }
}
