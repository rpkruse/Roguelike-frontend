import { IUser } from '../user/user';
import { ICharacter } from '../interfaces/Character';
import { ILevel } from '../interfaces/level';


export interface ICharacter_History{
    id: number;
    user_id: number;
    character_id: number;
    score: number;
    level_id: number;
    created_at: string;
    updated_at: string;
    character: ICharacter;
    level: ILevel;
}

/*export interface ICharacter_History{
    user_id: number;
    character_id: number;
    score: number;
    level_id: number;
    //add two time stamps from the api here!
    user: IUser;
    character: ICharacter;
}*/
