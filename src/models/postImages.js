const {Sequelize,DataTypes} = require('sequelize')

module.exports = (Sequelize,DataTypes) => {
    return Sequelize.define('ImagePost',{
        id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true
        },

        urlPhoto : {
            type : DataTypes.STRING,
            allowNull : false
        },
        postId : {
            type : DataTypes.INTEGER,
            
            allowNull : false
        }
        
    })
}