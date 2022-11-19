import { FastifyRequest, FastifyReply } from "fastify";
import { Sequelize } from "sequelize";
import { IUser, UserCreateData, UserGetData, UserProfile } from "./types";

// TODO: Сделать 2 отдельных класса и в целом переписать

class User implements IUser {
    db:Sequelize;
    constructor(db: Sequelize) {
        this.db=db;
    }
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
            rating:this.rating
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
            return true
        }else{
            let createResponse = await Users.create({
                token:this.token,
                name:this.name,
                rating:1000
            })
            if(!createResponse) return false;
            this.rating=createResponse.dataValues.rating;
            this.uid=createResponse.dataValues.uid;
            return true
        }
    }
}


export class UserGet extends User {
    constructor(data: UserGetData) {
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
        return true
    }
}