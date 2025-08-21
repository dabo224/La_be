const {Sequelize,DataTypes} = require('sequelize')

module.exports = (Sequelize,DataTypes) => {
    return Sequelize.define('Like',{
        id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true
        },
        postId : {
            type : DataTypes.INTEGER,
            allowNull : false
            // references : {
            //     model : 'User',
            //     key : 'id'
            // }

        },
        userId : {
            type : DataTypes.INTEGER,
            allowNull : false
        }
        

        
    },
    {
        tableName : 'Likes'
    }
)
}