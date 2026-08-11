"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("product_orders");

    if (!table.hasOwnProperty("discount_percentage")) {
      await queryInterface.addColumn("product_orders", "discount_percentage", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    if (!table.hasOwnProperty("tax_percentage")) {
      await queryInterface.addColumn("product_orders", "tax_percentage", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    const tablePrescription =
      await queryInterface.describeTable("prescriptions");
    if (!tablePrescription.hasOwnProperty("selling_price")) {
      await queryInterface.addColumn("prescriptions", "selling_price", {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      });
    }
    if (!tablePrescription.hasOwnProperty("mrp")) {
      await queryInterface.addColumn("prescriptions", "mrp", {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      });
    }
    if (!tablePrescription.hasOwnProperty("coupon_discount")) {
      await queryInterface.addColumn("prescriptions", "coupon_discount", {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      });
    }
    if (!tablePrescription.hasOwnProperty("discount")) {
      await queryInterface.addColumn("prescriptions", "discount", {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      });
    }
    if (!tablePrescription.hasOwnProperty("tax_amount")) {
      await queryInterface.addColumn("prescriptions", "tax_amount", {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      });
    }

    if (!tablePrescription.hasOwnProperty("lense_discount_percentage")) {
      await queryInterface.addColumn(
        "prescriptions",
        "lense_discount_percentage",
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
      );
    }

    if (!tablePrescription.hasOwnProperty("lense_tax_percentage")) {
      await queryInterface.addColumn("prescriptions", "lense_tax_percentage", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("product_orders", "tax_percentage");
    await queryInterface.removeColumn("product_orders", "discount_percentage");
    await queryInterface.removeColumn(
      "prescriptions",
      "lense_discount_percentage",
    );
    await queryInterface.removeColumn("prescriptions", "lense_tax_percentage");

    await queryInterface.removeColumn("prescriptions", "selling_price");

    await queryInterface.removeColumn("prescriptions", "mrp");
    await queryInterface.removeColumn("prescriptions", "coupon_discount");
    await queryInterface.removeColumn("prescriptions", "discount");
    await queryInterface.removeColumn("prescriptions", "tax_amount");
  },
};
