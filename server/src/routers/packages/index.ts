
import { Sequelize } from "sequelize";
import { 
    PackageRestoreData,
    PackageCreateData,
    PackageInfo,
    IPackage,
    PackageStatus,
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
    start!: { latitude: number; longitude: number; };
    end!: { latitude: number; longitude: number; };

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
            rating:this.rating,
            start:this.start,
            end:this.end
        }
        if(this.status.courier_uid){
            let response = new UserGetById({
                db:this.db,
                uid:this.status.courier_uid
            })
            if(await response.init()) {
                out.status={
                    type:this.status.type,
                    //@ts-ignore Не бей меня
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
        let { sender_uid, recipient_uid, info_sachet, info_fragile, info_weight, info_width, info_height, info_length, status, courier_uid, rating, start_latitude, start_longitude, end_latitude, end_longitude } = response.dataValues
        this.sender_uid=sender_uid
        this.recipient_uid=recipient_uid
        this.info={
            sachet:info_sachet,
            fragile:info_fragile,
            weight:info_weight,
            width:info_width,
            height:info_height,
            length:info_length
        };
        this.status={
            type:status,
            courier_uid
        };
        this.rating=rating;
        this.start={
            latitude:start_latitude,
            longitude:start_longitude
        }
        this.end={
            latitude:end_latitude,
            longitude:end_longitude
        }

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
        this.start=data.start
        this.end=data.end
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
            rating:this.rating,
            start_latitude:this.start.latitude,
            start_longitude:this.start.longitude,
            end_latitude:this.end.latitude,
            end_longitude:this.end.longitude
        });
        this.uid=response.dataValues.uid;
        return true;
    }
}