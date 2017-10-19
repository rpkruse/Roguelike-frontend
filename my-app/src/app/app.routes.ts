import { Routes } from '@angular/router';
//import { SessionGuard } from './shared/session-guard.service';

import { HomeComponent } from './home/home.component';
import { PlayComponent } from './play/play.component';
import { ProfileComponent } from './profile/profile.component'; //ADD A SESSION GUARD TO ME
import { StatsComponent } from './stats/stats.component'; //ADD A SESSION GUARD TO ME

//import { LoginComponent } from './login/login.component';

//Create components (Not used yet)
//import { CreateEntityComponent } from './create/create.component';
//import { CreateNewSongComponent } from './create/song/newsong.component';

//Playlist components
//import { PlaylistComponent } from './playlist/playlist.component';

export const rootRouterConfig: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'play', component: PlayComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'stats', component: StatsComponent }
  
  //{ path: 'listen/:id', canActivate: [ SessionGuard ], component: PlayComponent },
  //{ path: 'playlist', canActivate: [ SessionGuard ], component: PlaylistComponent,
  //},
  //{ path: 'create', component: CreateEntityComponent,
  //  children: [
  //    { path: '', redirectTo: 'create', pathMatch: 'full' },
  //    { path: 'newsong', component: CreateNewSongComponent }, // <---don't forget comma on last element or it won't compile correctly
  //  ]
  //},
  //{ path: 'login', component: LoginComponent }
];