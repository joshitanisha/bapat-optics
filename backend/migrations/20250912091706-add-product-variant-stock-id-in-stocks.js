"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
  
    const offer = await queryInterface.describeTable("stocks");
    if (!offer.hasOwnProperty("stocks")) {
      await queryInterface.addColumn("stocks", "product_variant_stock_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "product_variant_stocks",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });

    }
  },

  async down(queryInterface, Sequelize) {
    
    await queryInterface.removeColumn("product_variant_stock_id");
  },
};
