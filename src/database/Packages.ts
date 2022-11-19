import { DataTypes, Sequelize } from 'sequelize';
export default (s:Sequelize,modelName:string)=>s.define(modelName,{
    uid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    sender_uid: {
        type: DataTypes.STRING
    },
    recipient_uid: {
        type: DataTypes.STRING
    },
    info_sachet:{
        type: DataTypes.BOOLEAN
    },
    info_fragile:{
        type: DataTypes.BOOLEAN
    },
    info_weight:{
        type: DataTypes.INTEGER
    },
    info_width:{
        type: DataTypes.FLOAT
    },
    info_height:{
        type: DataTypes.FLOAT
    },
    info_length:{
        type: DataTypes.FLOAT
    },
    status:{
        type: DataTypes.STRING // Можно поменять на INTEGER для оптимизации бд, но...
    },
    courier_uid:{
        type: DataTypes.STRING
    },
    rating:{
        type: DataTypes.INTEGER
    },
    start_latitude:{
        type: DataTypes.TEXT
    },
    start_longitude:{
        type: DataTypes.TEXT
    },
    end_latitude:{
        type: DataTypes.TEXT
    },
    end_longitude:{
        type: DataTypes.TEXT
    },
    comment:{
        type: DataTypes.TEXT
    }
}, {

})