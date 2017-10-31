import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: 'navBar.component.html'
})
export class NavBarComponent implements OnInit {
  activeLinkIndex = 2;
  mobileRouteLinks: any[];
  routeLinks: any[];
  style: string;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    router.events.subscribe((url: any) => {
      if (this.authenticationService.token) {
        this.style = '';
      } else {
        this.style = 'none';
      }
      this.setActiveIndex(url.url);
    });

    this.routeLinks = [
      {label: 'Profile', link: '/profile/', index: '0'},
      {label: 'Notifications', link: '/notifications/', index: '1'},
      {label: 'Home', link: '/', index: '2'},
      {label: 'My Posts', link: '/posts/', index: '3'},
      {label: 'Create a Post', link: '/create/', index: '4'}
    ];

    this.mobileRouteLinks = [
      {label: '<i class="material-icons">perm_identity</i>', link: '/profile/', index: '0'},
      {label: '<i class="material-icons">notifications_none</i>', link: '/notifications/', index: '1'},
      {label: '<i class="material-icons">home</i>', link: '/', index: '2'},
      {label: '<i class="material-icons">content_copy</i>', link: '/posts/', index: '3'},
      {label: '<i class="material-icons">create</i>', link: '/create/', index: '4'}
    ];
  }

  ngOnInit() {
    if (this.authenticationService.token) {
      this.style = '';
    } else {
      this.style = 'none';
    }
  }

  setActiveIndex(s: string) {
    if (s === '/profile') {
      this.activeLinkIndex = 0;
    } else if (s === '/notifications') {
      this.activeLinkIndex = 1;
    } else if (s === '/') {
      this.activeLinkIndex = 2;
    } else if (s === '/posts') {
      this.activeLinkIndex = 3;
    } else if (s === '/create') {
      this.activeLinkIndex = 4;
    }
  }
}
