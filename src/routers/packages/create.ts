import { FastifyReply, FastifyRequest } from "fastify";
import { Sequelize } from "sequelize";
import { UserGetById, UserGetByToken } from "../users";
import { PackageCreate } from "./index";
import { GeoPos, PackageInfo } from "./types";

type Req = FastifyRequest<{
    Body: {
        recipient_uid:string;
        info:PackageInfo;
        rating:number;
        start:GeoPos;
        end:GeoPos;
        comment:string;
    },
    Headers: {
        authorization: string;
    }
}>

export default async function (req: Req, reply: FastifyReply, db: Sequelize, sendPush: Promise<boolean>) {

    // TODO: Сделать проверку входных данных и существование пользователя, а так же на наличие активных посылок как в take

    let resUsr = new UserGetByToken({
        db,
        token:req.headers.authorization
    })
    let resRec = new UserGetById({
        db,
        uid:req.body.recipient_uid
    })
    if(await resUsr.init()&&await resRec.init()&&await resUsr.checkUserIsNotActive()&&await resRec.checkUserIsNotActive()){
        let resPkg = new PackageCreate({
            db,
            sender_uid:resUsr.uid,
            recipient_uid:req.body.recipient_uid,
            info:{
                ...req.body.info,
                width: Math.floor(req.body.info.width),
                height: Math.floor(req.body.info.height),
                length: Math.floor(req.body.info.length),
                weight: Math.floor(req.body.info.weight),
            },
            rating:req.body.rating,
            start:req.body.start,
            end:req.body.end,
            comment:req.body.comment
        })
        if(await resPkg.init()){
            reply.send({ok:true, data:await resPkg.getInfo()})
        }else{
            reply.send({ok:false, error:"Package not found"})
        }
    }else{
        reply.send({ok:false, error:"Not authtorized"})
    }
}