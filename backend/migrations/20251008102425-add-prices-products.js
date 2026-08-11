'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("products");
    

     if (!table.hasOwnProperty("mrp")) {
      await queryInterface.addColumn("products", "mrp", {
        type: Sequelize.DECIMAL(20,2),
        defaultValue: 0.00
      });
    }

    if (!table.hasOwnProperty("discount")) {
      await queryInterface.addColumn("products", "discount", {
        type: Sequelize.DECIMAL(20,2),
        defaultValue: 0.00
      });
    }

    if (!table.hasOwnProperty("discount_amount")) {
      await queryInterface.addColumn("products", "discount_amount", {
        type: Sequelize.DECIMAL(20,2),
        defaultValue: 0.00
      });
    }

    if (!table.hasOwnProperty("price")) {
      await queryInterface.addColumn("products", "price", {
        type: Sequelize.DECIMAL(20,2),
        defaultValue: 0.00
      });
    }

    if (!table.hasOwnProperty("tax_amount")) {
      await queryInterface.addColumn("products", "tax_amount", {
        type: Sequelize.DECIMAL(20,2),
        defaultValue: 0.00
      });
    }

    if (!table.hasOwnProperty("base_amount")) {
      await queryInterface.addColumn("products", "base_amount", {
        type: Sequelize.DECIMAL(20,2),
        defaultValue: 0.00
      });
    }

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("products", "mrp");
    await queryInterface.removeColumn("products", "discount");
    await queryInterface.removeColumn("products", "discount_amount");
    await queryInterface.removeColumn("products", "price");
    await queryInterface.removeColumn("products", "tax_amount");
    await queryInterface.removeColumn("products", "base_amount");
  }
};
