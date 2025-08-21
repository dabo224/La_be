const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Friendship', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        friendId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        }
    });
};