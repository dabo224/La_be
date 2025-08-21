const {Sequelize,DataTypes} = require('sequelize')
const nblike = require('./nblike')
const { type } = require('express/lib/response')
const { all } = require('express/lib/application')

module.exports = (Sequelize,DataTypes) => {
    return Sequelize.define('Post',{
        id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true
        },
        titre : {
            type : DataTypes.STRING,
            allowNull : false
        },
        contenu : {
            type : DataTypes.TEXT,
            allowNull : false
        },
        nblike :{
            type : DataTypes.INTEGER,
            allowNull : false
        },
        nbcomment:{
            type : DataTypes.INTEGER,
            allowNull : false
        },
        userID : {
            type : DataTypes.INTEGER,
            allowNull : false
        //     references :{
        //         model : 'Users',
        //         key : 'id'
        //     }
        }
    })
}