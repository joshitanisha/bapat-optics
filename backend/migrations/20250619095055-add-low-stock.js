'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const order = await queryInterface.describeTable("product_order_details");
    if (!order.hasOwnProperty("product_orders_details")) {
      await queryInterface.addColumn(
        "product_order_details",
        "expiry_date",
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      );
    }

    const appsetup = await queryInterface.describeTable("app_setups");
    if (!appsetup.hasOwnProperty("app_setups")) {
      await queryInterface.addColumn(
        "app_setups",
        "low_stock_day",
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      );
    }
    
    if (!appsetup.hasOwnProperty("customer_limit")) {
      await queryInterface.addColumn(
        "app_setups",
        "customer_limit",
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      );
    }

    if (!appsetup.hasOwnProperty("refer_to_percentage")) {
      await queryInterface.addColumn(
        "app_setups",
        "refer_to_percentage",
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      );
    }
     const product = await queryInterface.describeTable("products");
      if (!product.hasOwnProperty("products")) {
      await queryInterface.addColumn(
        "products",
        "expity_date_days",
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      );
    }
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn(
      "product_order_details",
      "expiry_date"
    );
      await queryInterface.removeColumn(
      "products",
      "expity_date_days"
    );
      await queryInterface.removeColumn(
      "app_setups",
      "low_stock_day"
    );
      await queryInterface.removeColumn(
      "app_setups",
      "customer_limit"
    );
      await queryInterface.removeColumn(
      "app_setups",
      "refer_to_percentage"
    );
  }
};
