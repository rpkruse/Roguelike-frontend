/*
    This service is called when we try to load certain pages, basically,
    if we try to view any page but the home page it redirects us to the login screen
*/
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { StorageService } from './session-storage.service';

@Injectable()
export class PlayGuard implements CanActivate{
    
    constructor(private _router: Router, private _storage: StorageService){

    }

    canActivate(route: ActivatedRouteSnapshot): boolean{
        //If our user is not logged in, then he cannot access some pages so we send them to the login screen
        if(!this._storage.getValue('token') || (!this._storage.getValue("newCharacter") && !this._storage.getValue("character_history"))){
            //start the new naviagation
            this._router.navigate(['/stats']);
            //abort the path we were going to take
            return false;
        }
        return true;
    }
}