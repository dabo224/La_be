const {Sequelize,DataTypes} = require('sequelize')

module.exports = (Sequelize,DataTypes) => {
    return Sequelize.define('User',{
        id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true
        },
        nom : {
            type : DataTypes.STRING,
            allowNull : false
        },
        prenom : {
            type : DataTypes.STRING,
            allowNull : false
        },
        email : {
            type : DataTypes.STRING,
            allowNull : false,
            unique : {
                msg : 'Ce email est déjà utilisé'  
            }
        },
        password : {
            type : DataTypes.STRING,
            allowNull : false
        }
    })
    // User.Associate = function (models){
    //     User.hasMany(Sequelize.define('Post'))
    // }
}