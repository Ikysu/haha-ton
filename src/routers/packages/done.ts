import { FastifyReply, FastifyRequest } from "fastify";
import { Sequelize } from "sequelize";
import { PackageGet } from ".";
import { UserGetByToken } from "../users";

type Req = FastifyRequest<{
    Headers: {
        authorization: string;
    },
    Body: {
        uid: string;
    }
}>

export default async function (req: Req, reply: FastifyReply, db: Sequelize) {
    let resUsr = new UserGetByToken({
        db,
        token:req.headers.authorization
    })
    if(await resUsr.init()){
        let resPkg = new PackageGet({
            db,
            uid:req.body.uid
        })
        if(await resPkg.init()){
            if(resUsr.uid==resPkg.recipient_uid){
                let wellDone = await resPkg.done();
                if(wellDone){
                    reply.send({ok:true, data:wellDone})

                    
                    // TODO: Переделать на UserGetById
                    let {Users} = db.models;
                    Users.findOne({where:{uid:resPkg.sender_uid}}).then(sender=>{
                        Users.findOne({where:{uid:resPkg.status.courier_uid}}).then(courier=>{
                            //@ts-ignore
                            sendPush({
                                to:[sender?.dataValues.push_token, resUsr?.push_token, courier?.dataValues.push_token],
                                title:"Доставленно!",
                                body:`Посылка ${resPkg.uid} успешно доставленна!`,
                                data:{}
                            })
                        })
                    })


                }else{
                    reply.send({ok:false, error:"Close error"})
                }
            }else{
                reply.send({ok:false, error:"You are not recipient."})
            }
        }else{
            reply.send({ok:false, error:"Package not found"})
        }
    }else{
        reply.send({ok:false, error:"Not authtorized"})
    }
}