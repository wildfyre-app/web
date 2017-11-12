import { By } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdMenuModule, MdSlideToggleModule } from '@angular/material';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Author } from '../_models/author';
import { Comment } from '../_models/comment';
import { Post } from '../_models/post';
import { MarkedPipe } from '../_pipes/marked.pipe';
import { AreaService } from '../_services/area.service';
import { CommentService } from '../_services/comment.service';
import { FlagService } from '../_services/flag.service';
import { PostService } from '../_services/post.service';
import { ProfileService } from '../_services/profile.service';
import { RouteService } from '../_services/route.service';
import { HomeComponent } from './home.component';
import { ClipboardModule } from 'ngx-clipboard';

describe('HomeComponent', () => {
    let comp: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(() => {
        const changeDetectorRefStub = {
            detectChanges: () => ({})
        };
        const routerStub = {
          url: '/'
        };
        const activatedRouteStub = {
          params: Observable.of({'id': 1})
        };
        const commentStub = {};
        const postStub = {};
        const areaServiceStub = {
            isAreaChecked: {},
            currentAreaName: {},
            getAreaRep: () => ({
                subscribe: () => ({})
            })
        };
        const commentServiceStub = {
            deleteComment: () => ({})
        };
        const flagServiceStub = {
            currentComment: {},
            currentPost: {},
            openDialog: () => ({})
        };
        const postServiceStub = {
            getNextPost: () => {
              return Observable.of(
                new Post(1,
                  new Author(1, 'test', null, 'test', false), false, '2017-07-22T12:03:23.465373Z', false, 'test',
                    new Array<Comment>(
                      new Comment(1,
                        new Author(1, 'test', null, 'test', false), '2017-07-22T12:03:23.465373Z', 'test')))
                      );
            },
            comment: () => ({
                subscribe: () => ({})
            }),
            spread: () => ({}),
            subscribe: () => ({
                subscribe: () => ({})
            })
        };
        const profileServiceStub = {
            getSelf: () => ({
                subscribe: () => ({})
            })
        };
        const routeServiceStub = {
            addNextRoute: () => ({})
        };
        TestBed.configureTestingModule({
            declarations: [ HomeComponent, MarkedPipe ],
            providers: [
                { provide: ChangeDetectorRef, useValue: changeDetectorRefStub },
                { provide: Router, useValue: routerStub },
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: Comment, useValue: commentStub },
                { provide: Post, useValue: postStub },
                { provide: AreaService, useValue: areaServiceStub },
                { provide: CommentService, useValue: commentServiceStub },
                { provide: FlagService, useValue: flagServiceStub },
                { provide: PostService, useValue: postServiceStub },
                { provide: ProfileService, useValue: profileServiceStub },
                { provide: RouteService, useValue: routeServiceStub },
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ],
            imports: [ MdMenuModule, FormsModule, ClipboardModule, MdSlideToggleModule ]
        });
        fixture = TestBed.createComponent(HomeComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement.query(By.css('.mainText'));
        el = de.nativeElement;
    });

    it('should set post text', async(() => {
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(el.textContent).toBe('test\n');
      });
    }));

    it('should set comment text', async(() => {
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('.commentText')).nativeElement.textContent).toBe('test\n');
      });
    }));

});
