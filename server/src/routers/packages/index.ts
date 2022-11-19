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

import { UserGet } from "./../users/index";


class Package implements IPackage {
    db:Sequelize;
    uid!: string;
    sender_id!: string;
    recipient_id!: string;
    info!: PackageInfo;
    status!: PackageStatus;
    rating!: number;

    constructor(db: Sequelize) {
        this.db=db;
    }

    async init() {
        return false;
    }

    getInfo(): PackageObject {
        return {
            uid:this.uid,
            sender_id:this.sender_id,
            recipient_id:this.recipient_id,
            info:this.info,
            status:this.status,
            rating:this.rating
        }
    }

    async getStatus(): Promise<PackageStatusObject | boolean> {
        if(this.status.courier_id){
            let response = new UserGet({
                db:this.db,
                uid:this.status.courier_id
            })
            if(!response) return response;
            return {
                type:this.status.type,
                courier:response.getProfile()
            }
        }else{
            return false
        }
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
        this.sender_id=response.dataValues.sender_id
        this.recipient_id=response.dataValues.recipient_id
        this.info={
            sachet:response.dataValues.info_sachet,
            fragile:response.dataValues.info_fragile,
            width:response.dataValues.info_width,
            height:response.dataValues.info_height,
            length:response.dataValues.info_length
        };
        this.status={
            type:response.dataValues.status,
            courier_id:response.dataValues.courier_id
        };
        this.rating=response.dataValues.rating;

        return true;
    }
}


export class PackageCreate extends Package {
    constructor(data: PackageCreateData) {
        super(data.db);
        this.sender_id=data.sender_id
        this.recipient_id=data.recipient_id
        this.info=data.info;
        this.status={
            type:"idle",
            courier_id:null
        };
        this.rating=data.rating;
    }

    async init() {
        let { Packages } = this.db.models;
        let response = await Packages.create({
            sender_id:this.sender_id,
            recipient_id:this.recipient_id,
            info_sachet:this.info.sachet,
            info_fragile:this.info.fragile,
            info_width:this.info.width,
            info_height:this.info.height,
            info_length:this.info.length,
            status:this.status.type,
            courier_id:this.status.courier_id,
            rating:this.rating
        });
        this.uid=response.dataValues.uid;
        return true;
    }
}