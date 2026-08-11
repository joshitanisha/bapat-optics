"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "coupon_types",
      [
        // {
        //   id: 1,
        //   name: "Brand",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        {
          id: 2,
          name: "Category",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 3,
          name: "Global",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 4,
          name: "Date Wise",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {
        updateOnDuplicate: ["name", "updatedAt"],
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "coupon_types",
      {
        id: {
          [Sequelize.Op.in]: [1, 2, 3, 4],
        },
      },
      {}
    );
  },
};
