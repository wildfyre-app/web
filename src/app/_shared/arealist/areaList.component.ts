import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Area } from '../../_models/area';
import { AreaService } from '../../_services/area.service';
import { NavBarService } from '../../_services/navBar.service';
import { RouteService } from '../../_services/route.service';

enum View {
  home,
  posts,
  archive
}

@Component({
  templateUrl: 'areaList.component.html',
  styleUrls: ['./areaList.component.scss'],
  selector: 'app-area-list'
})
export class AreaListComponent implements OnInit, OnDestroy {
  @Input() public showAdd = true;
  allArea = new Area('_', 'All Posts', 0, 0);
  areas: Array<Area> = [];
  currentView: View = View.home;
  componentDestroyed: Subject<boolean> = new Subject();
  loading = true;
  title = 'Home';
  path = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private areaService: AreaService,
    private navBarService: NavBarService,
    private routeService: RouteService
  ) { }

  ngOnInit() {
    if (this.router.url === '/posts') {
      this.path = this.router.url;
      this.title = 'My Posts';
      this.currentView = View.posts;
    } else if (this.router.url === '/notification/archive') {
      this.path = this.router.url;
      this.title = 'My Notification Archive';
      this.currentView = View.archive;
    }
      const areas = this.route.snapshot.data.areas;

      for (let i = 0; i < areas.length; i++) {
        this.areaService.getAreaRep(areas[i].name).pipe(
          takeUntil(this.componentDestroyed))
          .subscribe(result => {
            const area = new Area(
              areas[i].name,
              areas[i].displayname,
              result.reputation,
              result.spread
            );

            this.areas.push(area);
            this.loading = false;
        });
      }
  }

  ngOnDestroy() {
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }

  goto(a: Area, createPost?: boolean) {
    this.navBarService.currentArea.next(a);
    this.routeService.addNextRoute(this.path);
    if (createPost) {
      this.router.navigateByUrl(`create/${a.name}`);
    } else if (this.currentView === View.home) {
      this.router.navigateByUrl(`/areas/${a.name}`);
    } else if (this.currentView === View.archive) {
      this.router.navigateByUrl(`${this.path}/${a.name}/1`);
    } else {
      this.router.navigateByUrl(`${this.path}/${a.name}`);
    }
  }

  view() {
    return View;
  }
}
