import { Component, OnInit } from '@angular/core';

import { ApiService } from '../shared/api.service';
import { ICharacter_Class } from '../interfaces/Character_Class';
import { ICharacter } from '../interfaces/Character';
import { ICharacter_History } from '../interfaces/Character_History';

declare var window: any;

@Component({
  selector: 'home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit{
  private classes: ICharacter_Class[] = [];
  private characters: ICharacter[] = [];
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

  constructor(private _apiService: ApiService) {}

  ngOnInit(){
    this.topPlayerPage = 1;
    this.topKillsPage = 1;
    this.topLevelPage = 1;
    
    //Load the data here
    this._apiService.getAllEntities('character_class.json')
      .subscribe(
        classes => this.classes = classes,
        err => console.log("error"),
        () => {
          console.log("Finished loading classes!");
        }
      );

    this._apiService.getAllEntities('character.json')
      .subscribe(
        characters => this.characters = characters,
        err => console.log("error"),
        () => {
          console.log("Finished loading characters!");
        }
      );
    
    this._apiService.getAllEntities('character_history.json')
      .subscribe(
        character_history => this.character_history = character_history,
        err => console.log("error"),
        () => {
          console.log("Finished loading character history!");
        }
      );
  }
  
  ngAfterViewInit(){
     window.componentHandler.upgradeAllRegistered();
  }

  private getTopPlayers(): ICharacter_History[]
  {
    let ch: ICharacter_History[] = [];
    let startPage: number = this.numPerPage * this.topPlayerPage;
    let endPage: number = startPage + this.numPerPage;

    for(let i = startPage; i<endPage; i++){
      if(this.topPlayerPage < Math.ceil(this.character_history.length / this.numPerPage)){ //Make sure we don't go out of bounds
        ch.push(this.character_history[i]);
      }else{
        ch.push(this.character_history[i]);
        this.playerNextEnabled = false;
      }
    }

    return(ch);
  }

  private getTopKills(): ICharacter_History[]
  {
    let ch: ICharacter_History[] = [];
    let startPage: number = this.numPerPage * this.topKillsPage;
    let endPage: number = startPage + this.numPerPage;

    this.killNextEnabled = true;

    for(let i = startPage; i<endPage; i++){
      if(this.topKillsPage < Math.ceil(this.character_history.length / this.numPerPage)){ //Make sure we don't go out of bounds
        ch.push(this.character_history[i]);
      }else{
        ch.push(this.character_history[i]);
        this.killNextEnabled = false;
      }
    }

    return(ch);
  }

  private getTopLevel(): ICharacter_History[]
  {
    let ch: ICharacter_History[] = [];
    let startPage: number = this.numPerPage * this.topLevelPage;
    let endPage: number = startPage + this.numPerPage;

    for(let i = startPage; i<endPage; i++){
      if(this.topLevelPage < Math.ceil(this.character_history.length / this.numPerPage)){ //Make sure we don't go out of bounds
        ch.push(this.character_history[i]);
      }else{
        ch.push(this.character_history[i]);
        this.levelNextEnabled = false;
      }
    }

    return(ch);
  }

   /*
    Will pull the next page of the list from the DB for top_n to display
    @param clicked: string - Either: TOP_PLAYERS, TOP_KILLS, or TOP_LEVEL
  */
  private next(clicked: string){
    console.log(this.topKillsPage);
    if(clicked === "TOP_PLAYERS"){
      this.topPlayerPage++;
      this.playerBackEnabled = this.topPlayerPage > 1;
    }else if(clicked === "TOP_KILLS"){
      this.topKillsPage++;
      this.killBackEnabled = this.topKillsPage > 1;
    }else if(clicked === "TOP_LEVEL"){
      this.topLevelPage++;
      this.levelBackEnabled = this.topLevelPage > 1;
    }
  }

  /*
    Will pull the last page of the list from the DB for top_n to display
    @param clicked: string - Either: TOP_PLAYERS, TOP_KILLS, or TOP_LEVEL
  */
  private previous(clicked: string){
    if(clicked === "TOP_PLAYERS"){
      if(this.topPlayerPage > 1)
        this.topPlayerPage--;
      this.playerBackEnabled = this.topPlayerPage > 1;      
    }else if(clicked === "TOP_KILLS"){
      if(this.topKillsPage > 1)
        this.topKillsPage--;
      this.killBackEnabled = this.topKillsPage > 1;
    }else if(clicked === "TOP_LEVEL"){
      if(this.topLevelPage > 1)
        this.topLevelPage--;
      this.levelBackEnabled = this.topLevelPage > 1;
    }
  }

}