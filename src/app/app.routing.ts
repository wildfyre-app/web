import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/index';
import { HomeComponent } from './home/index';
import { ProfileComponent } from './profile/index';
import { CreatePostComponent } from './createPost/index';
import { UserPostsComponent } from './userPosts/index';
import { RegisterComponent } from './register/index';
import { NotificationComponent } from './notification/index';
import { NavBarComponent } from './navBar/index';
import { PostViewComponent } from './postView/index';
import { Component404Component } from './404component/index';
import { RegisterSuccessComponent } from './registerSuccess/index';
import { ProfileViewComponent } from './profileView/index';
import { AuthGuard } from './_guards/index';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'create', component: CreatePostComponent, canActivate: [AuthGuard] },
  { path: 'posts', component: UserPostsComponent, canActivate: [AuthGuard] },
  { path: 'notifications', component: NotificationComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register/success', component: RegisterSuccessComponent },
  { path: 'areas/:area/:id', component: PostViewComponent },
  { path: 'user/:id', component: ProfileViewComponent },
  // otherwise redirect to home
  { path: '**', component: Component404Component }
];

export const routing = RouterModule.forRoot(appRoutes);
