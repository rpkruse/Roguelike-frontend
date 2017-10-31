import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from "rxjs";
import { Observable } from 'rxjs/Observable';

import { StorageService } from './shared/session-storage.service';
import { UserService } from './user/user.service';


declare var window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', '/game.css']
})
export class AppComponent implements OnInit{
  private _sub: Subscription;
  private _playing: boolean;

  constructor(private _router: Router, private _storage: StorageService, private _userService: UserService){}

  @HostListener('window:beforeunload')
  unloadHandler(){
      //this._storage.clearAll();       
  }

  ngOnInit() {
    this._sub = this._storage.playObservable.subscribe(newPlaying => {
      this._playing = newPlaying;
    });

    this._storage.setPlaying('_playing', false);
  }

  ngAfterViewInit(){
    window.componentHandler.upgradeAllRegistered();
  }

  playClicked(){
    if(this._playing === null || this._playing === undefined){
      this._storage.setPlaying('_playing', false);
    }else{
      this._storage.setPlaying('_playing', !this._playing);
    }
  }

  testPlaying(){
    console.log(this._playing);
  }
}
