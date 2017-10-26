import { ICharacter_History } from '../interfaces/Character_History';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortingCompanies'
})
export class SortingCharacterPipe implements PipeTransform {

  transform(companies: ICharacter_History[], path: string[], order: number, ): ICharacter_History[] {

    // Check if is not null
    if (!companies || !path || !order) return companies;

    return companies.sort((a: ICharacter_History, b: ICharacter_History) => {
      // We go for each property followed by path
      path.forEach(property => {
        a = a[property];
        b = b[property];
      })

      // Order * (-1): We change our order
      return a > b ? order : order * (- 1);
    })
  }

}