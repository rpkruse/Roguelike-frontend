export interface IFriend{
    id1: number;
    id2: number;
    user1: IUser_Friend;
    user2: IUser_Friend;
}

export interface IUser_Friend{
    id: number;
    display_name: string;
}