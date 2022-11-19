import { FastifyRequest, FastifyReply } from "fastify";
import { Sequelize } from "sequelize";
import { UserCreate } from ".";

type Req = FastifyRequest<{
    Querystring: {
        token:string;
        name:string;
    }
}>

export default async function get (req: Req, reply: FastifyReply, db: Sequelize) {    
    let userGet = new UserCreate({
        db,
        token:req.query.token,
        name:req.query.name
    })

    if(await userGet.init()){
        reply.send({ok:true, data:userGet.getProfile()})
    }else{
        reply.send({ok:false, error:"Bad user"})
    }
}