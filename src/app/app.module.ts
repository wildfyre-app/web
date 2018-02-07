// Angular Modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule, MdButtonModule, MdCheckboxModule, MdTabsModule, MdCardModule,
  MdMenuModule, MdInputModule, MdListModule, MdSlideToggleModule, MdDialogModule, MdRadioModule } from '@angular/material';
import { NgModule } from '@angular/core';

// Core Components
import { AppComponent } from './app.component';
import { Component404Component } from './404component/404.component';
import { CreatePostComponent, PictureDialogComponent, YouTubeDialogComponent } from './createPost/createPost.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NavBarComponent } from './navBar/navBar.component';
import { NotificationArchiveComponent } from './notificationArchive/notificationArchive.component';
import { NotificationComponent } from './notification/notification.component';
import { PostViewComponent } from './postView/postView.component';
import { ProfileComponent, LogoutDialogComponent, BioDialogComponent,
  EmailDialogComponent, AvatarDialogComponent, PasswordDialogComponent } from './profile/profile.component';
import { ProfileViewComponent } from './profileView/profileView.component';
import { RecoverComponent } from './recover/recover.component';
import { RecoverPasswordComponent } from './recoverPassword/recoverPassword.component';
import { RegisterComponent } from './register/register.component';
import { RegisterSuccessComponent } from './registerSuccess/registerSuccess.component';
import { UserPostsComponent } from './userPosts/userPosts.component';

// Core Dialogs
import { ConfirmDeletionComponent } from './_dialogs/confirmDeletion.component';

// Core Pipes
import { MarkedPipe } from './_pipes/marked.pipe';

// Core Services
import { AreaService } from './_services/area.service';
import { AuthGuard } from './_guards/auth.guard';
import { AuthenticationService } from './_services/authentication.service';
import { CommentService } from './_services/comment.service';
import { FlagService, FlagDialogComponent } from './_services/flag.service';
import { HttpService } from './_services/http.service';
import { NavBarService } from './_services/navBar.service';
import { NotificationService } from './_services/notification.service';
import { PostService } from './_services/post.service';
import { ProfileService } from './_services/profile.service';
import { ReasonService } from './_services/reason.service';
import { RegistrationService } from './_services/registration.service';
import { RouteService } from './_services/route.service';
import { Routing } from './app.routing';

// Third Party Modules
import { Angulartics2Module, Angulartics2Piwik } from 'angulartics2';
import { ClipboardModule } from 'ngx-clipboard';
import 'hammerjs';
import { ImageCropperModule } from 'ng2-img-cropper';
import { MasonryModule } from 'angular2-masonry';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReCaptchaModule } from 'angular2-recaptcha';

@NgModule({
  imports: [
    // forRoot
    Angulartics2Module.forRoot([ Angulartics2Piwik ]),

    // Modules
    BrowserAnimationsModule,
    BrowserModule,
    ClipboardModule,
    FormsModule,
    HttpModule,
    ImageCropperModule,
    MasonryModule,
    MaterialModule,
    MdButtonModule,
    MdCardModule,
    MdCheckboxModule,
    MdDialogModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdRadioModule,
    MdTabsModule,
    MdSlideToggleModule,
    NgxPaginationModule,
    ReCaptchaModule,
    Routing
  ],
  declarations: [
    // Components
    AppComponent,
    Component404Component,
    CreatePostComponent,
    HomeComponent,
    LoginComponent,
    NavBarComponent,
    NotificationArchiveComponent,
    NotificationComponent,
    PostViewComponent,
    ProfileComponent,
    ProfileViewComponent,
    RecoverComponent,
    RecoverPasswordComponent,
    RegisterComponent,
    RegisterSuccessComponent,
    UserPostsComponent,

    // Dialogs
    AvatarDialogComponent,
    BioDialogComponent,
    ConfirmDeletionComponent,
    EmailDialogComponent,
    FlagDialogComponent,
    LogoutDialogComponent,
    PasswordDialogComponent,
    PictureDialogComponent,
    YouTubeDialogComponent,

    // Pipes
    MarkedPipe
    ],
  providers: [
    AreaService,
    AuthGuard,
    AuthenticationService,
    CommentService,
    FlagService,
    HttpService,
    NavBarService,
    NotificationService,
    PostService,
    ProfileService,
    ReasonService,
    RegistrationService,
    RouteService
  ],
  entryComponents: [
    AvatarDialogComponent,
    BioDialogComponent,
    ConfirmDeletionComponent,
    EmailDialogComponent,
    FlagDialogComponent,
    LogoutDialogComponent,
    PasswordDialogComponent,
    PictureDialogComponent,
    YouTubeDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
