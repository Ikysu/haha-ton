import { Sequelize } from "sequelize";
import { Socket } from "socket.io";

let rooms = {

}

export function connection(socket: Socket, db: Sequelize) {
    socket.on("room-connect", (token: string)=>{
        console.log(token)
    })
}