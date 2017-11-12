import { IUser } from '../user/User';
import { ICharacter } from '../interfaces/Character';

export interface ICharacter_History{
    user_id: number;
    character_id: number;
    score: number;
    level_id: number;
    //add two time stamps from the api here!
    user: IUser;
    character: ICharacter;
}