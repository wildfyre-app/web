import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  templateUrl: 'registerSuccess.component.html'
})
export class RegisterSuccessComponent implements OnInit {
  loading: boolean;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) { }

  ngOnInit() {
    // Reset login status
    this.authenticationService.logout();
    document.getElementById('navB').style.display = 'none';
    document.getElementById('navBMobile').style.display = 'none';
  }

  letsGo() {
    this.router.navigate(['/login']);
  }
}
