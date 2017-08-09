import { Component } from '@angular/core';

@Component({
  templateUrl: '404.component.html'
})
export class Component404Component {
  constructor() {
  document.getElementById('navB').style.display = 'none';
  document.getElementById('navBMobile').style.display = 'none';
  }

}
