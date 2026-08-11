"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("product_order_details");

    if (!table.hasOwnProperty("stock_id")) {
      await queryInterface.addColumn("product_order_details", "stock_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "stocks",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }

    if (!table.hasOwnProperty("lense_stock_id")) {
      await queryInterface.addColumn(
        "product_order_details",
        "lense_stock_id",
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "stocks",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
      );
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("product_order_details", "stock_id");
    await queryInterface.removeColumn(
      "product_order_details",
      "lense_stock_id",
    );
  },
};
