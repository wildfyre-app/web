import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, DoCheck } from '@angular/core';
import { MatSidenav, MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Area } from '../_models/area';
import { CommentData } from '../_models/commentData';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: 'navBar.component.html',
  styleUrls: ['./navBar.component.scss']
})
export class NavBarComponent implements OnInit, OnDestroy, DoCheck {
  @ViewChild('sidenav', {static: true}) sidenav: MatSidenav;

  activeLinkIndex = 1;
  areas = new Array<Area>(new Area('', '', 0, 0));
  areaReputation: { [area: string]: number; } = { };
  areaSpread: { [area: string]: number; } = { };
  areaVisible = true;
  comment: CommentData = new CommentData('', null);
  commentDisabled = false;
  componentDestroyed: Subject<boolean> = new Subject();
  currentArea: Area = this.areas[0];
  expanded = false;
  hasPost = false;
  heightText: string;
  loggedIn = false;
  mobileRouteLinks: any[];
  notificationLength = 0;
  routeLinks: any[];
  rowsExapanded = 2;
  styleBottomEditor: string;
  styleBottomSend: string;
  styleBottomTextarea: string;
  styleDesktop: string;
  styleHeightEditor: string;
  styleHeightSend: string;
  styleHeightTextarea: string;
  styleMobile: string;
  stylePage: boolean;
  width: string;

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    public snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    if (this.authenticationService.token) {
      this.setActiveIndex(this.router.url);
      this.loggedIn = true;
    } else {
      this.activeLinkIndex = -1;
    }
  }

  ngDoCheck()	{
    this.setActiveIndex(this.router.url);
  }


  ngOnDestroy() {
    this.cdRef.detach();
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }

  getNotificationLength(nLength: number) {
    if (nLength.toString().length === 4) {
      return nLength.toString().slice(0, 1) + 'K';
    } else if (nLength.toString().length === 5) {
      return nLength.toString().slice(0, 2) + 'K';
    } else if (nLength.toString().length >= 6) {
      return '\u221E';
    } else {
      return nLength.toString();
    }
  }

  setActiveIndex(s: string) {
    this.width = '100%';
    if (s === undefined) {
      s = '/';
    }
    if (s === '/profile') {
      this.stylePage = false;
      this.activeLinkIndex = 4;
    } else if (s === '/notifications/archive') {
      this.stylePage = false;
      this.activeLinkIndex = 2;
    } else if (s.lastIndexOf('/notifications/archive/') !== -1) {
      this.stylePage = false;
      this.activeLinkIndex = 2;
    } else if (s === '/notifications') {
      this.activeLinkIndex = 2;
    } else if (s.lastIndexOf('/notifications/') !== -1) {
      this.activeLinkIndex = 2;
    } else if (s === '/') {
      this.activeLinkIndex = 1;
    } else if (s === '/posts') {
      this.activeLinkIndex = 3;
    } else if (s.lastIndexOf('/posts/') !== -1) {
      this.activeLinkIndex = 3;
    } else if (s === '/create') {
      this.activeLinkIndex = -1;
    } else if (s.lastIndexOf('/create/') !== -1) {
      this.activeLinkIndex = -1;
    } else if (s === '/drafts') {
      this.activeLinkIndex = -1;
    } else if (s.lastIndexOf('/areas/') !== -1) {
      this.activeLinkIndex = -1;
    } else if (s.lastIndexOf('/user/') !== -1) {
      this.activeLinkIndex = -1;
    } else if (s.lastIndexOf('/login') !== -1) {
      this.activeLinkIndex = -1;
    }
    this.cdRef.detectChanges();
  }

  switchRoute(s: string) {
    if (s === 'home') {
      this.router.navigateByUrl('/');
    } else if (s === 'profile') {
      this.router.navigateByUrl('/profile');
    } else if (s === 'notifications') {
      this.router.navigateByUrl('/notifications');
    } else if (s === 'my-posts') {
      this.router.navigateByUrl('/posts');
    }
  }
}
