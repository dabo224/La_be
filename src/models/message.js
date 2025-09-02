const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Message", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    from: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    to: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true, // Permettre null car on peut avoir un message avec juste une image
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    audioUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
};
