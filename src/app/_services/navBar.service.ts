import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AreaList } from '../_models/areaList';
import { CommentData } from '../_models/commentData';
import { Link } from '../_models/link';

@Injectable()
export class NavBarService {
  areaVisible: BehaviorSubject<boolean> = new BehaviorSubject(false);
  clearInputs: BehaviorSubject<boolean> = new BehaviorSubject(false);
  comment: BehaviorSubject<CommentData> = new BehaviorSubject(new CommentData('', null));
  currentArea: BehaviorSubject<AreaList> = new BehaviorSubject(new AreaList('fun', 0, 0));
  isVisibleSource: BehaviorSubject<string> = new BehaviorSubject('');
  link: BehaviorSubject<Link> = new BehaviorSubject(new Link('', '', ''));
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  notifications: BehaviorSubject<number> = new BehaviorSubject(0);

  public constructor() { }
}
