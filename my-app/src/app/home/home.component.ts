import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../shared/api.service';
import { ICharacter_Class } from '../interfaces/Character_Class';
import { ICharacter } from '../interfaces/Character';
import { ICharacter_History } from '../interfaces/Character_History';

import { SortingCharacterPipe } from '../shared/SortingCharacterPipe'

declare var window: any;

@Component({
  selector: 'home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit{
  private classes: Observable<ICharacter_Class[]>;
  private characters: Observable<ICharacter[]>
  private character_history: Observable<ICharacter_History[]>;

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

  constructor(private _apiService: ApiService) {}

  ngOnInit(){
    this.topPlayerPage = 0;
    this.topKillsPage = 0;
    this.topLevelPage = 0;
    
    this.classes = this._apiService.getAllEntities<ICharacter_Class>('character_class.json');
    this.characters = this._apiService.getAllEntities<ICharacter>('character.json');
    this.character_history = this._apiService.getAllEntities<ICharacter_History>('character_history.json');
  }
  
  ngAfterViewInit(){
     window.componentHandler.upgradeAllRegistered();
  }

   /*
    Will pull the next page of the list from the DB for top_n to display
    @param clicked: string - Either: TOP_PLAYERS, TOP_KILLS, or TOP_LEVEL
  */
  private next(clicked: string){
    console.log(this.topKillsPage);
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

}