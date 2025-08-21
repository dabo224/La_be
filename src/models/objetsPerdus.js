const {Sequelize,DataTypes} = require('sequelize')

module.exports = (Sequelize,DataTypes) => {
    return Sequelize.define('ObjetPerdu',{
        id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true
        },
        description : {
            type : DataTypes.TEXT,
            allowNull : false
        },
        image : {
            type : DataTypes.STRING,
            allowNull : false
        },
        userId : {
            type : DataTypes.INTEGER,
            allowNull : false
        }

    })
}