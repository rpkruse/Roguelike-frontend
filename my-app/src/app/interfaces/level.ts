import { IUser } from '../user/user';
import { ICharacter } from '../interfaces/Character';

export interface ILevel{
    id: number;
    user_id: string;
    seed: string;
    score: number;
    created_at: string;
    updated_at: string;
    user: IUser;
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
