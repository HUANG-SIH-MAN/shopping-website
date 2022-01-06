'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.bulkInsert('Users', [
      {
        name: 'administrator',
        email: 'administrator@example.com',
        password: '123456789',
        phone: '0987648123',
        address: '台北市大安區建國南路一段3545號',
        image: 'https://reurl.cc/02DjyY',
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'user',
        email: 'root@example.com',
        password: '123456789',
        phone: '0987648123',
        address: '台北市大安區建國南路一段3545號',
        image: 'https://reurl.cc/ak597D',
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
