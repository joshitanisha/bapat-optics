"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("product_order_details", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "product_orders",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "products",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      variant_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "product_variants",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      mrp: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      selling_price: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tax_percentage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_mrp: {
        type: Sequelize.STRING,
        allowNull: true,
      },
       total_selling_price: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_tax: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_amount: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      packing_charges: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      delivery_charges: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_kg: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      coupon_discount: {
        type: Sequelize.STRING,
      },
      offer_discount: {
        type: Sequelize.STRING,
      },
      refer_discount: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("product_order_details");
  },
};
