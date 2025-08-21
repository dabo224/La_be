const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Message', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    from: { type: DataTypes.INTEGER, allowNull: false },
    to: { type: DataTypes.INTEGER, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    // createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  });
};
