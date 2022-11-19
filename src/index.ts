import {readFileSync, readdirSync} from "fs";
import { Sequelize } from 'sequelize';
import Fastify from "fastify";
import fastifySocket from 'fastify-socket.io'
import fastifyCors from "@fastify/cors";

const settings = JSON.parse(readFileSync("settings.json", "utf-8"));



// Sequelize

const reconnectOptions = {
    max_retries: 999,
    onRetry: function(count: number) {
        console.log("[DATABASE] Connection lost, trying to reconnect ("+count+")");
    }
};

const sequelize = new Sequelize({
    ...settings.db,
    reconnect: reconnectOptions || true
})

readdirSync("./src/database").forEach(async model=>{
    let modelName = model.replace(/\.[^.]*$/, "");
    console.log(`[DATABASE] Loading model: ${model}`);
    (await import(`./database/${model}`)).default(sequelize, modelName)
})



// Fastify

const fastify = Fastify({
    logger:true
});

fastify.register(fastifySocket)
fastify.register(fastifyCors, {
    origin: "*",
    methods:["GET", "POST", "PUT", "DELETE"]
})

readdirSync("./src/routers").forEach(route=>{
    readdirSync(`./src/routers/${route}`).forEach(async method=>{
        let methodName = method.replace(/\.[^.]*$/, "");
        if(methodName!="types"){
            let script = (await import(`./routers/${route}/${method}`)).default;
            fastify[script?.name=="get"?"get":"post"](`/${route}/${methodName!="index"?methodName:""}`, (...argv)=>script(...argv,sequelize))
        }
    })
})

fastify.ready(async (err)=>{
    if(err) throw err;
    
    await sequelize.authenticate();
    console.log("[DATABASE] authenticated")
    await sequelize.sync({
        force:true
    })
    console.log("[DATABASE] synced")

    let soc = await import(`./chat`);
    Object.getOwnPropertyNames(soc).filter(e=>e[0]!="_").forEach(event=>{
        let socScript = soc[event as keyof typeof soc];
        fastify.io.on(event, (socket)=>socScript(socket,sequelize))
    })
    console.log("[SOCKET] installed")
    console.log(fastify.printRoutes());
})

fastify.listen(settings.fastify)