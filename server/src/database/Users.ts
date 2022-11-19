import { DataTypes, Sequelize } from 'sequelize';
export default (s:Sequelize,modelName:string)=>s.define(modelName,{
    uid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    token: {
        type: DataTypes.TEXT
    },
    name: {
        type: DataTypes.STRING
    },
    rating: {
        type: DataTypes.INTEGER
    },
    reg_date: { // Дата регистрации
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    pkg_sent: { // Отправленных посылок
        type: DataTypes.INTEGER
    },
    pkg_delivered: { // Доставленных посылок
        type: DataTypes.INTEGER
    }
}, {
    
})