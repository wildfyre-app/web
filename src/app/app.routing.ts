import { Routes, RouterModule } from '@angular/router';
import { AreaListComponent } from './_shared/areaList/areaList.component';
import { Component404Component } from './404component/404.component';
import { CreatePostComponent } from './_shared/createPost/createPost.component';
import { PostViewComponent } from './_shared/postView/postView.component';
import { ImageUploadComponent } from './_shared/imageUpload/imageUpload.component';
import { LoginComponent } from './login/login.component';
import { PostListComponent } from './_shared/postList/postList.component';
import { NotificationsComponent } from './_shared/notifcations/notifications.component';
import { PasswordComponent } from './_shared/password/password.component';
import { ProfileComponent } from './_shared/profile/profile.component';
import { AuthGuard } from './_guards/auth.guard';

const appRoutes: Routes = [
  { path: '', component: AreaListComponent, canActivate: [AuthGuard] },
  { path: 'areas/:area', component: PostViewComponent, canActivate: [AuthGuard] },
  { path: 'areas/:area/:id', component: PostViewComponent },
  { path: 'areas/:area/:id/:comments', component: PostViewComponent },
  { path: 'create/:area', component: CreatePostComponent, canActivate: [AuthGuard] },
  { path: 'create/:area/:id', component: CreatePostComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'notifications', redirectTo: 'notifications/1', pathMatch: 'full' },
  { path: 'notifications/1', component: NotificationsComponent, canActivate: [AuthGuard] },
  { path: 'notifications/:index', component: NotificationsComponent, canActivate: [AuthGuard] },
  { path: 'notification/archive', component: AreaListComponent, canActivate: [AuthGuard] },
  { path: 'notification/archive/:aarea/:index', component: PostListComponent, canActivate: [AuthGuard] },
  { path: 'posts', component: AreaListComponent, canActivate: [AuthGuard] },
  { path: 'posts/:area', component: PostListComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'tools/image-upload', component: ImageUploadComponent, canActivate: [AuthGuard] },
  { path: 'tools/password', component: PasswordComponent, canActivate: [AuthGuard] },
  { path: 'user/:id', component: ProfileComponent },

  // otherwise redirect to 404
  { path: '**', component: Component404Component }
];

export const Routing = RouterModule.forRoot(appRoutes);
