import { FastifyReply, FastifyRequest } from "fastify";
import { Sequelize } from "sequelize";
import { UserGetByToken } from "../users";
import { PackageCreate } from "./index";

type Req = FastifyRequest<{
    Body: {
        recipient_uid:string;
        info:{
            sachet:boolean;
            fragile:boolean;
            width:number;
            height:number;
            length:number;
            weight:number;
        };
        rating:number;
    },
    Headers: {
        authorization: string;
    }
}>

export default async function (req: Req, reply: FastifyReply, db: Sequelize) {

    // TODO: Сделать проверку входных данных и существование пользователя

    let resUsr = new UserGetByToken({
        db,
        token:req.headers.authorization
    })
    if(await resUsr.init()){
        let resPkg = new PackageCreate({
            db,
            sender_uid:resUsr.getProfile().uid,
            recipient_uid:req.body.recipient_uid,
            info:req.body.info,
            rating:req.body.rating
        })
        if(await resPkg.init()){
            reply.send({ok:true, data:{uid:resPkg.uid}})
        }else{
            reply.send({ok:false, error:"Package not found"})
        }
    }else{
        reply.send({ok:false, error:"Not authtorized"})
    }
}