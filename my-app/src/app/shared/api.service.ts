import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { ICharacter_Class } from '../interfaces/Character_Class';
import { ICharacter } from '../interfaces/Character';
import { ICharacter_History } from '../interfaces/Character_History';
import { IUser } from '../user/User';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

@Injectable()
export class ApiService {
    private _api = './assets/tmp_data/';

    constructor(private _http: HttpClient) { }

    //Works well, but super slow
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
    }

    getAllEntities<T>(path: string): Observable<T[]>{
        return this._http.get(this._api + path) as Observable<T[]>;
    }

    getAllEntities2<T>(path: string){
        return this._http.get<T[]>(this._api + path);
    }

    private handleResponse(res: Response){
        return res.json();
    }

    /*getAll(path: string): Observable<ICharacter[]> {
        return this._http.get<ICharacter[]>(this._productUrl + path)
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getOne(path: string, name: string): Observable<ICharacter> {
        return this.getAll(path)
            .map((objs: ICharacter[]) => objs.find(p => p.name === name));
    }*/

    private handleError(err: HttpErrorResponse) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        let errorMessage = '';
        if (err.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            errorMessage = `An error occurred: ${err.error.message}`;
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
        }
        console.error(errorMessage);
        return Observable.throw(errorMessage);
    }
}