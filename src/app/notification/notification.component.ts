import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Notification } from '../_models';
import { NotificationService } from '../_services';

@Component({
  templateUrl: 'notification.component.html'
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];
  constructor(
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // get notifications from secure api end point
    this.notificationService.getNotifications()
      .subscribe(notification => {
        this.notifications = notification;
    });
  }

  goto(areaID: string, postID: string) {
    this.router.navigateByUrl('/areas/' + areaID + '/' + postID);
  }
}
