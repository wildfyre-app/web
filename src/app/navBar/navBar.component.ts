import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavBarService } from '../_services/navBar.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: 'navBar.component.html'
})
export class NavBarComponent {
  routeLinks: any[];
  mobileRouteLinks: any[];
  activeLinkIndex = this.navBarService.getActiveIndex(); ;
  visible = true;

  constructor(
    private router: Router,
    private navBarService: NavBarService
  ) {
    router.events.subscribe((url: any) => {
      this.navBarService.setActiveIndex(url.url);
      this.activeLinkIndex = this.navBarService.getActiveIndex();
    });

    this.routeLinks = [
      {label: 'Profile', link: '/profile/', index: '0'},
      {label: 'Notifications', link: '/notifications/', index: '1'},
      {label: 'Home', link: '', index: '2'},
      {label: 'My Posts', link: '/posts/', index: '3'},
      {label: 'Create a Post', link: '/create/', index: '4'}
    ];

    this.mobileRouteLinks = [
      {label: '<i class="material-icons">perm_identity</i>', link: '/profile/', index: '0'},
      {label: '<i class="material-icons">notifications_none</i>', link: '/notifications/', index: '1'},
      {label: '<i class="material-icons">home</i>', link: '', index: '2'},
      {label: '<i class="material-icons">content_copy</i>', link: '/posts/', index: '3'},
      {label: '<i class="material-icons">create</i>', link: '/create/', index: '4'}
    ];
  }
}
