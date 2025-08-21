const {Sequelize,DataTypes} = require('sequelize')

module.exports = (Sequelize,DataTypes) => {
    return Sequelize.define('Comment',{
        id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true
        },
        contenu : {
            type : DataTypes.TEXT,
            allowNull : false
        },
        PostId : {
            type : DataTypes.INTEGER,
            allowNull : false,
            // references : {
            //     model : 'User',
            //     key : 'id'
            // }

        },
        UserId : {
            type : DataTypes.INTEGER,
            allowNull : false
        }
    })
}