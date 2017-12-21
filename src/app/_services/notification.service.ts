import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Notification } from '../_models/notification';
import { Post } from '../_models/post';
import { HttpService } from './http.service';
import { NavBarService } from '../_services/navBar.service';

@Injectable()
export class NotificationService {
  notifications: Notification[] = [];

  constructor(
    private httpService: HttpService,
    private navBarService: NavBarService
  ) { }

  deleteNotifications(): void {
    // get notifications from api
    this.httpService.DELETE('/areas/notification/')
      .subscribe();
      this.notifications = [];
  }

  getArchive(area: string): Observable<Post[]> {
    return this.httpService.GET('/areas/' + area + '/subscribed/')
      .map((response: Response) => {
        const posts: Post[] = [];
        response.json().forEach((post: any) => {
          posts.push(Post.parse(post));
        });
        posts.sort((a: Post, b: Post) => {
          return b.created.getTime() - a.created.getTime();
        });
        return posts;
      });
  }

  getNotificationLength() {
    if (this.notifications.length === 0) {
      this.getNotifications()
        .subscribe(notifications => {
          return this.notifications.length;
        });
    } else {
      return this.notifications.length;
    }
  }

  getNotifications(): Observable<Notification[]> {
    // get notifications from api
    if (this.notifications.length === 0) {
    return this.httpService.GET('/areas/notification/')
      .map((response: Response) => {
        const notifications: Notification[] = [];
        response.json().forEach((notification: any) => {
          notifications.push(Notification.parse(notification));
        });
        this.notifications = notifications;
        return notifications;
      });
    } else {
      return Observable.of(this.notifications);
    }
  }

  removeNotification(index: number): Observable<Notification[]> {
    this.notifications.splice(index, 1);
    return Observable.of(this.notifications);
  }
}
