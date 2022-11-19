import { Sequelize } from "sequelize";

export type UserProfile = {
    uid:string;
    name:string;
    rating:number;
    reg_date:number;
    pkg: {
        sent: number;
        delivered: number;
    },
    geo:{
        latitude:number;
        longitude:number;
    }
}

export type UserObject = UserProfile & {
    token:string;
}

export interface IUser extends UserObject {
    db: Sequelize;
    init(): Promise<boolean>;
}


export type UserGetByIdData = {
    db:Sequelize;
    uid:string;
}

export type UserGetByTokenData = {
    db:Sequelize;
    token:string;
}

export type UserCreateData = UserGetByTokenData & {
    name:string;
}

