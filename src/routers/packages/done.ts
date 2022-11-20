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