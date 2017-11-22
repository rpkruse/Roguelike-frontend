/*
  The stats component allows the user to see his past and current characters
  clicking on the characters brings up their stats and if it is a past character
  it will show what they were killed by
*/
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router} from "@angular/router";

import { ApiService } from '../shared/api.service';
import { StorageService } from '../shared/session-storage.service';

import { ICharacter_Class } from '../interfaces/Character_Class';
import { ICharacter } from '../interfaces/Character';
import { ICharacter_History } from '../interfaces/Character_History';
import { IWeapon } from '../interfaces/weapon';
import { IArmor } from '../interfaces/armor';
import { ILevel } from '../interfaces/level';

import { IUser } from '../user/user';

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

  private user: IUser;

  private selectedCharacter: ICharacter_History;
  private selectedWeapon: IWeapon;
  private selectedArmor: IArmor;
  private selectedLevel: ILevel;

  private characterClasses: ICharacter_Class[] = [];

  private deleteClicked: boolean = false;
  private deleteCharacterString: string = "";

  private createNewClicked: boolean = false;
  private newCharacterString: string = "";

  constructor(private _apiService: ApiService, private _storage: StorageService, private route: ActivatedRoute, private _router: Router){}

  ngOnInit(){
    //Get the user on every page load
    this.route.data.subscribe((data: { user: IUser }) => {
      this.user = data.user;
    });

    let ch: Observable<ICharacter_History[]> = this._apiService.getAllEntities<ICharacter_History>('characters/history');
    let cc: Observable<ICharacter_Class[]> = this._apiService.getAllEntities<ICharacter_Class>('classes');

    Observable.forkJoin([ch, cc]).subscribe(results => {
      //results[0] --> ICharacter_History[]
      //results[1] --> ICharacterClass[]

      this.character_history = results[0].filter(x => x.user_id === this.user.id);
      this.characterClasses = results[1];
    });
  }

  ngAfterViewInit(){
    window.componentHandler.upgradeAllRegistered();
  }

  /*
    Called oninit, will save two arrays one for dead characters, one for alive characters
    both are used to display on HUD.
  */
  private getCharacterStatus(status: string): ICharacter_History[]{
    let chs: ICharacter_History[] = [];
    let ch: ICharacter_History;

    for(let i=0; i<this.character_history.length; i++){
      ch = this.character_history[i];
      if(status === "alive" && !ch.character.killed_by){
        chs.push(ch);
      }else if(status === "dead" && ch.character.killed_by){
        chs.push(ch);
      }
    }
    return chs;
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
  private characterClicked(ch: ICharacter_History){
    this.createNewClicked = false;
    this.selectedCharacter = ch;
    this.getArmor(ch.character.armor_id);
    this.getWeapon(ch.character.weapon_id);
  }

  /*
    If we select continue playing from an alive character
    we store the character and his history in storage and move to the play page
  */
  private continuePlaying(){
    this._storage.setValue('character', this.selectedCharacter);
    this._storage.setValue('character_history', this.getSpecificCharacterHistory(this.selectedCharacter.id));
    this._router.navigate(['/play']);
  }

  /*
    If we create a new character save his name in the storage and move to play page
    remove character and character_history from storage to avoid confusion
  */
  private createCharacter(){
    this._storage.removeValue("character");
    this._storage.removeValue("character_history");
    this._storage.setValue("newCharacter", this.newCharacterString);
    this._router.navigate(['/play']);
  }

  /*
    Called when we continue a game, will return the given history.
  */
  private getSpecificCharacterHistory(id: number): ICharacter_History{
    let ch: ICharacter_History;
    for(let i=0; i<this.character_history.length; i++){
      ch = this.character_history[i];
      if(ch.character_id === id){
        return ch;
      }
    }
  }
  /*
    Once we have a backend, we will call our api service to delete the character
  */
  private deleteCharacterClicked(){
    if(this.selectedCharacter.character.name === this.deleteCharacterString){
      //Will delete when we get backend API
      console.log("I CAN DELETE NOW!");
    }else{
      alert("Names do not match, please re-enter to delete");
      this.deleteCharacterString = "";
    }
  }

  /*
    Toggles on the page to show character creation
  */
  private createNewCharacterClicked(){
    this.createNewClicked = true;
  }
}
