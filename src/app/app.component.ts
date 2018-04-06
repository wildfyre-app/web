import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
    private cdRef: ChangeDetectorRef,
    private areaService: AreaService,
    angulartics2Piwik: Angulartics2Piwik
  ) {
    this.areaService.getAreas()
      .takeUntil(this.componentDestroyed)
      .subscribe(result => {
        this.loading = false;
        this.cdRef.detectChanges();
      });
  }

  ngOnDestroy() {
    this.cdRef.detach();
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }
}
