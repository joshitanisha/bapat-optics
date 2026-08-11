'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('suppliers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
     name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
       contact: {
        type: Sequelize.STRING
      },
      shope_name: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
       bank_details: {
        type: Sequelize.STRING
      },

      pincode_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "pincodes",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
       
      password: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('suppliers');
  }
};