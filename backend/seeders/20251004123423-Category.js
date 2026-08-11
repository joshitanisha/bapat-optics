"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "p_categories",
      [
        {
          id: 1,
          name: "Lenses",
          sort_order: 4,
          discount_percentage: 0,
          tax_percentage: 0,
          customer_view: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "Sunglasses",
          sort_order: 2,
          discount_percentage: 0,
          tax_percentage: 0,
          customer_view: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: "Contact Lenses",
          sort_order: 3,
          discount_percentage: 0,
          tax_percentage: 0,
          customer_view: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          name: "Accessories",
          sort_order: 5,
          discount_percentage: 0,
          tax_percentage: 0,
          customer_view: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          name: "Eyeglasses",
          sort_order: 1,
          discount_percentage: 0,
          tax_percentage: 0,
          customer_view: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {
        updateOnDuplicate: ["name", "updatedAt"],
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "p_categories",
      {
        id: {
          [Sequelize.Op.in]: [1, 2, 3, 4, 5],
        },
      },
      {},
    );
  },
};
