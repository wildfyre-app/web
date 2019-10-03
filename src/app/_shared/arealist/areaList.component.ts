import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Area } from '../../_models/area';
import { AreaService } from '../../_services/area.service';
import { NavBarService } from '../../_services/navBar.service';
import { RouteService } from '../../_services/route.service';

enum View {
  home,
  posts
}

@Component({
  templateUrl: 'areaList.component.html',
  styleUrls: ['./areaList.component.scss'],
  selector: 'app-area-list'
})
export class AreaListComponent implements OnInit, OnDestroy {
  @Input() public showAdd = true;
  allArea = new Area('_', 'All Posts', 0, 0);
  areas = new Array<Area>(new Area('', '', 0, 0));
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
    this.route.url
      .subscribe(r => {
        if (r[0]) {
          if (r[0].path === 'posts') {
            this.path = r[0].path;
            this.title = 'My Posts';
            this.currentView = View.posts;
          }
        }
      });

    this.areaService.getAreas()
    .takeUntil(this.componentDestroyed)
    .subscribe(areas => {
      this.areas = [];

      for (let i = 0; i < areas.length; i++) {
        this.areaService.getAreaRep(areas[i].name)
          .takeUntil(this.componentDestroyed)
          .subscribe(result => {
            let area;
            area = new Area(
              areas[i].name,
              areas[i].displayname,
              result.reputation,
              result.spread
            );

            this.areas.push(area);
            this.loading = false;
        });
      }
    });
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
    } else {
      this.router.navigateByUrl(`${this.path}/${a.name}`);
    }
  }

  view() {
    return View;
  }
}
