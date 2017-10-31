import { ICharacter_History } from '../interfaces/Character_History';
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