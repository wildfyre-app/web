import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Angulartics2Module, Angulartics2Piwik } from 'angulartics2';
import {MdButtonModule, MdCheckboxModule, MdTabsModule, MdCardModule,
  MdMenuModule, MdInputModule, MdListModule, MdSlideToggleModule} from '@angular/material';
import 'hammerjs';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { AuthGuard } from './_guards';
import { AuthenticationService, HttpService, AreaService, PostService,
  ProfileService, RegistrationService, NotificationService, NavBarService, CommentService } from './_services';
import { LoginComponent } from './login';
import { HomeComponent } from './home';
import { ProfileComponent } from './profile';
import { CreatePostComponent } from './createPost';
import { UserPostsComponent } from './userPosts';
import { RegisterComponent } from './register';
import { NotificationComponent } from './notification';
import { NavBarComponent } from './navBar';
import { PostViewComponent } from './postView';
import { ReCaptchaModule } from 'angular2-recaptcha';
import { MaterialModule } from '@angular/material';
import { Component404Component } from './404component';
import { RegisterSuccessComponent } from './registerSuccess';
import { ProfileViewComponent } from './profileView';
import { ClipboardModule } from 'ngx-clipboard';
import { MarkdownModule } from 'angular2-markdown';

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
        [ReCaptchaModule],
        [ClipboardModule],

        MarkdownModule.forRoot(),
        Angulartics2Module.forRoot([ Angulartics2Piwik ])
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
        NavBarService,
        CommentService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
