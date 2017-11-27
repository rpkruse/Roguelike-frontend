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
  private characters: Observable<ICharacter[]>
  private character_history: Observable<ICharacter_History[]>;

  private topScores: Observable<any[]>;
  private topLevels: Observable<any[]>;

  private numUsers: number;
  private totalDeaths: number;
  private userDeaths: number;
  private monsterDeaths: number;

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

  // Pie
  public pieChartLabels: string[] = ['Knight', 'Mage', 'Archer'];
  private pieChartData: number[] = [0, 0, 0];
  public pieChartType: string = 'pie';

  constructor(private _apiService: ApiService) {}

  ngOnInit(){
    this.topPlayerPage = 0;
    this.topKillsPage = 0;
    this.topLevelPage = 0;

    this.topScores = this._apiService.getAllEntities<any>("statistics/scores");
    this.topLevels = this._apiService.getAllEntities<any>("statistics/levels");
    
    
    this.character_history = this._apiService.getAllEntities<ICharacter_History>("characters/history");

    let count = this._apiService.getAllEntities<any>("statistics/users");
    let allDeath = this._apiService.getAllEntities<any>("statistics/deaths");
    let monster = this._apiService.getAllEntities<any>("statistics/monsters");
    let usrDeath = this._apiService.getAllEntities<any>("statistics/deaths/1");
    let classCount = this._apiService.getAllEntities<any>("statistics/classes");

    Observable.forkJoin([count, allDeath, monster, usrDeath, classCount]).subscribe(results => {
      this.numUsers = results[0]['count'];
      this.totalDeaths = results[1]['count'];
      this.monsterDeaths = results[2]['count'];
      this.userDeaths = results[3]['count'];

      let nMage: number = results[4]['mage'];
      let nKnight: number = results[4]['knight'];
      let nArcher: number = results[4]['archer'];

      this.pieChartData = [nKnight, nMage, nArcher];      
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

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }
}
