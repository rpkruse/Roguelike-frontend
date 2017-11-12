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
    public logIn(): void{
        this.user = this._storage.getValue('user');
        this.loggedIn = this._storage.getValue('loggedIn');
    }

    /*
        Clear the storage to update our DOM and set values
    */
    public logOut(): void{
        this.user = null;
        this.loggedIn = false;

        this._storage.removeValue('user');

        this._storage.setValue('loggedIn', this.loggedIn);
    }

    /*
        Returns the user's username
        @return: string
    */
    public getUserName(): string{
        this.user = this._storage.getValue('user');
        if(this.user)
            return this.user.display_name;
        return "";
    }

    /*
        Return's the user's ID
        May be removed when we get backend
        @return: number
    */
    public getID(): number{
        this.user = this._storage.getValue('user');
        if(this.user)
            return this.user.id;
        return null;
    }

     /*
        Return's the user
        May be removed when we get backend
        @return: IUser
    */
    public getUser(): IUser{
        this.user = this._storage.getValue('user');
        if(this.user)
            return this.user;
        return null;
    }

    /*
        Called when we want to consume the backend
        @return: any - the data consumed
    */
    public performApiACtion(action: Observable<any>, errorMessage: string): any{
        let s: Subscription;
        let d: any;
        s = action.subscribe(
            data => d = data,
            err => console.log(errorMessage),
            () => {
                s.unsubscribe
                return d;
            }
        )
    }
}
