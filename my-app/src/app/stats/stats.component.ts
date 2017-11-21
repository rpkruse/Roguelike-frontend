/*
  The stats component allows the user to see his past and current characters
  clicking on the characters brings up their stats and if it is a past character
  it will show what they were killed by
*/
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {ActivatedRoute, Router} from "@angular/router";

import { ApiService } from '../shared/api.service';
import { StorageService } from '../shared/session-storage.service';
import { ICharacter_Class } from '../interfaces/Character_Class';
import { ICharacter } from '../interfaces/Character';
import { ICharacter_History } from '../interfaces/Character_History';
import { IWeapon } from '../interfaces/weapon';
import { IArmor } from '../interfaces/armor';
import { ILevel } from '../interfaces/level';

import { IUser } from '../user/user';

import { SortingCharacterPipe } from '../shared/SortingCharacterPipe'
import { UserService } from '../user/user.service';
import { Subscription } from "rxjs";

import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

declare var window: any;

@Component({
  selector: 'stats',
  styleUrls: ['./stats.component.css'],
  templateUrl: './stats.component.html'
})
export class StatsComponent implements OnInit{
  private character_history: ICharacter_History[] = [];
  private characters: ICharacter[] = [];
  private aliveCharacters: ICharacter[] = [];
  private deadCharacters: ICharacter[] = [];

  private user: IUser;

  private selectedCharacter: ICharacter;
  private selectedWeapon: IWeapon;
  private selectedArmor: IArmor;
  private selectedLevel: ILevel;

  private characterClasses: ICharacter_Class[] = [];

  private deleteClicked: boolean = false;
  private deleteCharacterString: string = "";

  constructor(private _userService: UserService, private _apiService: ApiService, private _storage: StorageService, private route: ActivatedRoute){}

  ngOnInit(){
    //Get the user on every page load
    this.route.data.subscribe((data: { user: IUser }) => {
      this.user = data.user;
    });

    let ch = this._apiService.getAllEntities2<ICharacter_History>('characters/history');
    let cc = this._apiService.getAllEntities<ICharacter_Class>('character_class.json');

    //Pull the character history, keep all that match our user ID
    Observable.forkJoin([ch, cc]).subscribe(results => {
      //results[0] --> ICharacter_History[]
      //results[1] --> ICharacterClass[]

      let filterByUserID = results[0].filter(x => x.user_id === this.user.id);

      this.character_history = filterByUserID;
      this.characterClasses = results[1];
      this.getCharacterStatus();
    });
  }

  ngAfterViewInit(){
    window.componentHandler.upgradeAllRegistered();
  }

  /*
    Called oninit, will save two arrays one for dead characters, one for alive characters
    both are used to display on HUD.
  */
  private getCharacterStatus(){
    let toGet: Observable<ICharacter>[] = [];
    let ch: ICharacter_History;

    for(let i=0; i<this.character_history.length; i++){
      ch = this.character_history[i];
      toGet.push(this._apiService.getSingleEntity<ICharacter>("characters", ch.character_id));
    }

    let user_Character: ICharacter;
    Observable.forkJoin(toGet).subscribe(results => {
      for(let i=0; i<results.length; i++){
        user_Character = results[i];
        if(user_Character.killed_by){
          this.deadCharacters.push(user_Character);
        }else{
          this.aliveCharacters.push(user_Character);
        }
      }
    });
  }

  /*
    If we have a dead character, we get what they were killed by
  */
  private getKilledByClass(id: number): ICharacter_Class{
    for(let i=0; i<this.characterClasses.length; i++){
      if(this.characterClasses[i].id === id){
        return this.characterClasses[i];
      }
    }

    return null;
  }

  /*
    Returns details about a given level ID
  */
  private getLevel(id: number): ILevel{
    let ch: ICharacter_History;
    let level_id: number;
    for(let i=0; i<this.character_history.length; i++){
      ch = this.character_history[i];
      if(ch.character_id === id){
        return ch.level;
      }
    }
    return null;
  }

  /*
    Returns details about a given weapon ID
  */
  private getWeapon(id: number){
    let s: Subscription = this._apiService.getSingleEntity<IWeapon>("weapons", id).subscribe(
      d => this.selectedWeapon = d,
      err => console.log("Unable to load weapon", err),
      () => s.unsubscribe()
    );
  }

  /*
    Returns details about a given armor ID
  */
  private getArmor(id: number){
    let s: Subscription = this._apiService.getSingleEntity<IArmor>("armors", id).subscribe(
      d => this.selectedArmor = d,
      err => console.log("Unable to load weapon", err),
      () => s.unsubscribe()
    );
  }

  //When we click a character assign our value to it
  private characterClicked(ch: ICharacter){
    let s: Subscription = this._apiService.getSingleEntity<ICharacter>("characters", ch.id).subscribe(
      d => this.selectedCharacter = d,
      err => console.log("Unable to find character"),
      () => {
        this.getArmor(this.selectedCharacter.armor_id);
        this.getWeapon(this.selectedCharacter.weapon_id);
        s.unsubscribe();
      }
    );
  }

  /*
    Once we have a backend, we will call our api service to delete the character
  */
  private deleteCharacterClicked(){
    if(this.selectedCharacter.name === this.deleteCharacterString){
      //Will delete when we get backend API
      console.log("I CAN DELETE NOW!");
    }else{
      alert("Names do not match, please re-enter to delete");
      this.deleteCharacterString = "";
    }
  }
}
