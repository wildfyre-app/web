import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/index';
import { HomeComponent } from './home/index';
import { ProfileComponent } from './profile/index';
import { CreatePostComponent } from './createPost/index';
import { UserPostsComponent } from './userposts/index';
import { RegisterComponent } from './register/index';
import { NotificationComponent } from './notification/index';
import { NavBarComponent } from './navBar/index';
import { CardViewComponent } from './cardView/index';
import { Component404Component } from './404component/index';
import { AuthGuard } from './_guards/index';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'post', component: CreatePostComponent, canActivate: [AuthGuard] },
  { path: 'cards', component: UserPostsComponent, canActivate: [AuthGuard] },
  { path: 'notifications', component: NotificationComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'areas/:area/:id', component: CardViewComponent },
  // otherwise redirect to home
  { path: '**', component: Component404Component }
];

export const routing = RouterModule.forRoot(appRoutes);
