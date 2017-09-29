import { Component } from '@angular/core';
import { Angulartics2Piwik } from 'angulartics2';

@Component({
  selector: 'app-component',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    angulartics2Piwik: Angulartics2Piwik
  ) { }
}
