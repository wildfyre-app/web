import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MdDialog, MdDialogRef, MdMenuModule, MdSlideToggleModule, MdSnackBarModule } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AreaService } from '../_services/area.service';
import { NavBarService } from '../_services/navBar.service';
import { PostService } from '../_services/post.service';
import { CreatePostComponent } from './createPost.component';
import { PictureDialogComponent } from './createPost.component';
import { YouTubeDialogComponent } from './createPost.component';
import { RouteService } from '../_services/route.service';
import { MarkedPipe } from '../_pipes/marked.pipe';

describe('CreatePostComponent', () => {
    let comp: CreatePostComponent;
    let fixture: ComponentFixture<CreatePostComponent>;

    beforeEach(() => {
        const mdDialogStub = {
            open: () => ({
                afterClosed: () => ({
                    subscribe: () => ({})
                })
            })
        };
        const routerStub = {
            navigate: () => ({})
        };
        const activatedRouteStub = {
          params: Observable.of({'id': 1})
        };
        const areaServiceStub = {
            isAreaChecked: {},
            currentAreaName: {}
        };
        const navBarServiceStub = {};
        const postServiceStub = {
            createPost: () => ({
                subscribe: () => {
                  return Observable.of('s');
                }
            })
        };
        const mdDialogRefStub = {
            close: () => {
              return 's';
            }
        };
        const routeServiceStub = {
            addNextRoute: () => ({})
        };
        TestBed.configureTestingModule({
            declarations: [ CreatePostComponent, PictureDialogComponent, YouTubeDialogComponent, MarkedPipe ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: MdDialog, useValue: mdDialogStub },
                { provide: Router, useValue: routerStub },
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: AreaService, useValue: areaServiceStub },
                { provide: NavBarService, useValue: navBarServiceStub },
                { provide: PostService, useValue: postServiceStub },
                { provide: MdDialogRef, useValue: mdDialogRefStub },
                { provide: RouteService, useValue: routeServiceStub }
            ],
            imports: [ MdMenuModule, MdSlideToggleModule, FormsModule, MdSnackBarModule ],
        });
        fixture = TestBed.createComponent(CreatePostComponent);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    it('should create', inject([PostService], (postService: PostService) => {
      spyOn(postService, 'createPost').and.returnValue({subscribe: () => {}});
      expect(comp).toBeTruthy();
    }));

});
describe('PictureDialogComponent', () => {
    let comp: PictureDialogComponent;
    let fixture: ComponentFixture<PictureDialogComponent>;

    beforeEach(() => {
        const mdDialogStub = {
            open: () => ({
                afterClosed: () => ({
                    subscribe: () => ({})
                })
            })
        };
        const routerStub = {
            navigate: () => ({})
        };
        const areaServiceStub = {
            isAreaChecked: {},
            currentAreaName: {}
        };
        const postServiceStub = {
            createPost: () => ({
                subscribe: () => ({})
            })
        };
        const mdDialogRefStub = {
            close: () => ({})
        };
        TestBed.configureTestingModule({
            declarations: [ CreatePostComponent, PictureDialogComponent, YouTubeDialogComponent, MarkedPipe ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: MdDialog, useValue: mdDialogStub },
                { provide: Router, useValue: routerStub },
                { provide: AreaService, useValue: areaServiceStub },
                { provide: PostService, useValue: postServiceStub },
                { provide: MdDialogRef, useValue: mdDialogRefStub }
            ],
            imports: [ MdMenuModule, FormsModule ]
        });
        fixture = TestBed.createComponent(PictureDialogComponent);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    describe('sendPictureInformation', () => {
        it('makes expected calls', () => {
            const mdDialogRefStub = fixture.debugElement.injector.get(MdDialogRef);
            spyOn(mdDialogRefStub, 'close');
            comp.sendPictureInformation();
            expect(mdDialogRefStub.close).toHaveBeenCalled();
        });
    });

});
describe('YouTubeDialogComponent', () => {
    let comp: YouTubeDialogComponent;
    let fixture: ComponentFixture<YouTubeDialogComponent>;

    beforeEach(() => {
        const mdDialogStub = {
            open: () => ({
                afterClosed: () => ({
                    subscribe: () => ({})
                })
            })
        };
        const routerStub = {
            navigate: () => ({})
        };
        const areaServiceStub = {
            isAreaChecked: {},
            currentAreaName: {}
        };
        const postServiceStub = {
            createPost: () => ({
                subscribe: () => ({})
            })
        };
        const mdDialogRefStub = {
            close: () => ({})
        };
        TestBed.configureTestingModule({
            declarations: [ CreatePostComponent, PictureDialogComponent, YouTubeDialogComponent, MarkedPipe ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: MdDialog, useValue: mdDialogStub },
                { provide: Router, useValue: routerStub },
                { provide: AreaService, useValue: areaServiceStub },
                { provide: PostService, useValue: postServiceStub },
                { provide: MdDialogRef, useValue: mdDialogRefStub }
            ],
            imports: [ MdMenuModule, FormsModule ]
        });
        fixture = TestBed.createComponent(YouTubeDialogComponent);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    describe('sendYouTubeInformation', () => {
        it('makes expected calls', () => {
            const mdDialogRefStub = fixture.debugElement.injector.get(MdDialogRef);
            spyOn(mdDialogRefStub, 'close');
            comp.sendYouTubeInformation();
            expect(mdDialogRefStub.close).toHaveBeenCalled();
        });
    });

});
