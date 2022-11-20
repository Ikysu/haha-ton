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