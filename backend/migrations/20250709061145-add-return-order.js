"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const returnOrder = await queryInterface.describeTable("return_orders");
    if (!returnOrder.hasOwnProperty("no_of_item")) {
      await queryInterface.addColumn("return_orders", "no_of_item", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (!returnOrder.hasOwnProperty("total_mrp")) {
      await queryInterface.addColumn("return_orders", "total_mrp", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (!returnOrder.hasOwnProperty("total_coupon_discount")) {
      await queryInterface.addColumn("return_orders", "total_coupon_discount", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (!returnOrder.hasOwnProperty("total_selling_price")) {
      await queryInterface.addColumn("return_orders", "total_selling_price", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (!returnOrder.hasOwnProperty("total_offer_discount")) {
      await queryInterface.addColumn("return_orders", "total_offer_discount", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (!returnOrder.hasOwnProperty("total_amount")) {
      await queryInterface.addColumn("return_orders", "total_amount", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!returnOrder.hasOwnProperty("total_tax")) {
      await queryInterface.addColumn("return_orders", "total_tax", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (!returnOrder.hasOwnProperty("delivery_charges")) {
      await queryInterface.addColumn("return_orders", "delivery_charges", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("return_orders", "no_of_item");
    await queryInterface.removeColumn("return_orders", "delivery_charges");
    await queryInterface.removeColumn("return_orders", "total_coupon_discount");
    await queryInterface.removeColumn("return_orders", "total_offer_discount");
    await queryInterface.removeColumn("return_orders", "total_amount");
    await queryInterface.removeColumn("return_orders", "total_tax");
    await queryInterface.removeColumn("return_orders", "total_selling_price");
    await queryInterface.removeColumn("return_orders", "total_mrp");
  },
};
