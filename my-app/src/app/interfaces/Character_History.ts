import { IUser } from '../user/user';
import { ICharacter } from '../interfaces/Character';
import { ICharacter_Class } from '../interfaces/Character_Class';
import { ILevel } from '../interfaces/level';


export interface ICharacter_History{
    id: number;
    user_id: number;
    character_id: number;
    score: number;
    level_id: number;
    created_at: string;
    updated_at: string;
    character: ICharactorHistoryCharacter;
    level: ILevel;
}

export interface ICharactorHistoryCharacter{
    id: number;
    name: string;
    attack_bonus: number;
    damage_bonus: number;
    defense_bonus: number;
    weapon_id: number;
    armor_id: number;
    class_id: number;
    created_at: string;
    updated_at: string;
    killed_by: number;
    class: ICharacter_Class;
}

/*
CharacterHistory {
id (integer, optional),
user_id (integer, optional),
character_id (integer, optional),
score (integer, optional),
level_id (integer, optional),
created_at (string, optional),
updated_at (string, optional),
character (Inline Model 1, optional),
level (Inline Model 2, optional)
}
*/

/*Character
id (integer, optional),
name (string, optional),
attack_bonus (integer, optional),
damage_bonus (integer, optional),
defense_bonus (integer, optional),
weapon_id (integer, optional),
armor_id (integer, optional),
class_id (integer, optional),
created_at (string, optional),
updated_at (string, optional),
killed_by (integer, optional),
class (Inline Model 3, optional)
*/