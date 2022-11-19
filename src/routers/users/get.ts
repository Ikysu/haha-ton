import { FastifyRequest, FastifyReply } from "fastify";
import { Sequelize } from "sequelize";
import { UserCreate, UserGetById } from ".";

type Req = FastifyRequest<{
    Querystring: {
        uid:string;
    }
}>

export default async function (req: Req, reply: FastifyReply, db: Sequelize) {    
    let userGet = new UserGetById({
        db,
        uid:req.query.uid
    })

    if(await userGet.init()){
        reply.send({ok:true, data:{
            ...userGet.getProfile(),
            avatar:"https://web.damirlut.online/pchel.png"
        }})
    }else{
        reply.send({ok:false, error:"User not found"})
    }
}