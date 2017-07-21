import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AreaService, NavBarService } from '../_services/index';

@Component({
  selector: 'app-nav-bar',
  templateUrl: 'navBar.component.html'
})
export class NavBarComponent {
  routeLinks: any[];
  activeLinkIndex = this.navBarService.getActiveIndex(); ;
  visible = true;

  constructor(
    private router: Router,
    private areaService: AreaService,
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
  }
}
