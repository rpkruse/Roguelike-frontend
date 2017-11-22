/*
  This component shows the user all of their information such as email, number of characters, etc
  *Not finished yet*
*/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {ActivatedRoute, Router} from "@angular/router";

import { ApiService } from '../shared/api.service';
import { StorageService } from '../shared/session-storage.service';
import { ICharacter_Class } from '../interfaces/Character_Class';
import { ICharacter } from '../interfaces/Character';
import { ICharacter_History } from '../interfaces/Character_History';
import { IUser } from '../user/user';

import { SortingCharacterPipe } from '../shared/SortingCharacterPipe'
import { UserService } from '../user/user.service';
import { Subscription } from "rxjs";

import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

declare var window: any;

@Component({
  selector: 'profile',
  styleUrls: ['./profile.component.css'],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit, OnDestroy{

  private initUser: IUser;  
  private user: IUser;

  private selectedCharacter: ICharacter;

  private friendToAdd: string = "";

  private password: string = "";
  constructor(private _userService: UserService, private _apiService: ApiService, private _storage: StorageService, private route: ActivatedRoute){}

  ngOnInit(){
    let usr: IUser;
    this.route.data.subscribe((data: { user: IUser }) => {
      this.user = data.user;
      this.initUser = Object.assign({}, this.user); //Make it clone the object so they have different references
    });
  }

  ngAfterViewInit(){
    window.componentHandler.upgradeAllRegistered();
  }

  private deleteFriend(){ //Will take ID of friend when we have backend
    console.log("removing...")
  }

  private addFriend(){
    console.log(this.friendToAdd);
  }

  /*
    When the page is destoryed, we will update the user's name/email if we have changed it
    this will be implemented when we have a working backend with POST
  */
  ngOnDestroy(){
    if(this.initUser.email !== this.user.email || this.initUser.display_name !== this.user.display_name || this.password){
      console.log("Need to update user");
    }
  }
}
