import { Routes, RouterModule } from '@angular/router';
import { Component404Component } from './404component/404.component';
import { CreatePostComponent } from './createPost/createPost.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NotificationComponent } from './notification/notification.component';
import { RegisterComponent } from './register/register.component';
import { RegisterSuccessComponent } from './registerSuccess/registerSuccess.component';
import { PostViewComponent } from './postView/postView.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileViewComponent } from './profileView/profileView.component';
import { UserPostsComponent } from './userPosts/userPosts.component';
import { AuthGuard } from './_guards/auth.guard';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'areas/:area/:id', component: PostViewComponent },
  { path: 'create', component: CreatePostComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'notifications', component: NotificationComponent, canActivate: [AuthGuard] },
  { path: 'posts', component: UserPostsComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'register/success', component: RegisterSuccessComponent },
  { path: 'user/:id', component: ProfileViewComponent },

  // otherwise redirect to 404
  { path: '**', component: Component404Component }
];

export const Routing = RouterModule.forRoot(appRoutes);
