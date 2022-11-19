import { FastifyReply, FastifyRequest } from "fastify";
import { Sequelize } from "sequelize";
import { UserGetByToken } from "../users";
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
    if(await resUsr.init()){
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

            let {Users} = db.models;
            Users.findOne({where:{uid:resPkg.recipient_uid}}).then(user=>{
                //@ts-ignore
                sendPush({
                    to:user?.dataValues.push_token,
                    title:"Вам отправили посылку!",
                    body:`${resUsr.name} отправил(а) вам посылку! Перейдите в приложение, чтобы отследить её!`,
                    data:{}
                })
            })
        }else{
            reply.send({ok:false, error:"Package not found"})
        }
    }else{
        reply.send({ok:false, error:"Not authtorized"})
    }
}