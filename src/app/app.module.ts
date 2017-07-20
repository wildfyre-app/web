import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {MdButtonModule, MdCheckboxModule, MdTabsModule, MdCardModule,
  MdMenuModule, MdInputModule, MdListModule, MdSlideToggleModule} from '@angular/material';
import 'hammerjs';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { AuthGuard } from './_guards/index';
import { AuthenticationService, HttpService, AreaService, PostService,
  ProfileService, RegistrationService, NotificationService, NavBarService } from './_services/index';
import { LoginComponent } from './login/index';
import { HomeComponent } from './home/index';
import { ProfileComponent } from './profile/index';
import { CreatePostComponent } from './createPost/index';
import { UserPostsComponent } from './userPosts/index';
import { RegisterComponent } from './register/index';
import { NotificationComponent } from './notification/index';
import { NavBarComponent } from './navBar/index';
import { PostViewComponent } from './postView/index';
import { ReCaptchaModule } from 'angular2-recaptcha';
import { MaterialModule } from '@angular/material';
import { Component404Component } from './404component/index';
import { RegisterSuccessComponent } from './registerSuccess/index';
import { ProfileViewComponent } from './profileView/index';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing,
        MaterialModule,
        [BrowserAnimationsModule],
        [MdButtonModule, MdCheckboxModule],
        [MdTabsModule],
        [MdCardModule],
        [MdMenuModule],
        [MdInputModule],
        [MdListModule],
        [MdSlideToggleModule],
        [ReCaptchaModule]
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        ProfileComponent,
        CreatePostComponent,
        UserPostsComponent,
        RegisterComponent,
        NotificationComponent,
        NavBarComponent,
        PostViewComponent,
        Component404Component,
        RegisterSuccessComponent,
        ProfileViewComponent
    ],
    providers: [
        AuthenticationService,
        HttpService,
        AuthGuard,
        AreaService,
        PostService,
        ProfileService,
        RegistrationService,
        NotificationService,
        NavBarService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
