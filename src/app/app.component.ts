import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { AreaService } from './_services/area.service';
import { Angulartics2Piwik } from 'angulartics2';

@Component({
  selector: 'app-component',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnDestroy {
  componentDestroyed: Subject<boolean> = new Subject();
  loading = true;

  constructor(
    angulartics2Piwik: Angulartics2Piwik,
    private areaService: AreaService
  ) {
    this.areaService.getAreas()
      .takeUntil(this.componentDestroyed)
      .subscribe(result => {
        this.loading = false;
      });
  }

  ngOnDestroy() {
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }
}
