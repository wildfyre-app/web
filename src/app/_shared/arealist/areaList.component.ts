import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Area } from '../../_models/area';
import { AreaService } from '../../_services/area.service';
import { NavBarService } from '../../_services/navBar.service';
import { PostService } from '../../_services/post.service';
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
    private postService: PostService,
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
            this.findImages(area);

            this.loading = false;
        });
      }
  }

  findImages(area: Area) {
    this.postService.getNextPost(area.name).pipe(
      takeUntil(this.componentDestroyed)
    ).subscribe(() => {
      this.postService.getAllPosts(area.name).pipe(
        takeUntil(this.componentDestroyed)
      ).subscribe(results => {
        if (document.getElementById(area.name) !== null) {
          for (let j = 0; j < results.length; j++) {
            if (results[j].image !== '') {
              document.getElementById(area.name).style.background = `url(${results[j].image})`;
              document.getElementById(area.name).style.backgroundPosition = 'center';
              document.getElementById(area.name).style.backgroundRepeat = 'no-repeat';
              document.getElementById(area.name).style.backgroundSize = 'cover';
              (document.querySelectorAll(`#${area.name} div`)[0] as HTMLElement).style.width = '100%';
              (document.querySelectorAll(`#${area.name} div`)[0] as HTMLElement).style.height = '100%';
              (document.querySelectorAll(`#${area.name} div`)[0] as HTMLElement).style.display = 'flex';
              (document.querySelectorAll(`#${area.name} div`)[0] as HTMLElement).style.justifyContent = 'center';
              // (document.querySelectorAll(`#${area.name} div`)[0] as HTMLElement).style.placeContent = 'center';
              (document.querySelectorAll(`#${area.name} div`)[0] as HTMLElement).style.alignItems = 'center';
              (document.querySelectorAll(`#${area.name} div`)[0] as HTMLElement).style.backgroundColor
                = 'rgba(0, 0, 0, 0.7)';
              break;
            }
            if (results[j].additional_images.length !== 0) {
              document.getElementById(area.name).style.background = `url(${results[j].additional_images[0].image})`;
              document.getElementById(area.name).style.backgroundPosition = 'center';
              document.getElementById(area.name).style.backgroundRepeat = 'no-repeat';
              document.getElementById(area.name).style.backgroundSize = 'cover';
              (document.querySelectorAll(`#${area.name} div`)[0] as HTMLElement).style.width = '100%';
              (document.querySelectorAll(`#${area.name} div`)[0] as HTMLElement).style.height = '100%';
              (document.querySelectorAll(`#${area.name} div`)[0] as HTMLElement).style.display = 'flex';
              (document.querySelectorAll(`#${area.name} div`)[0] as HTMLElement).style.justifyContent = 'center';
          //     (document.querySelectorAll(`#${area.name} div`)[0] as HTMLElement).style.placeContent = 'center';
              (document.querySelectorAll(`#${area.name} div`)[0] as HTMLElement).style.alignItems = 'center';
              (document.querySelectorAll(`#${area.name} div`)[0] as HTMLElement).style.backgroundColor
                = 'rgba(0, 0, 0, 0.7)';
              break;
            }
          }
        }
      });
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
