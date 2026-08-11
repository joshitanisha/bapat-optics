"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const order = await queryInterface.describeTable("product_orders");
    if (!order.hasOwnProperty("deliveryboy_payment_status")) {
      await queryInterface.addColumn(
        "product_orders",
        "deliveryboy_payment_status",
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        }
      );
    }

    if (!order.hasOwnProperty("deliveryboy_payment")) {
      await queryInterface.addColumn("product_orders", "deliveryboy_payment", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    const deliveryboy = await queryInterface.describeTable(
      "delivery_boy_details"
    );
    if (!deliveryboy.hasOwnProperty("payment")) {
      await queryInterface.addColumn("delivery_boy_details", "payment", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      "product_orders",
      "deliveryboy_payment_status"
    );
    await queryInterface.removeColumn("product_orders", "deliveryboy_payment");
    await queryInterface.removeColumn("delivery_boy_details", "payment");
  },
};
