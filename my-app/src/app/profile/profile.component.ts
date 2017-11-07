/*
  This component shows the user all of their information such as email, number of characters, etc
  *Not finished yet*
*/
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../shared/api.service';
import { StorageService } from '../shared/session-storage.service';
import { ICharacter_Class } from '../interfaces/Character_Class';
import { ICharacter } from '../interfaces/Character';
import { ICharacter_History } from '../interfaces/Character_History';
import { IUser } from '../user/User';

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
export class ProfileComponent implements OnInit{

  private character_history: ICharacter_History[] = [];
  private characters: ICharacter[] = [];

  private user: IUser;
  private selectedCharacter: ICharacter;

  constructor(private _userService: UserService, private _apiService: ApiService, private _storage: StorageService){}
  
  ngOnInit(){
    //All below this will be removed with backend
    let ch = this._apiService.getAllEntities<ICharacter_History>('character_history.json');
    let char = this._apiService.getAllEntities<ICharacter>('character.json');

    Observable.forkJoin([ch, char]).subscribe(results => {
      //results[0] --> ICharacter_History[]
      //results[1] --> ICharacter[]

      let filterByUserID = results[0].filter(x => x.user_id === this._userService.getID());

      for(let i=0; i<filterByUserID.length; i++){
        filterByUserID[i].character = results[1].find(x => x.id === filterByUserID[i].character_id);
      }

      this.character_history = filterByUserID;

      this.user = this._userService.getUser();
    });
  }

  ngAfterViewInit(){
    window.componentHandler.upgradeAllRegistered();
  }

  characterClicked(index: number){
    if(index < this.character_history.length){
      this.selectedCharacter = this.character_history[index].character;
      console.log(this.selectedCharacter);
    }
  }

}