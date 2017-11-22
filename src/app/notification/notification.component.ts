import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Notification } from '../_models/notification';
import { NotificationService } from '../_services/notification.service';
import { RouteService } from '../_services/route.service';

@Component({
  templateUrl: 'notification.component.html'
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private routeService: RouteService
  ) { }

  ngOnInit() {
    this.routeService.resetRoutes();
    // get notifications from secure api end point
    this.notificationService.getNotifications()
      .subscribe(notification => {
        this.notifications = notification;
    });
  }

  goto(areaID: string, postID: number, comments: number[] = []) {
    let commentString = '';

    for (let i = 0; i < comments.length; i++) {
      if (i !== 0) {
        commentString += '-';
      }

      commentString += comments[i];
    }

    this.routeService.addNextRoute(this.router.url);
    this.router.navigateByUrl('/areas/' + areaID + '/' + postID + '/' + commentString);
}
}
