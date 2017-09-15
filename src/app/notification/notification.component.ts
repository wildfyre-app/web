import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Notification } from '../_models/notification';
import { NotificationService } from '../_services/notification.service';
import { RouteService } from '../_services/route.service';

@Component({
  templateUrl: 'notification.component.html'
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];
  constructor(
    private notificationService: NotificationService,
    private routeService: RouteService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    document.getElementById('navB').style.display = '';
    document.getElementById('navBMobile').style.display = '';
    // get notifications from secure api end point
    this.notificationService.getNotifications()
      .subscribe(notification => {
        this.notifications = notification;
    });
  }

  goto(areaID: string, postID: string) {
    this.routeService.addNextRoute(this.router.url);
    this.router.navigateByUrl('/areas/' + areaID + '/' + postID);
  }
}
