import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Response, ResponseOptions, ResponseOptionsArgs } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Auth} from '../_models/auth';
import { AuthenticationService } from '../_services/authentication.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
    let comp: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    beforeEach(() => {
        const routerStub = {
            navigate: () => ({})
        };
        const authenticationServiceStub = {
            logout: () => ({}),
            login: () => ({
                subscribe: () => {
                  return Observable.of(Auth.parse(new Response(new ResponseOptions({
                    body: JSON.stringify({name: 'Bob', surname : 'Jones'})
                  }))));
                }
            })
        };
        TestBed.configureTestingModule({
            declarations: [ LoginComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: routerStub },
                { provide: AuthenticationService, useValue: authenticationServiceStub }
            ],
            imports: [ FormsModule ]
        });
        fixture = TestBed.createComponent(LoginComponent);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    it('loading defaults to: false', () => {
        expect(comp.loading).toEqual(false);
    });

    describe('ngOnInit', () => {
        it('makes expected calls', () => {
            const authenticationServiceStub = fixture.debugElement.injector.get(AuthenticationService);
            spyOn(authenticationServiceStub, 'logout');
            comp.ngOnInit();
            expect(authenticationServiceStub.logout).toHaveBeenCalled();
        });
    });

    it('should create', inject([AuthenticationService], (authenticationService: AuthenticationService) => {
      spyOn(authenticationService, 'login').and.returnValue({subscribe: () => {}});
      expect(comp).toBeTruthy();
    }));

});
