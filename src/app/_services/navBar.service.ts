import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Notification } from '../_models/notification';

@Injectable()
export class NavBarService {
  isVisibleSource: BehaviorSubject<string> = new BehaviorSubject('');
  notifications: BehaviorSubject<Notification[]> = new BehaviorSubject([]);

  public constructor() { }
}
