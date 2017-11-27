import { Component, OnInit, HostListener, OnDestroy, ViewChild, ElementRef} from '@angular/core';

import { StorageService } from '../shared/session-storage.service';

declare var window: any;

@Component({
  selector: 'play',
  styleUrls: ['./play.component.css'],
  templateUrl: './play.component.html'
})
export class PlayComponent implements OnInit, OnDestroy{
    private _width: number;
    private _height: number;


    constructor(private _storage: StorageService) {}

    @ViewChild('mycanvas') canvasRef: ElementRef;

    //Fires on tab/window close
    @HostListener('window:beforeunload')
    unloadHandler(){
        //this._storage.setValue('_playing', false);   
        this._storage.setPlaying('_playing', false);     
    }

    ngOnInit(): void {
        this._width = 1788/2;
        this._height = 1116/2;
        

        let node = document.createElement('script');
        node.src = "../assets/bundle.js";
        node.type = 'text/javascript';
        node.async = true;
        node.charset = 'utf-8';
        node.id = "bundleScript";
        document.getElementsByTagName('head')[0].appendChild(node);

        this._storage.setValue('_playing', true);
    }

    //Fire on page change
    ngOnDestroy(): void{
        this._storage.setValue('_playing', false);
        
        window.gameCleanup();
    }
}