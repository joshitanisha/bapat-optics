'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("bank_details", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      account_no: {
        type: Sequelize.STRING,
        required: true,
      },
      bank_name: {
        type: Sequelize.STRING,
        required: true,
      },
      branch_name: {
        type: Sequelize.STRING,
        required: true,
      },
      bank_address: {
        type: Sequelize.STRING,
        required: true,
      },
      ifsc: {
        type: Sequelize.STRING,
        required: false,
      },
      swift_code: {
        type: Sequelize.STRING,
        required: false,
      },
      national_clearing_code: {
        type: Sequelize.STRING,
        required: false,
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
    await queryInterface.dropTable('bank_details');
  }
};
