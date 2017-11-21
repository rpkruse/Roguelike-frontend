export interface ICharacter{
    id: number;
    name: string;
    health: number;    
    attack_bonus: number;
    damage_bonus: number;
    defense_bonus: number;
    weapon_id: number; //We can change these to objects if we do the API a certain way
    armor_id: number; //We can change these to objects if we do the API a certain way
    created_at: string;
    updated_at: string;
    killed_by: number;//Can change to actual object with backend
}

/*
id (integer, optional),
name (string, optional),
health (integer, optional),
attack_bonus (integer, optional),
damage_bonus (integer, optional),
defense_bonus (integer, optional),
weapon_id (integer, optional),
armor_id (integer, optional),
created_at (string, optional),
updated_at (string, optional),
killed_by (integer, optional)
*/