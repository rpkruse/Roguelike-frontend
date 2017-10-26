import { Component, OnInit } from '@angular/core';
import 'material-design-lite/material.js';

import { ApiService } from '../shared/api.service';
import { ICharacter_Class } from '../interfaces/Character_Class';
import { ICharacter } from '../interfaces/Character';

declare var window: any;

@Component({
  selector: 'stats',
  styleUrls: ['./stats.component.css'],
  templateUrl: './stats.component.html'
})
export class StatsComponent implements OnInit{

  classes: ICharacter_Class[] = [];
  characters: ICharacter[] = [];

  constructor(private _apiService: ApiService) {}

  ngOnInit(){
    //Load the data here
    this._apiService.getAllEntities<ICharacter_Class>('character_class.json')
      .subscribe(
        classes => this.classes = classes,
        err => console.log("error"),
        () => {
          console.log("Finished loading classes!");
        }
      );

    this._apiService.getAllEntities<ICharacter>('character.json')
      .subscribe(
        characters => this.characters = characters,
        err => console.log("error"),
        () => {
          console.log("Finished loading characters!");
        }
      );
  }

  ngAfterViewInit(){
    window.componentHandler.upgradeAllRegistered();
  }

}