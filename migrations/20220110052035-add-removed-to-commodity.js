'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn( 'Commodities', 'removed', {
      defaultValue: false,
      type: Sequelize.BOOLEAN
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn( 'Commodities', 'removed' )
  }
};
