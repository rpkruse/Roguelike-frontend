import { Component } from '@angular/core';
import { Router } from '@angular/router';

import 'material-design-lite/material.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', '/game.css']
})
export class AppComponent{
  private _playing: boolean = false;

  constructor(private _router: Router){}

  clickedPlay(){
    this._playing = !this._playing;
  }
}
