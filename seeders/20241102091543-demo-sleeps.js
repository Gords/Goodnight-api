'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    // Get user IDs
    const users = await queryInterface.sequelize.query(
      `SELECT id from "Users" WHERE username IN ('alice', 'bob', 'charlie');`
    );
    const userRows = users[0];

    // Create some sleep records over the past week
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    
    return queryInterface.bulkInsert('Sleeps', [
      {
        userId: userRows[0].id,  // alice's sleeps
        clockIn: new Date(now - 2 * oneDay),
        clockOut: new Date(now - 2 * oneDay + 8 * 60 * 60 * 1000), // 8 hours
        duration: 8 * 60,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: userRows[1].id,  // bob's sleeps
        clockIn: new Date(now - oneDay),
        clockOut: new Date(now - oneDay + 7 * 60 * 60 * 1000), // 7 hours
        duration: 7 * 60,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: userRows[2].id,  // charlie's sleeps
        clockIn: new Date(now - oneDay),
        clockOut: new Date(now - oneDay + 6 * 60 * 60 * 1000), // 6 hours
        duration: 6 * 60,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('Sleeps', null, {});
  }
};
