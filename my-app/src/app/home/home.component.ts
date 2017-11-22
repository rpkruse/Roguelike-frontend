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
 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }

  constructor(private _apiService: ApiService) {}

  ngOnInit(){
    this.topPlayerPage = 0;
    this.topKillsPage = 0;
    this.topLevelPage = 0;
    
    this.character_history = this._apiService.getAllEntities2<ICharacter_History>("characters/history");
   
    this.setupPieChart();
  }

  /*
    This method is required for ALL components, it updates the Design lite entities and allows
    them to have animations (I can explain in person if needed)
  */
  ngAfterViewInit(){
     window.componentHandler.upgradeAllRegistered();
  }

  private setupPieChart(){
    let nArcher: number = 0;
    let nMage: number = 0;
    let nKnight: number = 0;

    let ch: ICharacter_History[] = [];

    let s: Subscription = this.character_history.subscribe(
      d => ch = d,
      err => console.log("Unable to load character histories", err),
      () => {
        s.unsubscribe();
        for(let i=0; i<ch.length; i++){
          let name: string = ch[i].character.name;
          if(name === "Knight"){
            nKnight++;
          }else if(name === "Mage"){
            nMage++;
          }else{
            nArcher++;
          }
        }
        this.pieChartData = [nKnight, nMage, nArcher];
      }
    );
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
}
