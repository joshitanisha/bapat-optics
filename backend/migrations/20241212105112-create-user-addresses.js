'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_addresses', {
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
      address_type_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "address_types",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      first_name: {
        type: Sequelize.STRING,
         allowNull: true,
      },
      last_name: {
        type: Sequelize.STRING,
         allowNull: true,
      },
      building: {
        type: Sequelize.STRING,
         allowNull: true,
      },
      floor: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      apartment: {
        type: Sequelize.STRING,
         allowNull: true,
      },
      street: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      direction: {
        type: Sequelize.STRING,
         allowNull: true,
      },
      contact_no: {
        type: Sequelize.STRING,
         allowNull: true,
      },
      lat: {
        type: Sequelize.STRING,
         allowNull: true,
      },
      long: {
        type: Sequelize.STRING,
         allowNull: true,
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
    await queryInterface.dropTable('user_addresses');
  }
};
