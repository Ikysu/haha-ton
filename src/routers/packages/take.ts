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

export default async function (req: Req, reply: FastifyReply, db: Sequelize, sendPush: Promise<boolean>) {


    let resUsr = new UserGetByToken({
        db,
        token:req.headers.authorization
    })
    if(await resUsr.init()&&await resUsr.checkUserIsNotActive()){
        let resPkg = new PackageGet({
            db,
            uid:req.body.uid
        })
        if(await resPkg.init()){
            let pkg = await resPkg.setCourier(resUsr.uid)
            if(pkg){
                reply.send({ok:true, data:pkg})


                // TODO: Переделать на UserGetById
                let {Users} = db.models;
                Users.findOne({where:{uid:resPkg.recipient_uid}}).then(recipient=>{
                    Users.findOne({where:{uid:resPkg.status.courier_uid}}).then(courier=>{
                        //@ts-ignore
                        sendPush({
                            to:[recipient?.dataValues.push_token, resUsr?.push_token],
                            title:"Курьер!",
                            body:`${courier?.dataValues.name} отозвался(ась) отвезти вашу посылку`,
                            data:{}
                        })
                    })
                })


            }else{
                reply.send({ok:false, error:"Package error"})
            }
        }else{
            reply.send({ok:false, error:"Package not found"})
        }
    }else{
        reply.send({ok:false, error:"Not authtorized"})
    }
}