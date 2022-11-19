import { FastifyReply, FastifyRequest } from "fastify";
import { Sequelize } from "sequelize";


export default async function (req: FastifyRequest, reply: FastifyReply, db: Sequelize) {
    reply.send({ok:false})
    
    

}