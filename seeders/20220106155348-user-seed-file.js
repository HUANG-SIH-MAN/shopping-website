'use strict';
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'administrator',
        email: 'administrator@example.com',
        password: bcrypt.hashSync('123456789', bcrypt.genSaltSync(10), null),
        phone: '0987648123',
        address: '台北市大安區建國南路一段3545號',
        image: 'https://i.imgur.com/wNCdqAZ.jpeg',
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'user',
        email: 'root@example.com',
        password: bcrypt.hashSync('123456789', bcrypt.genSaltSync(10), null),
        phone: '0987648123',
        address: '台北市大安區建國南路一段3545號',
        image: 'https://i.imgur.com/Vo3Kh0K.jpeg',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
  ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
