import { FastifyReply, FastifyRequest } from "fastify";
import { Sequelize } from "sequelize";
import { PackageCreate } from "./index";

type Req = FastifyRequest<{
    Body: {
        sender_uid:string;
        recipient_uid:string;
        info:{
            sachet:boolean;
            fragile:boolean;
            width:number;
            height:number;
            length:number;
        };
        rating:number;
    }
}>

export default async function (req: Req, reply: FastifyReply, db: Sequelize) {

    // TODO: Сделать проверку входных данных и существование пользователя

    let res = new PackageCreate({
        db,
        sender_uid:req.body.sender_uid,
        recipient_uid:req.body.recipient_uid,
        info:req.body.info,
        rating:req.body.rating
    })
    if(await res.init()){
        reply.send({ok:true, data:{uid:res.uid}})
    }else{
        reply.send({ok:false})
    }
}