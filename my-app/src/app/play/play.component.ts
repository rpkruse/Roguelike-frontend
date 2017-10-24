import { Component, OnInit, HostListener, OnDestroy, ViewChild, ElementRef} from '@angular/core';

import { StorageService } from '../shared/session-storage.service';

@Component({
  selector: 'play',
  styleUrls: ['./play.component.css'],
  templateUrl: './play.component.html'
})
export class PlayComponent implements OnInit, OnDestroy{
    private _width: number = window.innerWidth;
    private _height: number = window.innerHeight;

    constructor(private _storage: StorageService) {}

    @ViewChild('mycanvas') canvasRef: ElementRef;

    //Fires on tab/window close
    @HostListener('window:beforeunload')
    unloadHandler(){
        //this._storage.setValue('_playing', false);   
        this._storage.setPlaying('_playing', false);     
        alert("TEST");
    }

    ngOnInit(): void {
        console.log('preparing to load...')
        let node = document.createElement('script');
        node.src = "../assets/bundle.js";
        node.type = 'text/javascript';
        node.async = true;
        node.charset = 'utf-8';
        document.getElementsByTagName('head')[0].appendChild(node);

        this._storage.setPlaying('_playing', true);
    }

    //Fire on page change
    ngOnDestroy(): void{
        //alert("Are you sure?");
        //console.log(this.canvasRef);
    }
}