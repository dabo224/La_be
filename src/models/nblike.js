const {Sequelize,DataTypes} = require('sequelize')

module.exports = (Sequelize,DataTypes) => {
    return Sequelize.define('NbLike',{
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
        nblike : {
            type : DataTypes.INTEGER,
            allowNull : false
        }
        

        
    },
    {
        tableName : 'NbLikes'
    }
)
}