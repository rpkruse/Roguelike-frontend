import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';


@Component({
  selector: 'play',
  styleUrls: ['./play.component.css'],
  templateUrl: './play.component.html'
})
export class PlayComponent implements OnInit{

    ngOnInit(): void {
        console.log('preparing to load...')
        let node = document.createElement('script');
        node.src = "../assets/bundle.js";
        node.type = 'text/javascript';
        node.async = true;
        node.charset = 'utf-8';
        document.getElementsByTagName('head')[0].appendChild(node);
      }
}