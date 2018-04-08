import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AreaList } from '../_models/areaList';
import { Notification } from '../_models/notification';

@Injectable()
export class NavBarService {
  areaVisible: BehaviorSubject<boolean> = new BehaviorSubject(true);
  currentArea: BehaviorSubject<AreaList> = new BehaviorSubject(new AreaList('fun', 0, 0));
  isVisibleSource: BehaviorSubject<string> = new BehaviorSubject('');
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  notifications: BehaviorSubject<number> = new BehaviorSubject(0);

  public constructor() { }
}
