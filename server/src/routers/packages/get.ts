import { FastifyReply, FastifyRequest } from "fastify";
import { Sequelize } from "sequelize";
import { UserGetByToken } from "../users";
import { PackageGet } from "./index";


type Req = FastifyRequest<{
    Body: {
        uid:string;
    },
    Headers: {
        authorization: string;
    }
}>

export default async function (req: Req, reply: FastifyReply, db: Sequelize) {
    let resPkg = new PackageGet({
        uid:req.body.uid,
        db,
    })

    // TODO: Сделать проверку на доступ к посылке. Типа, если человек отправитель/курьер/получатель, то выдавать данные, если нет, то 403

    if(await resPkg.init()){
        reply.send({ok:true,data:await resPkg.getInfo()})
    }else{
        reply.send({ok:false, error:"Package not found"})
    }
}