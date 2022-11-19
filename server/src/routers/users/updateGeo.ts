import { FastifyRequest, FastifyReply } from "fastify";
import { Sequelize } from "sequelize";
import { UserGetByToken } from ".";

type Req = FastifyRequest<{
    Body: {
        latitude:number;
        longitude:number;
    },
    Headers: {
        authorization: string;
    }
}>

export default async function (req: Req, reply: FastifyReply, db: Sequelize) {    
    let userGet = new UserGetByToken({
        db,
        token:req.headers.authorization
    })

    if(await userGet.init()){
        await userGet.setGeo(req.body.latitude, req.body.longitude)
        reply.send({ok:true, data:userGet.getProfile()})
    }else{
        reply.send({ok:false, error:"User not found"})
    }
}