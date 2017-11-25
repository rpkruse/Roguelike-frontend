/*
  The login component validates user login, hopefully we can do this on the backend, if not I have the 
  pretty bad way that I do it here...
*/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from "rxjs";

import { ApiService } from '../shared/api.service';
import { StorageService } from '../shared/session-storage.service';
import { UserService } from '../user/user.service';

import { ICharacter_Class } from '../interfaces/Character_Class';
import { ICharacter } from '../interfaces/Character';
import { ICharacter_History } from '../interfaces/Character_History';
import { ILogin } from '../interfaces/login';
import { IToken} from '../interfaces/token';
import { IUser } from '../user/user';

declare var window: any;

@Component({
  selector: 'login',
  styleUrls: ['./login.component.css'],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit{

  private username: string = "test@test.com"; //Use test@test.com
  private password: string = "password"; //temp so we don't have to type it each time
  private rememberMe: boolean = true;

  private createUser: boolean = false;
  private display_name: string = "";
  private newPassword: string = "";
  private confirmPassword: string = "";

  constructor(private _apiService: ApiService, private _storage: StorageService, private _router: Router, private _userService: UserService) {}

  ngOnInit(){
    //Check to see if we have the user name saved (via the remember me toggle)
    let usrName = this._storage.getFromLocal('savedUsername');

    if(usrName)
      this.username = usrName;
  }
  
  ngAfterViewInit(){
     window.componentHandler.upgradeAllRegistered();
  }
  
  private loginClicked(){
    let s: Subscription;

    let loginCred: ILogin = {
      email: this.username,
      password: this.password
    }

    //convert to json to send to api service
    let cred: string = JSON.stringify(loginCred);

    //TEST LOGIN:
    let token: IToken;
    s = this._apiService.getLoginToken(cred).subscribe(
      d => token = d,
      err => console.log("CANT LOGIN", err),
      () => {
        this._storage.setValue("token", token["token"]);
        //this._storage.saveToLocal("token", token["token"]); //save to local for game pull
        this.validateLogin();
        s.unsubscribe();
      }
    );
  }

  private newClicked(){
    this.username = "";
    this.createUser = true;
  }

  private submitNewClicked(){
    let cred = {
      "email": this.username,
      "display_name": this.display_name,
      "password": this.newPassword,
      "password_confirmation": this.confirmPassword
    }

    let token: IToken;
    let s: Subscription = this._apiService.postEntity<IToken>("register", cred).subscribe(
      d => token = d,
      err => console.log("Unable to create user", err),
      () => {
        this._storage.setValue("token", token["token"]);
        this.validateLogin();        
        s.unsubscribe();
      }
    );
  }

  private validateLogin(){
    let user: IUser;
    let s: Subscription = this._apiService.validateToken().subscribe(
      d => user = d,
      err => console.log("CANT LOGIN", err),
      () => {
        this._storage.setValue('loggedIn', true);
        
        if(this.rememberMe)
          this._storage.saveToLocal('savedUsername', this.username);
        else
          this._storage.removeFromLocal('savedUsername');
        
        s.unsubscribe();

        this._userService.logIn(user);
        this._router.navigate(['./home']);
      }
    );
  }

  private canSubmit(): boolean{
    if(this.createUser){
      return this.username.length > 0 && this.display_name.length > 0 && 
              this.newPassword.length > 0 && (this.newPassword === this.confirmPassword)
    }
    return this.username.length > 0 && this.password.length > 0;
  }
}