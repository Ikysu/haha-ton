import { FastifyReply, FastifyRequest } from "fastify";
import { Sequelize } from "sequelize";
import { PackageGet } from "./index";


type Req = FastifyRequest<{
    Body: {
        uid:string;
    }
}>

export default async function (req: Req, reply: FastifyReply, db: Sequelize) {
    let res = new PackageGet({
        uid:req.body.uid,
        db,
    })
    if(await res.init()){
        reply.send({ok:true,data:res.getInfo()})
    }else{
        reply.send({ok:false})
    }
}