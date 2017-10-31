import { By } from '@angular/platform-browser';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, async } from '@angular/core/testing';
import { MdCardModule } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Author } from '../_models/author'
import { Comment } from '../_models/comment';
import { Post } from '../_models/post';
import { AuthenticationService } from '../_services/authentication.service';
import { PostService } from '../_services/post.service';
import { RouteService } from '../_services/route.service';
import { UserPostsComponent } from './userPosts.component';

describe('UserPostsComponent', () => {
    let comp: UserPostsComponent;
    let fixture: ComponentFixture<UserPostsComponent>;

    beforeEach(() => {
        const routerStub = {
          url: '/posts'
        };
        const authenticationServiceStub = {
            token: "token"
        };
        const postServiceStub = {
            getOwnPosts: () => {
                return Observable.of(
                  new Array<Post>(
                    new Post(1,
                      new Author(1, "test", null, "test", false), false, "2017-07-22T12:03:23.465373Z", false, "test",
                        new Array<Comment>(
                          new Comment(1,
                            new Author(1, "test", null, "test", false), "2017-07-22T12:03:23.465373Z", "test")))
                  )
                );
            }
        };
        const routeServiceStub = {};

        TestBed.configureTestingModule({
            declarations: [ UserPostsComponent ],
            providers: [
                { provide: Router, useValue: routerStub },
                { provide: AuthenticationService, useValue: authenticationServiceStub },
                { provide: PostService, useValue: postServiceStub },
                { provide: RouteService, useValue: routeServiceStub },
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ],
            imports: [ MdCardModule ],
        });
        fixture = TestBed.createComponent(UserPostsComponent);
        comp = fixture.componentInstance;
    });

    it('should set user posts', async(() => {
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('.funPosts')).nativeElement.textContent).toBe("test Sat Jul 22 2017 08:03:23 GMT-0400 (Eastern Daylight Time)");
      })
    }))

});
