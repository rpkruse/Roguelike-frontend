import { Routes } from '@angular/router';
import { SessionGuard } from './shared/session-guard.service';

import { HomeComponent } from './home/home.component';
import { PlayComponent } from './play/play.component';
import { ProfileComponent } from './profile/profile.component';
import { StatsComponent } from './stats/stats.component';
import { LoginComponent } from './login/login.component'; 
export const rootRouterConfig: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'play', canActivate: [ SessionGuard ], component: PlayComponent },
  { path: 'profile', canActivate: [ SessionGuard ],component: ProfileComponent },
  { path: 'stats', canActivate: [ SessionGuard ], component: StatsComponent },
  { path: 'login', component: LoginComponent }
];