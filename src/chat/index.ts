import { Sequelize } from "sequelize";
import { Socket } from "socket.io";

let rooms = {

}

type ConnectionData = {
    uid:string; // package uid
    token:string; // user token
}

export function connection(socket: Socket, db: Sequelize) {
    socket.on("room-connect", (data: ConnectionData)=>{
        console.log(data)
    })
}