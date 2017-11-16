import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { ApiService } from '../shared/api.service';
import { StorageService } from './session-storage.service';

import { IUser } from '../user/user';

@Injectable()
export class UserResolver implements Resolve<any>{
    constructor(private router: Router, private apiService: ApiService, private storage: StorageService){}

    resolve(route: ActivatedRouteSnapshot): Observable<IUser>{
        return this.apiService.validateToken();
    }
}