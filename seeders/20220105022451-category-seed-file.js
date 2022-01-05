'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Categories', 
      ['文具用品', '3C產品', '書籍雜誌', '生活日用', '其他']
      .map((item, index) =>({
        id: index + 1,
        name: item,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    , {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
