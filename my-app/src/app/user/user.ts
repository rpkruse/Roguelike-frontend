import { ICharacter_History } from '../interfaces/Character_History';

export interface IUser{
    id: number;
    email: string;
    display_name: string;
    password: string; //will change to something secure later 
    //add timestamp   
}