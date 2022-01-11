'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn ('Commodities', 'categoryId', { 
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'categories',  key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
     })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn ('Commodities', 'categoryId')
  }
};
