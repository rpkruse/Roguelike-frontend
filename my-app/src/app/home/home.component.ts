import { Component, OnInit } from '@angular/core';

declare var window: any;

@Component({
  selector: 'home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})
export class HomeComponent{

  ngAfterViewInit(){
    window.componentHandler.upgradeAllRegistered();
  }

  /*
    Will pull the last page of the list from the DB for top_n to display
    @param clicked: string - Either: TOP_PLAYERS, TOP_KILLS, or TOP_LEVEL
  */
  private previous(clicked: string){
    console.log("Previous clicked for: " + clicked);
  }

  /*
    Will pull the next page of the list from the DB for top_n to display
    @param clicked: string - Either: TOP_PLAYERS, TOP_KILLS, or TOP_LEVEL
  */
  private next(clicked: string){
    console.log("Next clicked for: " + clicked);
  }
}