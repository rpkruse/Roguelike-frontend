import { ICharacter_History } from '../interfaces/Character_History';
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