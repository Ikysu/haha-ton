import { DataTypes, Sequelize } from 'sequelize';
export default (s:Sequelize,modelName:string)=>s.define(modelName,{
    uid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    token: { // Типо гос услуги, но на деле фантик
        type: DataTypes.TEXT
    },
    name: {
        type: DataTypes.STRING
    },
    rating: {
        type: DataTypes.INTEGER
    }
}, {
    
})