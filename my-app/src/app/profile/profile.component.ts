import { Component } from '@angular/core';

declare var window: any;

@Component({
  selector: 'profile',
  styleUrls: ['./profile.component.css'],
  templateUrl: './profile.component.html'
})
export class ProfileComponent{
  ngAfterViewInit(){
    window.componentHandler.upgradeAllRegistered();
  }

}