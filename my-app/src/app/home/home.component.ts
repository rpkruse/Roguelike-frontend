/*
  This component is used to display the top 10 from a given category (subject to change)
  Note:
    They do go in order, the only reason the first one does not is because I am using local data
    this will be fixed with the backend
*/
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../shared/api.service';
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
  selector: 'home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit{
  private classes: Observable<ICharacter_Class[]>;
  private characters: Observable<ICharacter[]>
  //private character_history: Observable<ICharacter_History[]>;
  private character_history: ICharacter_History[] = [];

  private topPlayerPage: number;
  private topKillsPage: number;
  private topLevelPage: number;

  private numPerPage: number = 10;

  private playerNextEnabled: boolean = true;
  private playerBackEnabled: boolean = false;

  private killNextEnabled: boolean = true;
  private killBackEnabled: boolean = false;

  private levelNextEnabled: boolean = true;
  private levelBackEnabled: boolean = false;

  private users: IUser[] = [];

  constructor(private _apiService: ApiService, private _userService: UserService) {}

  ngOnInit(){
    this.topPlayerPage = 0;
    this.topKillsPage = 0;
    this.topLevelPage = 0;

    this.classes = this._apiService.getAllEntities<ICharacter_Class>('character_class.json');
    this.characters = this._apiService.getAllEntities<ICharacter>('character.json');
    //this.character_history = this._apiService.getCharacterHistoriesWithUser(); //this._apiService.getAllEntities<ICharacter_History>('character_history.json');

    //Everything below this will be removed when we have a proper backend!
    let s: Subscription;

    let ch_test = this._apiService.getAllEntities<ICharacter_History>('character_history.json');


    let user = this._apiService.getAllEntities<IUser>('user.json');
    let ch = this._apiService.getAllEntities<ICharacter_History>('character_history.json');
    let char = this._apiService.getAllEntities<ICharacter>('character.json');

    Observable.forkJoin([user, ch, char]).subscribe(results => {
      //results[0] --> IUser[]
      //results[1] --> ICharacter_History[]
      //results[2] --> ICharacter[]

      for(let i=0; i<results[1].length; i++){
        results[1][i].user = results[0].find(x => x.id === results[1][i].user_id); //user.id === character_history.user_id
        results[1][i].character = results[2].find(x => x.id === results[1][i].character_id); //character.id === character_history.character_id
      }

      this.character_history = results[1];
    });
  }

  /*
    This method is required for ALL components, it updates the Design lite entities and allows
    them to have animations (I can explain in person if needed)
  */
  ngAfterViewInit(){
     window.componentHandler.upgradeAllRegistered();
  }

   /*
    Will pull the next page of the list from the DB for top_n to display
    @param clicked: string - Either: TOP_PLAYERS, TOP_KILLS, or TOP_LEVEL
  */
  private next(clicked: string){
    if(clicked === "TOP_PLAYERS"){
      this.topPlayerPage++;
      this.playerBackEnabled = this.topPlayerPage > 0;
    }else if(clicked === "TOP_KILLS"){
      this.topKillsPage++;
      this.killBackEnabled = this.topKillsPage > 0;
    }else if(clicked === "TOP_LEVEL"){
      this.topLevelPage++;
      this.levelBackEnabled = this.topLevelPage > 0;
    }
  }

  /*
    Will pull the last page of the list from the DB for top_n to display
    @param clicked: string - Either: TOP_PLAYERS, TOP_KILLS, or TOP_LEVEL
  */
  private previous(clicked: string){
    if(clicked === "TOP_PLAYERS"){
      if(this.topPlayerPage > 0)
        this.topPlayerPage--;
      this.playerBackEnabled = this.topPlayerPage > 0;
    }else if(clicked === "TOP_KILLS"){
      if(this.topKillsPage > 0)
        this.topKillsPage--;
      this.killBackEnabled = this.topKillsPage > 0;
    }else if(clicked === "TOP_LEVEL"){
      if(this.topLevelPage > 0)
        this.topLevelPage--;
      this.levelBackEnabled = this.topLevelPage > 0;
    }
  }

  private getCharacterInfo(id: number): ICharacter{
    let character: ICharacter;
    let s: Subscription;
    let d: any;

    s = this.characters.subscribe(
        data => d = data,
        err => console.log("Unable to get character info for: " + id),
        () => {
            s.unsubscribe
            return d;
        }
    )
    return character;
  }
}
