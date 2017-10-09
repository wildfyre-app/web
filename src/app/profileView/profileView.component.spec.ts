import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Observable } from 'rxjs';

import { ProfileViewComponent } from './profileView.component';

import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { ProfileService } from '../_services/profile.service';
import { RouteService } from '../_services/route.service';

import { MdCardModule } from '@angular/material';
import { MarkedPipe } from '../_pipes/marked.pipe';

import { Author } from '../_models/author';

describe('ProfileViewComponent', () => {
  let comp: ProfileViewComponent;
  let fixture: ComponentFixture<ProfileViewComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(() => {
    // stubs
    let activatedRouteStub = {
      params: Observable.of({'id': 1})
    };
    let routerStub = {}
    let authenticationServiceStub = {
      token: "token"
    };
    let profileServiceStub = {
      getUser: (id: number) => {
        if (id != 1) {
          throw new Error("Requests for users other than with Id 1 not implemented");
        }

        return Observable.of(
          new Author(1, "Test User", null, null, false)
        );
      }
    };


    let routeServiceStub = {}

    TestBed.configureTestingModule({
      declarations: [ ProfileViewComponent, MarkedPipe ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: routerStub },
        { provide: AuthenticationService, useValue: authenticationServiceStub },
        { provide: ProfileService, useValue: profileServiceStub },
        { provide: RouteService, useValue: routeServiceStub },
      ],
      imports: [ MdCardModule ],
    });

    fixture = TestBed.createComponent(ProfileViewComponent);
    comp = fixture.componentInstance;

    de = fixture.debugElement.query(By.css('h2'));
    el = de.nativeElement;
  });

  it('should set the autor name', async(() => {
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      expect(el.textContent).toBe("Test User");
    })
  }))
});