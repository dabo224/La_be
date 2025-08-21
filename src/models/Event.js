const {Sequelize,DataTypes} = require('sequelize')

module.exports = (sequelize,DataTypes) =>{
    return sequelize.define('Event',{
        id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true
        },
        Description : {
            
            type : DataTypes.TEXT,
            allownull : true

        },
        userId : {
            type : DataTypes.INTEGER,
            allownull : false,
            references: {
                model: 'Users',
                key: 'id'
            }
        }
    })
}