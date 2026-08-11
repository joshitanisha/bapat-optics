"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const product = await queryInterface.describeTable("products");
    if (!product.hasOwnProperty("tax_type_id")) {
      await queryInterface.addColumn("products", "tax_type_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "tax_types",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }

    const productOrder = await queryInterface.describeTable("product_orders");
    if (!productOrder.hasOwnProperty("tax_type_id")) {
      await queryInterface.addColumn("product_orders", "tax_type_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "tax_types",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }

    const appsetup = await queryInterface.describeTable("app_setups");
    if (!appsetup.hasOwnProperty("pincode_id")) {
      await queryInterface.addColumn("app_setups", "pincode_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "pincodes",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }

      if (!appsetup.hasOwnProperty("state_id")) {
      await queryInterface.addColumn("app_setups", "state_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "states",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("products", "tax_type_id");

    await queryInterface.removeColumn("product_orders", "tax_type_id");

    await queryInterface.removeColumn("app_setups", "pincode_id");
    await queryInterface.removeColumn("app_setups", "state_id");
  },
};
