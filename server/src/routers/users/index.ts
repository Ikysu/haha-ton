import { FastifyRequest, FastifyReply } from "fastify";
import { Sequelize } from "sequelize";
import { IUser, UserCreateData, UserGetByIdData, UserGetByTokenData, UserProfile } from "./types";

// TODO: Сделать 2 отдельных класса и в целом переписать

class User implements IUser {
    db:Sequelize;
    constructor(db: Sequelize) {
        this.db=db;
    }
    reg_date!: number;
    pkg!: { sent: number; delivered: number; };
    uid!: string;
    token!: string;
    name!: string;
    rating!: number;
    

    async init(): Promise<boolean> {
        return false;
    }

    checkToken(token: string): boolean {
        return this.token == token;
    }

    getProfile(): UserProfile {
        return {
            uid:this.uid,
            name:this.name,
            rating:this.rating,
            reg_date:this.reg_date,
            pkg:this.pkg
        }
    }
}

export class UserCreate extends User {
    constructor(data: UserCreateData) {
        super(data.db);
        this.token=data.token;
        this.name=data.name;
    }
    async init() {
        let { Users } = this.db.models;

        let findResponse = await Users.findOne({where:{token:this.token}});
        if(findResponse){
            this.rating=findResponse.dataValues.rating;
            this.uid=findResponse.dataValues.uid;
            this.name=findResponse.dataValues.name;
            this.reg_date=findResponse.dataValues.reg_date;
            this.pkg={
                sent:findResponse.dataValues.pkg_sent,
                delivered:findResponse.dataValues.pkg_delivered
            }
            return true
        }else{
            let createResponse = await Users.create({
                token:this.token,
                name:this.name,
                rating:1000,
                pkg_sent:0,
                pkg_delivered:0
            })
            if(!createResponse) return false;
            this.rating=createResponse.dataValues.rating;
            this.uid=createResponse.dataValues.uid;
            this.reg_date=createResponse.dataValues.reg_date;
            this.pkg={
                sent:createResponse.dataValues.pkg_sent,
                delivered:createResponse.dataValues.pkg_delivered
            }
            return true
        }
    }
}


export class UserGetById extends User {
    constructor(data: UserGetByIdData) {
        super(data.db);
        this.uid=data.uid;
    }
    async init() {
        let { Users } = this.db.models;
        
        let findResponse = await Users.findOne({where:{uid:this.uid}});
        if(!findResponse) return false;
        this.name=findResponse.dataValues.name;
        this.rating=findResponse.dataValues.rating;
        this.token=findResponse.dataValues.token;
        this.reg_date=findResponse.dataValues.reg_date;
        this.pkg={
            sent:findResponse.dataValues.pkg_sent,
            delivered:findResponse.dataValues.pkg_delivered
        }
        return true
    }
}

export class UserGetByToken extends User {
    constructor(data: UserGetByTokenData) {
        super(data.db);
        this.token=data.token;
    }
    async init() {
        let { Users } = this.db.models;
        
        let findResponse = await Users.findOne({where:{token:this.token}});
        if(!findResponse) return false;
        this.name=findResponse.dataValues.name;
        this.rating=findResponse.dataValues.rating;
        this.token=findResponse.dataValues.token;
        this.reg_date=findResponse.dataValues.reg_date;
        this.pkg={
            sent:findResponse.dataValues.pkg_sent,
            delivered:findResponse.dataValues.pkg_delivered
        }
        return true
    }
}