'use strict';

/** @type {import('sequelize-cli').Migration} */
const { hashPassword } = require('../utils/password');

module.exports = {
  up: async (queryInterface) => {
    const passwordHash = await hashPassword('password123');
    return queryInterface.bulkInsert('Users', [
      {
        username: 'alice',
        password: passwordHash,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'bob',
        password: passwordHash,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'charlie',
        password: passwordHash,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
