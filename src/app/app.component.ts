import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { AreaService } from './_services/area.service';
import { AuthenticationService } from './_services/authentication.service';
import { NavBarService } from './_services/navBar.service';
import { Angulartics2Piwik } from 'angulartics2';

@Component({
  selector: 'app-component',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnDestroy {
  componentDestroyed: Subject<boolean> = new Subject();
  loading = true;

  constructor(
    private cdRef: ChangeDetectorRef,
    private areaService: AreaService,
    private authenticationService: AuthenticationService,
    private navBarService: NavBarService,
    angulartics2Piwik: Angulartics2Piwik
  ) {
      if (this.authenticationService.token) {
        this.areaService.getAreas()
          .takeUntil(this.componentDestroyed)
          .subscribe(() => {
            this.loading = false;
            this.cdRef.detectChanges();
          });
      } else {
        this.navBarService.areaVisible.next(false);
        this.loading = false;
      }
  }

  ngOnDestroy() {
    this.cdRef.detach();
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }
}
