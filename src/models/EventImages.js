const {Sequelize,DataTypes} = require('sequelize')


module.exports = (sequelize,DataTypes) =>{
    return sequelize.define('EventImage',{
        
        id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true
        },
            
        urlPhoto : {
            type : DataTypes.TEXT,
            allownull : false
        },
        eventId : {
            type : DataTypes.INTEGER,
            allownull : false
        }
    })
}