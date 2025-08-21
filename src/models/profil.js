const {Sequelize,DataTypes} = require('sequelize')

module.exports = (Sequelize,DataTypes) => {
    return Sequelize.define('Profil',{
        id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true
        },

        urlPhoto : {
            type : DataTypes.STRING,
            allowNull : false
        },

        userId : {
            type : DataTypes.INTEGER,
            allowNull : false
        }
        
    })
}