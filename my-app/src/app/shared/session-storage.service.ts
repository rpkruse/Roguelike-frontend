/*
    What is stored:
        _playing - If we are currently playing the game or not
*/
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';

export class StorageService{
    //Used to allow dynamic updates on our playlist
    public playObservable: Observable<any>;
    private _playObserver: any;
    private _playing: boolean;

    constructor(){
        this.playObservable = new Observable(observer => {
            this._playObserver = observer;
        }).share();
    }

    /*
        Sets the playlist to a new value and notifies all subscribers
        @param key: string - '_playlist'
        @param value: any - The value to set it to 
    */
    public setPlaying(key: string, value: any){
        this.setValue(key, value);
        this._playing = this.getValue(key);
        this._playObserver.next(this._playing);
    }

    /*
        Sets a key in session storage to a given key
        @param key: string = the key of the object
        @param value: any - the value we want to set the key to
    */
    public setValue(key: string, value: any): void{
        if(value){
            value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
    }

    /*
        Returns a value from session storage if it exists, returns null if it does not
        @param key: string - the object we want to get the value for
        @return any - Returns the value of the key or null if the key is not in storage
    */
    public getValue(key: string): any{
        let value: string = localStorage.getItem(key);

        if(value && value != "undefined" && value != "null"){
            return JSON.parse(value);
        }

        return null;
    }

    /*
        Returns if the key is in the session storage or not
    */
    public hasValue(key: string): boolean{
        if(localStorage.getItem(key) === null){
            return false;
        }
        return true;
    }

    /*
        Removes the key and its corresponding value from session storage
    */
    public removeValue(key: string): void{
        localStorage.removeItem(key);
    }

    /*
        Clears the whole storage
    */
    public clearAll(): void{
        localStorage.clear();
    }
}