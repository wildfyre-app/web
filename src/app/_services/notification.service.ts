import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { HttpService } from './index';
import { Notification } from '../_models/index';

@Injectable()
export class NotificationService {
  constructor(
    private httpService: HttpService
  ) { }

  getNotifications(): Observable<Notification[]> {
    // get notifications from api
    return this.httpService.GET('/areas/notification/')
      .map((response: Response) => response.json());
  }
}
