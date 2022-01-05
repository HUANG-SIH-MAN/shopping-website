'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Commodities', 
    Array.from({ length: 50 }).map(i =>({
      name: faker.name.findName(),
      price: Math.floor(Math.random()*1000),
      introduction: faker.lorem.text(),
      image:`https://loremflickr.com/320/240/product/?random=${Math.random() * 100}`,
      saleAmount: 0,
      remainingNumber:Math.floor(Math.random()*100),
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      CategoryId: Math.floor(Math.random() * 5) + 1 
    }))
    , {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Commodities', null, {})
  }
};
