import {readFileSync, readdirSync} from "fs";
import { Sequelize } from 'sequelize';
import Fastify from "fastify";

const settings = JSON.parse(readFileSync("settings.json", "utf-8"));

const reconnectOptions = {
    max_retries: 999,
    onRetry: function(count: number) {
        console.log("[DATABASE] Connection lost, trying to reconnect ("+count+")");
    }
};



// Sequelize

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

const fastify = Fastify();

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
    await sequelize.sync({
        force:true
    })
    console.log(fastify.printRoutes());
})

fastify.listen(settings.fastify)