/*
  This component shows the user all of their information such as email, number of characters, etc
  *Not finished yet*
*/
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {ActivatedRoute } from "@angular/router";

import { ApiService } from '../shared/api.service';
import { StorageService } from '../shared/session-storage.service';
import { ICharacter_Class } from '../interfaces/Character_Class';
import { ICharacter } from '../interfaces/Character';
import { ICharacter_History } from '../interfaces/Character_History';
import { IFriend } from '../interfaces/friend';
import { IUser } from '../user/user';


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
export class ProfileComponent implements OnInit{

  private initUser: IUser;  
  private user: IUser;

  private friendToAdd: string = "";

  private password: string = "";
  private passwordConfirm: string = "";

  private friends: IFriend[] = [];

  constructor(private _apiService: ApiService, private _storage: StorageService, private route: ActivatedRoute){}

  ngOnInit(){
    let usr: IUser;
    this.route.data.subscribe((data: { user: IUser }) => {
      this.user = data.user;
      this.initUser = Object.assign({}, this.user); //Make it clone the object so they have different references
    });

    let s: Subscription = this._apiService.getAllEntities<IFriend>("friends").subscribe(
      d => this.friends = d,
      err => console.log("Unable to load friends", err),
      () => s.unsubscribe()
    );
  }

  ngAfterViewInit(){
    window.componentHandler.upgradeAllRegistered();
  }

  private deleteFriend(name: string, index: number){ //Will take ID of friend when we have backend
    let df = {
      "display_name": name
    };

    let s: Subscription = this._apiService.deleteEntity("friends", df).subscribe(
      d => d = d,
      err => alert("Unable to delete friend"),
      () => {
        s.unsubscribe();
        this.friends.splice(index, 1);
      }
    )
  }

  private addFriend(){
    if(this.friendToAdd === this.user.display_name){
      this.friendToAdd = "";
      return;
    }
    
    let af = {
      "display_name": this.friendToAdd
    }

    let newFriend: IFriend;
    let s: Subscription = this._apiService.postEntity<IFriend>("friends", af).subscribe(
      d => newFriend = d,
      err => alert("Unable to add friend"),
      () => {
        s.unsubscribe();
        this.friends.push(newFriend);
        this.friendToAdd = "";
      }
    )
  }

  private getFriendName(index: number): string{
    let friend: IFriend = this.friends[index];
    
    if(friend.user1.display_name === this.user.display_name){
      return friend.user2.display_name;
    }

    return friend.user1.display_name;
  }
  /*
    If we have made changes to the user info (emial, name, password), return true to toggle the confim button on
  */
  private areChanges(): boolean{
    if(this.initUser.email !== this.user.email || this.initUser.display_name !== this.user.display_name || this.password){
      if(this.password === this.passwordConfirm)
        return true;
    }
    return false;
  }

  /*
    When we click the confirm button, we will update the user information in the backend
  */
  private confirmChanges(){
    let u;

    if(this.password){
      u = {
        "email": this.user.email,
        "display_name": this.user.display_name,
        "password": this.password,
        "password_confirmation": this.passwordConfirm
      }
    }else{
      u = {
        "email": this.user.email,
        "display_name": this.user.display_name,
      }
    }
    let s: Subscription = this._apiService.putEntity<IUser>("user", u).subscribe(
      d => this.user = d,
      err => console.log("Unable to update user", err),
      () => {
        this.password = "";
        this.passwordConfirm = "";
        s.unsubscribe();
      }
    );
  }
}
