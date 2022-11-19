import { FastifyReply, FastifyRequest } from "fastify";
import { Sequelize } from "sequelize";


type Req = FastifyRequest<{
    
}>

export default async function (req: Req, reply: FastifyReply, db: Sequelize) {
    reply.send({ok:false})
    
}


