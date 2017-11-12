export interface ICharacter{
    id: number;
    atk_bonus: number;
    dmg_bonus: number;
    name: string;
    health: number;
    def_bonus: number;
    weapon: number; //We can change these to objects if we do the API a certain way
    armor: number; //We can change these to objects if we do the API a certain way
    killed_by: number;//Can change to actual object with backend
}