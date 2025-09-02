const { Sequelize } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn("Messages", "imageUrl", {
        type: Sequelize.STRING,
        allowNull: true,
      });
      console.log("Migration: ajout de la colonne imageUrl réussi");
    } catch (error) {
      console.error("Erreur lors de la migration:", error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn("Messages", "imageUrl");
    } catch (error) {
      console.error("Erreur lors du rollback:", error);
    }
  },
};
