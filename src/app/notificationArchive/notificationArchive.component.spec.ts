import { By } from '@angular/platform-browser';
import { ComponentFixture,  ComponentFixtureAutoDetect, TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { MdCardModule, MdTabsModule, MdSlideToggleModule } from '@angular/material';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Author } from '../_models/author';
import { Comment } from '../_models/comment';
import { Notification } from '../_models/notification';
import { Post } from '../_models/post';
import { MarkedPipe } from '../_pipes/marked.pipe';
import { AreaService } from '../_services/area.service';
import { AuthenticationService } from '../_services/authentication.service';
import { NotificationService } from '../_services/notification.service';
import { RouteService } from '../_services/route.service';
import { NotificationArchiveComponent } from './notificationArchive.component';
import { MasonryModule } from 'angular2-masonry';
import { NgxPaginationModule } from 'ngx-pagination';

describe('NotificationArchiveComponent', () => {
    let comp: NotificationArchiveComponent;
    let fixture: ComponentFixture<NotificationArchiveComponent>;

    beforeEach(() => {
        const routerStub = {
          url: '/notifications'
        };
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
        const activatedRouteStub = {
          params: Observable.of({'id': 1})
        };
        const notificationServiceStub = {
            getNotifications: () => {
              return Observable.of(
                new Array<Notification>(
                  new Notification('fun',
                    new Post(1,
                      new Author(1, 'test', null, 'test', false), false, '2017-07-22T12:03:23.465373Z', false, 'test',
                        new Array<Comment>(
                          new Comment(1,
                            new Author(1, 'test', null, 'test', false), '2017-07-22T12:03:23.465373Z', 'test'))),
                              new Array<number>(1, 2)))
              );
            }
        };
        const routeServiceStub = {};

        TestBed.configureTestingModule({
            declarations: [ NotificationArchiveComponent, MarkedPipe ],
            providers: [
                { provide: Router, useValue: routerStub },
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: AreaService, useValue: areaServiceStub },
                { provide: AuthenticationService, useValue: authenticationServiceStub },
                { provide: NotificationService, useValue: notificationServiceStub },
                { provide: RouteService, useValue: routeServiceStub },
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ],
            imports: [ MdCardModule, RouterModule, MdTabsModule, MdSlideToggleModule, FormsModule, MasonryModule, NgxPaginationModule ],
        }).compileComponents();
        fixture = TestBed.createComponent(NotificationArchiveComponent);
        comp = fixture.componentInstance;
    });

    it('should set notification text', async(() => {
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('.notifications')).nativeElement.textContent).toBe('test');
      });
    }));
});
