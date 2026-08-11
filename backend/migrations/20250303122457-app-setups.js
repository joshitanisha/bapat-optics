"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("app_setups", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      website_name: {
        type: Sequelize.STRING,
      },
      logo: {
        type: Sequelize.STRING,
      },
      contact_no: {
        type: Sequelize.STRING,
      },
      alt_contact_no: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      delivery_price: {
        type: Sequelize.STRING,
      },
      reward_discount: {
        type: Sequelize.STRING,
      },
      free_delivery_order_price: {
        type: Sequelize.STRING,
      },
      delivery_time: {
        type: Sequelize.TIME,
      },
      minimum_order: {
        type: Sequelize.STRING,
      },
      delivery_range: {
        type: Sequelize.STRING,
      },
      stock_alert: {
        type: Sequelize.STRING,
      },
      lat: {
        type: Sequelize.STRING,
      },
      refer_by_order: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      refer_to_order: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
       delivery_price_three_kilometer: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      refer_percentage: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      
      long: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("app_setups");
  },
};
