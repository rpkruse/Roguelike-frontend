import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from "rxjs";

import {IUser } from './User';

import { ApiService } from '../shared/api.service';
import { StorageService } from '../shared/session-storage.service';

@Injectable()
export class UserService{

    private user: IUser;

    private loggedIn: boolean = false;

    constructor(private _apiService: ApiService, private _storage: StorageService){}

    public logIn(): void{
        this.user = this._storage.getValue('user');
        this.loggedIn = this._storage.getValue('loggedIn');
    } 

    public logOut(): void{
        this.user = null;
        this.loggedIn = false;

        this._storage.removeValue('user');

        this._storage.setValue('loggedIn', this.loggedIn);
    }

    public getUserName(): string{
        this.user = this._storage.getValue('user');
        if(this.user)
            return this.user.display_name;
        return "";
    }

    public getID(): number{
        this.user = this._storage.getValue('user');
        if(this.user)
            return this.user.id;
        return null;
    }
    
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