import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';


import { ICharacter_Class } from '../interfaces/Character_Class';
@Injectable()
export class ApiService {
    private _api = './assets/tmp_data/';

    constructor(private _http: HttpClient) { }


    /* getSingleEntity(path: string, id: number): Observable<any>{
        return this.getAllEntities(path)
            .map
    }*/

    getAllEntities<T>(path: string): Observable<T[]>{
        return this._http.get(this._api + path) as Observable<T[]>;
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