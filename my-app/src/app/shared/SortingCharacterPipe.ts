import { ICharacter_History } from '../interfaces/Character_History';
import { ILevel } from '../interfaces/level';
/*
  This service is called from the homepage tables, it sorts them from highest to lowest
  so that we can see the top 10 players
*/
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortingCharacter'
})
export class SortingCharacterPipe implements PipeTransform {

  transform(characters: any[], args: string): any[] {

    // Check if is not null
    if (!characters || !args) return characters;

    if(args === "level"){ //This is not good...but it works...I'm sorry
      return characters.sort((a: any, b: any) => {
        //flipped b/c we want to start with highest
        if(a[args].number > b[args].number){
          return -1;
        }else if(a[args].number < b[args].number){
          return 1;
        }else{
          return 0
        }
      });
    }else{
      return characters.sort((a: any, b: any) => {
        //flipped b/c we want to start with highest
        if(a[args] > b[args]){
          return -1;
        }else if(a[args] < b[args]){
          return 1;
        }else{
          return 0
        }
      });
    }
  }

}