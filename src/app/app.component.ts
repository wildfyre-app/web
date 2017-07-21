import { Angulartics2Piwik } from 'angulartics2';
﻿import { Component } from '@angular/core';


@Component({
  selector: 'app-component',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    angulartics2Piwik: Angulartics2Piwik
  ) { }
}
