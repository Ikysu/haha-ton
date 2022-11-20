import { throws } from "assert";
import { FastifyRequest, FastifyReply } from "fastify";
import { Model, Sequelize, Op } from "sequelize";
import { IUser, UserCreateData, UserGetByIdData, UserGetByTokenData, UserProfile } from "./types";

// TODO: Сделать 2 отдельных класса и в целом переписать

class User implements IUser {
    db:Sequelize;
    constructor(db: Sequelize) {
        this.db=db;
    }
    geo!: { latitude: number; longitude: number; };
    reg_date!: number;
    pkg!: { sent: number; delivered: number; };
    uid!: string;
    token!: string;
    name!: string;
    rating!: number;
    push_token!: string;
    verified!: boolean;

    model!: Model;
    

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
            pkg:this.pkg,
            geo:this.geo,
            verified:this.verified
        }
    }

    async setGeo(latitude: number, longitude: number) {
        let res = await this.model.update({
            latitude,
            longitude
        })
        if(res){
            this.geo={
                latitude,
                longitude
            }
        }
        return this.getProfile
    }

    async checkUserIsNotActive(): Promise<boolean> {
        let { Packages } = this.db.models;
        
        let response = await Packages.findAll({
            where:{
                [Op.or]:[
                    {
                        sender_uid:this.uid
                    },
                    {
                        recipient_uid:this.uid
                    },
                    {
                        courier_uid:this.uid
                    },
                ],
                [Op.not]:[
                    {
                        status:"canceled"
                    },
                    {
                        status:"delivered"
                    }
                ]
            }
        })

        console.log(response.length)

        return response.length==0
    }
}

export class UserCreate extends User {
    constructor(data: UserCreateData) {
        super(data.db);
        this.token=data.token;
        this.name=data.name;
        this.push_token=data.push_token
    }
    async init() {
        let { Users } = this.db.models;

        let findResponse = await Users.findOne({where:{token:this.token}});
        if(findResponse){
            let {rating, uid, name, reg_date, pkg_sent, pkg_delivered, latitude, longitude, verified} = findResponse.dataValues;
            this.rating=rating;
            this.uid=uid;
            this.name=name;
            this.reg_date=reg_date;
            this.pkg={
                sent:pkg_sent,
                delivered:pkg_delivered
            }
            this.geo={
                latitude,
                longitude
            }
            this.verified=verified;
            this.model=findResponse;
            return true
        }else{
            let createResponse = await Users.create({
                token:this.token,
                name:this.name,
                rating:1000,
                pkg_sent:0,
                pkg_delivered:0,
                latitude:0,
                longitude:0,
                verified:Math.random() > 0.5
            })
            if(!createResponse) return false;
            let {rating, uid, reg_date, pkg_sent, pkg_delivered, latitude, longitude, verified} = createResponse.dataValues;
            this.rating=rating;
            this.uid=uid;
            this.reg_date=reg_date;
            this.pkg={
                sent:pkg_sent,
                delivered:pkg_delivered
            }
            this.geo={
                latitude,
                longitude
            }
            this.verified=verified;
            this.model=createResponse;
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
        let {rating, token, name, reg_date, pkg_sent, pkg_delivered, latitude, longitude, verified} = findResponse.dataValues;
        this.name=name;
        this.rating=rating;
        this.token=token;
        this.reg_date=reg_date;
        this.pkg={
            sent:pkg_sent,
            delivered:pkg_delivered
        }
        this.geo={
            latitude,
            longitude
        }
        this.verified=verified;
        this.model=findResponse;
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
        let {uid, rating, token, name, reg_date, pkg_sent, pkg_delivered, latitude, longitude, verified} = findResponse.dataValues;
        this.uid=uid
        this.name=name;
        this.rating=rating;
        this.reg_date=reg_date;
        this.pkg={
            sent:pkg_sent,
            delivered:pkg_delivered
        }
        this.geo={
            latitude,
            longitude
        }
        this.verified=verified;
        this.model=findResponse;
        return true
    }
}