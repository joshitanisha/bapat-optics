'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('prescription_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      prescription_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "prescriptions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
       eye_unit_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "eye_units",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      vission_type_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "vission_types",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      eye_type_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "eye_types",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      name: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('prescription_details');
  }
};