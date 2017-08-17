import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { HttpService } from './http.service';
import { Notification } from '../_models/notification';

@Injectable()
export class NotificationService {
  constructor(
    private httpService: HttpService
  ) { }

  getNotifications(): Observable<Notification[]> {
    // get notifications from api
    return this.httpService.GET('/areas/notification/')
      .map((response: Response) => {
        const notifications: Notification[] = [];
        response.json().forEach((notification: any) => {
          notifications.push(Notification.parse(notification));
        });
        return notifications;
      });
  }
}
