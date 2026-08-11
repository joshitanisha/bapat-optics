'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "order_status",
      [
        {
          id: 1,
          name: "Pending",
        
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "Processing",
        
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: "Pickup Scheduled",
        
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          name: "Shipped",
        
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          name: "Delivered",
         
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          name: "Cancelled",
        
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          name: "Returned",
          
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 8,
          name: "Refunded",
        
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 9,
          name: "Replaced",
         
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 10,
          name: "Rejected",
          
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 11,
          name: "Reorder",
          
          createdAt: new Date(),
          updatedAt: new Date(),
        },

          {
          id: 12,
          name: "Packing",
        
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {
        // Add this option to ensure that the existing records are updated
        updateOnDuplicate: ["name", "updatedAt"],
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "order_status",
      {
        id: {
          [Sequelize.Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        },
      },
      {}
    );
  }
};
