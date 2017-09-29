import { Injectable } from '@angular/core';

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
    } else if (s === '/posts') {
      this.activeIndex = 3;
    } else if (s === '/create') {
      this.activeIndex = 4;
    }
  }

  getActiveIndex(): number {
    return this.activeIndex;
  }
}
