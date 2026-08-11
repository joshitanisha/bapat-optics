'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.bulkInsert(
      "transaction_types",
      [
        {
          id: 1,
          name: "Credit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "Debit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 3,
          name: "Withdraw",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {
        updateOnDuplicate: ["name", "updatedAt"],
      }
    );
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete(
      "transaction_types",
      {
        id: {
          [Sequelize.Op.in]: [1, 2, 3],
        },
      },
      {}
    );
  }
};
