import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class NavBarService {
  isVisibleSource: BehaviorSubject<string> = new BehaviorSubject('');

  public constructor() { }
}
