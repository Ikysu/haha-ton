import { FastifyReply, FastifyRequest } from "fastify";
import { Sequelize } from "sequelize";
import { PackageObject } from "./types";


export default async function (req: FastifyRequest, reply: FastifyReply, db: Sequelize) {


    // TODO: Отправлять лишь близжайшие посылки (сейчас отправляются все)
    
    let { Packages } = db.models;

    let response = await Packages.findAll()
    
    let out:PackageObject[]=response.map(e=>{
        let { uid, sender_uid, recipient_uid, info_sachet, info_fragile, info_weight, info_width, info_height, info_length, status, courier_uid, rating, start_latitude, start_longitude, end_latitude, end_longitude, coment } = e.dataValues
        return {
            uid,
            sender_uid,
            recipient_uid,
            rating,
            info:{
                sachet:info_sachet,
                fragile:info_fragile,
                weight:info_weight,
                width:info_width,
                height:info_height,
                length:info_length
            },
            status:{
                type:status,
                courier_uid
            },
            start:{
                latitude:start_latitude,
                longitude:start_longitude
            },
            end:{
                latitude:end_latitude,
                longitude:end_longitude
            },
            coment
        }
    })
    
    reply.send({ok:true,data:out})
    
}



