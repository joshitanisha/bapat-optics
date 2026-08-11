"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("leans_details", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      mrp: {
        allowNull: true,
        type: Sequelize.DECIMAL(10, 2),
      },
      price: {
        allowNull: true,
        type: Sequelize.DECIMAL(10, 2),
      },
      discount: {
        allowNull: true,
        type: Sequelize.DECIMAL(10, 2),
      },
      coupon_discount: {
        allowNull: true,
        type: Sequelize.DECIMAL(10, 2),
      },
      quantity: {
        allowNull: true,
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("leans_details");
  },
};
