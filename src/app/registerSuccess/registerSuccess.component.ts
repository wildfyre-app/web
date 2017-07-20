import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, RegistrationService } from '../_services/index';

@Component({
  templateUrl: 'registerSuccess.component.html'
})
export class RegisterSuccessComponent implements OnInit {
  loading: boolean;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private registrationService: RegistrationService
  ) { }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();
    document.getElementById('navB').style.display = 'none';
  }
  letsGo() {
    this.router.navigate(['/login']);
  }
}
