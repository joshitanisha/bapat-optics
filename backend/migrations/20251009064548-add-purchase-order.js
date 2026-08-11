"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("purchase_order_products");
    if (!table.hasOwnProperty("description")) {
      await queryInterface.addColumn("purchase_order_products", "description", {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }

    const table1 = await queryInterface.describeTable("receiving_products");
    if (!table1.hasOwnProperty("description")) {
      await queryInterface.addColumn("receiving_products", "description", {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }

    const table3 = await queryInterface.describeTable("product_stocks");
    if (!table3.hasOwnProperty("receiving_product_id")) {
      await queryInterface.addColumn("product_stocks", "receiving_product_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "receiving_products",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }

    if (!table3.hasOwnProperty("receiving_id")) {
      await queryInterface.addColumn("product_stocks", "receiving_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "receivings",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }

     const table4 = await queryInterface.describeTable("stocks");
    if (!table3.hasOwnProperty("product_stock_id")) {
      await queryInterface.addColumn("stocks", "product_stock_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "product_stocks",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("purchase_order_products", "description");
    await queryInterface.removeColumn("receiving_products", "description");
    await queryInterface.removeColumn("product_stocks", "receiving_id");
    await queryInterface.removeColumn("product_stocks", "receiving_product_id");
    await queryInterface.removeColumn("stocks", "product_stock_id");
  },
};
