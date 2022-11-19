import { FastifyRequest, FastifyReply } from "fastify";
import { Sequelize } from "sequelize";
import { UserCreate } from ".";

type Req = FastifyRequest<{
    Querystring: {
        token:string;
        name:string;
        push_token:string;
    }
}>

export default async function get (req: Req, reply: FastifyReply, db: Sequelize) {    
    let userGet = new UserCreate({
        db,
        token:req.query.token,
        name:req.query.name,
        push_token:req.query.push_token
    })

    if(await userGet.init()){
        reply.send({ok:true, data:{
            ...userGet.getProfile(),
            avatar:"https://web.damirlut.online/pchel.png"
        }})
    }else{
        reply.send({ok:false, error:"Bad user"})
    }
}