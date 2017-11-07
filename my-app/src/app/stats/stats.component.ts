/*
  I have not started this yet, but this component will hold the stats for the user and the current 
  and past characters they have played. The user will be able to click on a current character and
  see everything they currently have and their stats.
*/
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'material-design-lite/material.js';

import { ApiService } from '../shared/api.service';
import { UserService } from '../user/user.service';

import { ICharacter_Class } from '../interfaces/Character_Class';
import { ICharacter } from '../interfaces/Character';
import { ICharacter_History } from '../interfaces/Character_History';

declare var window: any;

@Component({
  selector: 'stats',
  styleUrls: ['./stats.component.css'],
  templateUrl: './stats.component.html'
})
export class StatsComponent implements OnInit{

  private classes: Observable<ICharacter_Class[]>;
  private characters: Observable<ICharacter[]>
  private character_history: Observable<ICharacter_History[]>;

  constructor(private _apiService: ApiService, private _userService: UserService) {}

  ngOnInit(){
    this.classes = this._apiService.getAllEntities<ICharacter_Class>('character_class.json');
    this.characters = this._apiService.getAllEntities<ICharacter>('character.json');
    this.character_history = this._apiService.getAllEntities<ICharacter_History>('character_history.json');
  }

  ngAfterViewInit(){
    window.componentHandler.upgradeAllRegistered();
  }

}