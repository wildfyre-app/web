import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { HttpService } from './index';

@Injectable()
export class NavBarService {
  public activeIndex = 2 ;

  public constructor() { }

  setActiveIndex(s: string) {
    if (s === '/profile') {
    this.activeIndex = 0;
  } else if (s === '/notifications') {
    this.activeIndex = 1;
  } else if (s === '/') {
    this.activeIndex = 2;
  } else if (s === '/cards') {
    this.activeIndex = 3;
  } else if (s === '/post') {

    this.activeIndex = 4;
  }
  }
  getActiveIndex(): number {
    return this.activeIndex;
  }
}
