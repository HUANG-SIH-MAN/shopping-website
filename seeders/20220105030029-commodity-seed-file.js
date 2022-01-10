'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const imageData = await require('../utils/commodityImageData')
    await queryInterface.bulkInsert('Commodities', 
    Array.from({ length: 30 }).map((item, index) =>({
      name: faker.name.findName(),
      price: Math.floor(Math.random()*1000),
      introduction: faker.lorem.text(),
      image: imageData[index],
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
