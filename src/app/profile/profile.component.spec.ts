import { By } from '@angular/platform-browser';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { NgModel, NgForm } from '@angular/forms';
import { MarkedPipe } from '../_pipes/marked.pipe';
import { MdSnackBar, MdMenuModule, MdCardModule } from '@angular/material';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service';
import { ProfileService } from '../_services/profile.service';
import { ProfileComponent } from './profile.component';
import { Author } from '../_models/author';
import { Account } from '../_models/account';

describe('ProfileComponent', () => {
    let comp: ProfileComponent;
    let fixture: ComponentFixture<ProfileComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(() => {
        const mdSnackBarStub = {
            open: () => ({})
        };
        const routerStub = {};
        const activatedRouteStub = {
          params: Observable.of({'id': 1})
        };
        const authenticationServiceStub = {
          token: "token"
        };

        const profileServiceStub = {
          getUser: (id: number) => {
            if (id != 1) {
              throw new Error("Requests for users other than with Id 1 not implemented");
            }

            return Observable.of(
              new Author(1, "Test User", null, "test", false)
            );
          },
            getSelf: () => {
              return Observable.of(
                new Author(1, "Test User", null, "test", false)
              );
            },
            getAccount: () => {
              return Observable.of(
                new Account(1, "Test User", "test@test.com")
              );
            },
            setBio: () => ({
                subscribe: () => ({})
            }),
            setEmail: () => ({
                subscribe: () => ({})
            }),
            setPassword: () => ({
                subscribe: () => ({})
            })
        };
        TestBed.configureTestingModule({
            declarations: [ ProfileComponent, MarkedPipe, NgModel, NgForm ],
            providers: [
                { provide: MdSnackBar, useValue: mdSnackBarStub },
                { provide: Router, useValue: routerStub },
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: AuthenticationService, useValue: authenticationServiceStub },
                { provide: ProfileService, useValue: profileServiceStub },
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ],
            imports: [ MdMenuModule, MdCardModule ],
        });
        fixture = TestBed.createComponent(ProfileComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement.query(By.css('h2'));
        el = de.nativeElement;
    });

    it('should set the author name', async(() => {
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        expect(el.textContent).toBe("Test User");
      })
    }))

    it('should set bio', async(() => {
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        expect(fixture.debugElement.query(By.css('#bio')).nativeElement.textContent).toBe('test\n');
      })
    }))

    it('should set id', async(() => {
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        expect(fixture.debugElement.query(By.css('#userID')).nativeElement.textContent).toBe('ID: 1');
      })
    }))

    it('should set email', async(() => {
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#email')).nativeElement.textContent).toBe('test@test.com');
      })
    }))

});