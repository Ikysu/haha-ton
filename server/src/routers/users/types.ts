import { Sequelize } from "sequelize";

export type UserObject = {
    uid:string;
    token:string;
    name:string;
    rating:number;
}

export interface IUser extends UserObject{
    db: Sequelize;
    init(): Promise<boolean>;
}


export type UserCreateData = {
    db:Sequelize;
    token:string;
    name:string;
}

export type UserGetData = {
    db:Sequelize;
    uid:string;
}

export type UserProfile = {
    uid:string;
    name:string;
    rating:number;
}