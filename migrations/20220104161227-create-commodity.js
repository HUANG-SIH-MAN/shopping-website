'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Commodities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      price: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      introduction: {
        type: Sequelize.TEXT
      },
      image: {
        type: Sequelize.STRING
      },
      saleAmount: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      remainingNumber: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      viewCount: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Commodities');
  }
};