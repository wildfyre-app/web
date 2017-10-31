import { APP_BASE_HREF } from '@angular/common';
import { By } from '@angular/platform-browser';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed , async} from '@angular/core/testing';
import { Router, ActivatedRoute, RouterModule, Routes, UrlTree } from '@angular/router';
import { MdTabsModule } from '@angular/material';
import { Observable } from 'rxjs';
import { NavBarComponent } from './navBar.component';
import { AuthenticationService } from '../_services/authentication.service';

describe('NavBarComponent', () => {
    let comp: NavBarComponent;
    let fixture: ComponentFixture<NavBarComponent>;

    beforeEach(() => {
        const routes: Routes = [
            {
              path: '',
              component: NavBarComponent,
            }
        ];
        const authenticationServiceStub = {
          token: "token"
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
        TestBed.configureTestingModule({
            declarations: [ NavBarComponent ],
            providers: [
                { provide: Router, useValue: routerStub },
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: APP_BASE_HREF, useValue: '' },
                { provide: AuthenticationService, useValue: authenticationServiceStub },
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ],
            imports: [ MdTabsModule, MdTabsModule, RouterModule.forRoot(routes) ],
        });
        fixture = TestBed.createComponent(NavBarComponent);
        comp = fixture.componentInstance;
    });

    it('should set navBMobile', async(() => {
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#navBMobile')).nativeElement.style.display).toBe("");
      })
    }))

    it('should set navB', async(() => {
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#navB')).nativeElement.style.display).toBe("");
      })
    }))

});
