"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "users",
      [
        {
          id: 1,
          name: "Admin",
          email: "admin@gmail.com",
          contact_no: "9870928822",
          password: await bcrypt.hash("admin@123", 10),
          role_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "supplier",
          email: "supplier@gmail.com",
          contact_no: "9870928822",
          password: await bcrypt.hash("supplier@123", 10),
          role_id: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {
        // Add this option to ensure that the existing records are updated
        updateOnDuplicate: [
          "name",
          "email",
          "password",
          "role_id",
          "updatedAt",
        ],
      }
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(
      "users",
      {
        id: {
          [Sequelize.Op.in]: [1],
        },
      },
      {}
    );
  },
};
