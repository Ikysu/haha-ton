import { FastifyReply, FastifyRequest } from "fastify";
import { Sequelize } from "sequelize";
import {v4} from "uuid";
import { 
    PackageRestoreData,
    PackageCreateData,
    PackageInfo,
    IPackage,
    PackageStatus,
    PackageObject,
    PackageStatusObject
} from "./types";

import { UserGetById } from "./../users/index";


class Package implements IPackage {
    db:Sequelize;
    uid!: string;
    sender_uid!: string;
    recipient_uid!: string;
    info!: PackageInfo;
    status!: PackageStatus;
    rating!: number;

    constructor(db: Sequelize) {
        this.db=db;
    }

    async init() {
        return false;
    }

    async getInfo(): Promise<any> {
        var out = {
            uid:this.uid,
            sender_uid:this.sender_uid,
            recipient_uid:this.recipient_uid,
            info:this.info,
            status:this.status,
            rating:this.rating
        }
        if(this.status.courier_uid){
            let response = new UserGetById({
                db:this.db,
                uid:this.status.courier_uid
            })
            if(await response.init()&&response) {
                out.status={
                    type:this.status.type,
                    //@ts-ignore Пошло оно нахуй
                    courier:response.getProfile()
                }
            }
        }
        return out
    }
}

export class PackageGet extends Package {
    constructor(data: PackageRestoreData) {
        super(data.db);
        this.uid=data.uid
    }
    async init() {
        let { Packages } = this.db.models;
        let response = await Packages.findOne({where:{uid:this.uid}})
        if(!response) return false;
        this.sender_uid=response.dataValues.sender_uid
        this.recipient_uid=response.dataValues.recipient_uid
        this.info={
            sachet:response.dataValues.info_sachet,
            fragile:response.dataValues.info_fragile,
            weight:response.dataValues.info_weight,
            width:response.dataValues.info_width,
            height:response.dataValues.info_height,
            length:response.dataValues.info_length
        };
        this.status={
            type:response.dataValues.status,
            courier_uid:response.dataValues.courier_uid
        };
        this.rating=response.dataValues.rating;

        return true;
    }
}


export class PackageCreate extends Package {
    constructor(data: PackageCreateData) {
        super(data.db);
        this.sender_uid=data.sender_uid
        this.recipient_uid=data.recipient_uid
        this.info=data.info;
        this.status={
            type:"idle",
            courier_uid:null
        };
        this.rating=data.rating;
    }

    async init() {
        let { Packages } = this.db.models;
        let response = await Packages.create({
            sender_uid:this.sender_uid,
            recipient_uid:this.recipient_uid,
            info_sachet:this.info.sachet,
            info_fragile:this.info.fragile,
            info_width:this.info.width,
            info_height:this.info.height,
            info_length:this.info.length,
            info_weight:this.info.weight,
            status:this.status.type,
            courier_uid:this.status.courier_uid,
            rating:this.rating
        });
        this.uid=response.dataValues.uid;
        return true;
    }
}