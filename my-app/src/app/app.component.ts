import { Component } from '@angular/core';
import 'material-design-lite/material.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  private _showHub = false;

  private clickMe(){
    this._showHub = !this._showHub;
  }
}
