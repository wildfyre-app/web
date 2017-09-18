import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Angulartics2Module, Angulartics2Piwik } from 'angulartics2';
import {MdButtonModule, MdCheckboxModule, MdTabsModule, MdCardModule,
  MdMenuModule, MdInputModule, MdListModule, MdSlideToggleModule, MdDialogModule, MdRadioModule} from '@angular/material';
import 'hammerjs';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { AuthGuard } from './_guards';
import { ReasonService } from './_services/reason.service';
import { AuthenticationService } from './_services/authentication.service';
import { HttpService } from './_services/http.service';
import { AreaService } from './_services/area.service';
import { CommentService } from './_services/comment.service';
import { FlagService, FlagDialogComponent } from './_services/flag.service';
import { NavBarService } from './_services/navBar.service';
import { NotificationService } from './_services/notification.service';
import { PostService } from './_services/post.service';
import { ProfileService } from './_services/profile.service';
import { RegistrationService } from './_services/registration.service';
import { RouteService } from './_services/route.service';
import { LoginComponent } from './login';
import { HomeComponent } from './home';
import { ProfileComponent } from './profile';
import { CreatePostComponent, PictureDialogComponent, YouTubeDialogComponent } from './createPost';
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
import { MarkedPipe } from './marked.pipe';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing,
        MaterialModule,
        BrowserAnimationsModule,
        MdDialogModule,
        MdButtonModule,
        MdCheckboxModule,
        MdTabsModule,
        MdCardModule,
        MdMenuModule,
        MdInputModule,
        MdListModule,
        MdRadioModule,
        MdSlideToggleModule,
        ReCaptchaModule,
        ClipboardModule,

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
        ProfileViewComponent,
        FlagDialogComponent,
        MarkedPipe,
        PictureDialogComponent,
        YouTubeDialogComponent
    ],
    providers: [
        AuthenticationService,
        HttpService,
        AreaService,
        AuthGuard,
        CommentService,
        FlagService,
        ReasonService,
        PostService,
        ProfileService,
        RegistrationService,
        NavBarService,
        NotificationService,
        RouteService
    ],
    entryComponents: [
      FlagDialogComponent,
      PictureDialogComponent,
      YouTubeDialogComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
