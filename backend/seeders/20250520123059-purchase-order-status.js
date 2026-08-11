'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await queryInterface.bulkInsert(
        "purchase_order_statuses",
        [
          {
            id: 1,
            name: "New Order",
            status: true,
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW"),
          },
          {
            id: 2,
            name: "Requested",
            status: true,
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW"),
          },
          {
            id: 3,
            name: "Ordered",
            status: true,
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW"),
          },      
            {
            id: 4,
            name: "Pending Delivery",
            status: true,
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW"),
          },
          {
            id: 5,
            name: "Received",
            status: true,
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW"),
          },
          {
            id: 6,
            name: "Canceled",
            status: true,
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW"),
          },      
        ],
        {
          updateOnDuplicate: ["name", "updatedAt"],
        }
      );
    } catch (error) {
      console.error("Error during up migration: ", error);
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
     try {
      await queryInterface.bulkDelete(
        "purchase_order_statuses",
        {
          id: {
            [Sequelize.Op.in]: [1,2,3,4,5,6],
          },
        },
        {}
      );
    } catch (error) {
      console.error("Error during down migration: ", error);
      throw error;
    }
  }
};
