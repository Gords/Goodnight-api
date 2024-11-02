'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    // First, get the user IDs
    const users = await queryInterface.sequelize.query(
      `SELECT id from "Users" WHERE username IN ('alice', 'bob', 'charlie');`
    );
    const userRows = users[0];
    
    // Create some follow relationships
    return queryInterface.bulkInsert('Follows', [
      {
        followerId: userRows[0].id,  // alice follows bob
        followingId: userRows[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        followerId: userRows[0].id,  // alice follows charlie
        followingId: userRows[2].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        followerId: userRows[1].id,  // bob follows alice
        followingId: userRows[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('Follows', null, {});
  }
};
