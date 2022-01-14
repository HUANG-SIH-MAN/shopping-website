'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Carts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quantity: {
        allowNull: false,
        defaultValue: 1,
        type: Sequelize.INTEGER
      },
      commodityId: {
        type: Sequelize.INTEGER,
        references: { model: 'Commodities',  key: 'id' }
      },
      userId: {
        type: Sequelize.INTEGER,
        references: { model: 'Users',  key: 'id' }
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
    await queryInterface.dropTable('Carts');
  }
};