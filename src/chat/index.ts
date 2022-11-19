import { Sequelize } from "sequelize";
import { Socket } from "socket.io";

let rooms = {

}

export function connection(socket: Socket, db: Sequelize) {
    socket.on("connect", (room_id)=>{
        console.log(room_id)
    })
}