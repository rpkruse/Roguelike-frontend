/*
    This service class is used to get any user details and make API requests,
    it is created to make communication between pages much easier and only dependent
    on one service
*/
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from "rxjs";

import {IUser } from './user';

import { ApiService } from '../shared/api.service';
import { StorageService } from '../shared/session-storage.service';

@Injectable()
export class UserService{
    private user: IUser;

    private loggedIn: boolean = false;

    constructor(private _apiService: ApiService, private _storage: StorageService){}

    /*
        Called from login.component, sets our user to our storage value and sets login to true
    */
    public logIn(user: IUser): void{
        this.user = user;//this._storage.getValue('user');
        this.loggedIn = this._storage.getValue('loggedIn');
    }

    /*
        Clear the storage to update our DOM and set values
    */
    public logOut(): void{
        this.loggedIn = false;

        this._storage.removeValue('token');
        this._storage.setValue('loggedIn', this.loggedIn);
    }
}
