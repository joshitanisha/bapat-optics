'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     const ratingraview = await queryInterface.describeTable("product_order_details");
    if (!ratingraview.hasOwnProperty("prescription_id")) {
      await queryInterface.addColumn("product_order_details", "prescription_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "prescriptions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.removeColumn("product_order_details", "prescription_id");
  }
};
