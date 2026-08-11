'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('kyc_documents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      aadhar_no: {
        type: Sequelize.STRING,
        allowNull: true
      },
      aadhar_image: {
        type: Sequelize.STRING,
        allowNull: true
      },
      driving_license_no: {
        type: Sequelize.STRING,
        allowNull: true
      },
      driving_license_image: {
        type: Sequelize.STRING,
        allowNull: true
      },
      pan_no: {
        type: Sequelize.STRING,
        allowNull: true
      },
      pan_image: {
        type: Sequelize.STRING,
        allowNull: true
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
    await queryInterface.dropTable("kyc_documents");
  }
};
