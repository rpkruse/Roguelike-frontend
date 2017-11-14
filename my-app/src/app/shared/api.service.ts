/*
    This service is used to consume the backend, it will be changed once we have one working
    Note:
        All of the methods below will be changed to work with the backend API => you shouldn't worry about them yet
*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { ICharacter_Class } from '../interfaces/Character_Class';
import { ICharacter } from '../interfaces/Character';
import { ICharacter_History } from '../interfaces/Character_History';
import { ILogin} from '../interfaces/login';
import { IUser } from '../user/user';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

@Injectable()
export class ApiService {
    private _api2 = './assets/tmp_data/';
    private _api = 'https://rogueapi.keisenb.io/api/';
    
    constructor(private _http: HttpClient) { }

    //Look at: https://angular.io/guide/http for header guide
    //NOTE: for all post/puts you will need to include the header {headers: new HttpHeaders().set('Content-Type', 'application/json')}
    getLoginToken(cred: string): Observable<ILogin>{
        console.log("SENDING TO POST: " + cred);
        return this._http.post(this._api + 'login', '{"email":"test@test.com","password":"password"}', {headers: new HttpHeaders().set('Content-Type', 'application/json')}) as Observable<ILogin>; //URL, body, Header
    }

    validateToken(token: any): Observable<any>{
        return this._http.get(this._api, token) as Observable<any>;
    }

    getAllEntities<T>(path: string): Observable<T[]>{
        return this._http.get(this._api2 + path) as Observable<T[]>;
    }

    getSingleEntity<T>(path: string, id: number): Observable<T>{
        return null; //return this._http.get(this._api + path + '/' + id) as Observable<T>;
    }

    putEntity<T>(path: string, obj: Object){
        let body = JSON.stringify(obj);
        console.log("Sending: " + body);
        //return this._http.post(_this.api + path, body) as Observable<T>?
    }

    deleteEntity<T>(path: string, id: number){
        //return this._http.delete(this._api + path + '/' + id) as OBservable<T>??
    }
}

/*//Works well, but super slow
    getCharacterHistoriesWithUser(): Observable<ICharacter_History[]>{
        return this.getAllEntities<ICharacter_History>('character_history.json')
            .flatMap((CHs: ICharacter_History[]) => {
                return Observable.forkJoin(
                    CHs.map((ch: ICharacter_History) => {
                        return this.assignCharacterHistoryValues(ch.user_id)
                            .map((res: IUser) => {
                                //console.log(res);
                                let user: IUser = res;
                                ch.user = user;
                                return ch;
                            });
                    })
                )
            })
    }

    //works, but slow
    assignCharacterHistoryValues(id: number): Observable<IUser>{
        return this.getAllEntities<IUser>('user.json').map((users: IUser[]) =>
            users.find(u => u.id === id));
    }*/
