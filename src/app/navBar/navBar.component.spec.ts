import { APP_BASE_HREF } from '@angular/common';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed , async} from '@angular/core/testing';
import { Router, ActivatedRoute, RouterModule, Routes, UrlTree } from '@angular/router';
import { MdTabsModule, MdDialogModule, MdSidenavModule, MdOptionModule, MdSnackBarModule } from '@angular/material';
import { Observable } from 'rxjs';
import { Author } from '../_models/author';
import { Comment } from '../_models/comment';
import { Notification } from '../_models/notification';
import { NotificationPost } from '../_models/notificationPost';
import { Post } from '../_models/post';
import { SuperNotification } from '../_models/superNotification';
import { NavBarComponent } from './navBar.component';
import { AreaService } from '../_services/area.service';
import { AuthenticationService } from '../_services/authentication.service';
import { NavBarService } from '../_services/navBar.service';
import { NotificationService } from '../_services/notification.service';

describe('NavBarComponent', () => {
    let comp: NavBarComponent;
    let fixture: ComponentFixture<NavBarComponent>;

    beforeEach(() => {
        const changeDetectorRefStub = {
            detectChanges: () => ({})
        };
        const routes: Routes = [
            {
              path: '',
              component: NavBarComponent,
            }
        ];
        const authenticationServiceStub = {
          token: 'token'
        };
        const areaServiceStub = {
            isAreaChecked: {},
            currentAreaName: {},
            getAreaRep: () => ({
                subscribe: () => ({})
            })
        };
        const routerStub = {
            events: Observable.of(''),
            createUrlTree: () => {
              return ({});
            },
            serializeUrl: () => {
              return '';
            }
        };
        const activatedRouteStub = {
          params: Observable.of({'id': 1})
        };
        const navBarServiceStub = {
          notifications: new BehaviorSubject([])
        };
        const notificationServiceStub = {
            getSuperNotification: () => {
              return Observable.of(
                new SuperNotification(1, '', '',
                  new Array<Notification>(
                    new Notification('', 
                      new NotificationPost(0, 
                        new Author(0, '', '', '', false), 'test'), 
                          new Array<number>(0)))
              ));
            }
        };
        TestBed.configureTestingModule({
            declarations: [ NavBarComponent ],
            providers: [
                { provide: ChangeDetectorRef, useValue: changeDetectorRefStub },
                { provide: Router, useValue: routerStub },
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: APP_BASE_HREF, useValue: '' },
                { provide: AreaService, useValue: areaServiceStub },
                { provide: AuthenticationService, useValue: authenticationServiceStub },
                { provide: NavBarService, useValue: navBarServiceStub },
                { provide: NotificationService, useValue: notificationServiceStub },
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ],
            imports: [ MdTabsModule, MdOptionModule, FormsModule, MdSidenavModule, MdSnackBarModule, MdDialogModule, RouterModule.forRoot(routes) ],
        });
        fixture = TestBed.createComponent(NavBarComponent);
        comp = fixture.componentInstance;
    });

    it('should set navBMobile', async(() => {
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#navBMobile')).nativeElement.style.display).toBe('');
      });
    }));

    it('should set navB', async(() => {
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#navB')).nativeElement.style.display).toBe('');
      });
    }));

});
