const { type } = require('express/lib/response')
const {Sequelize,DataTypes} = require('sequelize')

module.exports = (Sequelize,DataTypes) => {
    return Sequelize.define('Notification',{
        id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true
        },
        contenu : {
            type : DataTypes.TEXT,
            allowNull : false
        },
        senderId : {
            type: DataTypes.INTEGER,
            allowNull : false
        },
        userID : {
            type : DataTypes.INTEGER,
            allowNull : false
            // references :{
            //     model : 'User',
            //     key : 'id'
            // }
        }
    })  
}