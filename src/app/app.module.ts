// Angular Modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatExpansionModule,
  MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatProgressSpinnerModule, MatRadioModule,
  MatSelectModule, MatSidenavModule, MatSlideToggleModule, MatSnackBarModule, MatTabsModule, MatTooltipModule } from '@angular/material';
import { NgModule } from '@angular/core';

// Core Components
import { AppComponent } from './app.component';
import { Component404Component } from './404component/404.component';
import { CreatePostComponent } from './createPost/createPost.component';
import { PostViewComponent } from './_shared/postView/postView.component';
import { LoginComponent } from './login/login.component';
import { NavBarComponent } from './navBar/navBar.component';

// Shared Components
import { AreaListComponent } from './_shared/areaList/areaList.component';
import { DraftsComponent } from './_shared/drafts/drafts.component';
import { ImageUploadComponent } from './_shared/imageUpload/imageUpload.component';
import { MyPostsComponent } from './_shared/myPosts/myPosts.component';
import { NotificationsComponent } from './_shared/notifcations/notifications.component';
import { PasswordComponent } from './_shared/password/password.component';
import { ProfileComponent } from './_shared/profile/profile.component';

// Core Dialogs
import { ConfirmDeletionDialogComponent } from './_dialogs/confirmDeletion.dialog.component';
import { FlagDialogComponent } from './_dialogs/flag.dialog.component';
import { LogoutDialogComponent  } from './_dialogs/logout.dialog.component';
import { PictureDialogComponent } from './_dialogs/picture.dialog.component';
import { PicturesDialogComponent } from './_dialogs/pictures.dialog.component';
import { ShareDialogComponent } from './_dialogs/share.dialog.component';
import { YouTubeDialogComponent } from './_dialogs/youtube.dialog.component';

// Core Modules
import { ShareModule } from './_modules/ng2share/share.module';

// Core Pipes
import { MarkedPipe } from './_pipes/marked.pipe';

// Core Services
import { AreaService } from './_services/area.service';
import { AuthGuard } from './_guards/auth.guard';
import { AuthenticationService } from './_services/authentication.service';
import { CommentService } from './_services/comment.service';
import { FlagService } from './_services/flag.service';
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
import { ImageCropperModule } from 'ngx-img-cropper';
import { NgxImageCompressService } from 'ngx-image-compress';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReCaptchaModule } from 'angular2-recaptcha';

@NgModule({
  imports: [
    // forRoot
    Angulartics2Module.forRoot([ Angulartics2Piwik ]),

    // Modules
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    FlexLayoutModule,
    HttpClientModule,
    ImageCropperModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    Routing,

    // Third Party Modules
    ClipboardModule,
    ImageCropperModule,
    NgxPaginationModule,
    ReCaptchaModule,
    ShareModule

  ],
  declarations: [
    // Components
    AppComponent,
    Component404Component,
    CreatePostComponent,
    LoginComponent,
    NavBarComponent,

    // Shared Components
    AreaListComponent,
    DraftsComponent,
    ImageUploadComponent,
    MyPostsComponent,
    NotificationsComponent,
    PasswordComponent,
    PostViewComponent,
    ProfileComponent,

    // Dialogs
    ConfirmDeletionDialogComponent,
    FlagDialogComponent,
    LogoutDialogComponent,
    PictureDialogComponent,
    PicturesDialogComponent,
    ShareDialogComponent,
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
    NgxImageCompressService,
    NotificationService,
    PostService,
    ProfileService,
    ReasonService,
    RegistrationService,
    RouteService
  ],
  entryComponents: [
    ConfirmDeletionDialogComponent,
    FlagDialogComponent,
    LogoutDialogComponent,
    PictureDialogComponent,
    PicturesDialogComponent,
    ShareDialogComponent,
    YouTubeDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
