import { Component, OnInit } from '@angular/core';
import { IUser } from '../user/user';

import { UserService } from '../user/user.service';
import { StorageService } from '../shared/session-storage.service';

declare var window: any;

@Component({
  selector: 'profile',
  styleUrls: ['./profile.component.css'],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit{

  constructor(private _userService: UserService, private _storage: StorageService){}
  
  ngOnInit(){

  }

  ngAfterViewInit(){
    window.componentHandler.upgradeAllRegistered();
  }

}