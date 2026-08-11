"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("products");
    if (!table.hasOwnProperty("available_stock")) {
      await queryInterface.addColumn("products", "available_stock", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    if (!table.hasOwnProperty("top_status")) {
      await queryInterface.addColumn("products", "top_status", {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      });
    }

    if (!table.hasOwnProperty("tranding_status")) {
      await queryInterface.addColumn("products", "tranding_status", {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      });
    }

    if (!table.hasOwnProperty("barcode_status")) {
      await queryInterface.addColumn("products", "barcode_status", {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: 1,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("products", "available_stock");
    await queryInterface.removeColumn("products", "tranding_status");
    await queryInterface.removeColumn("products", "top_status");
    await queryInterface.removeColumn("products", "barcode_status");
  },
};
