'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('coupons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
     
      name: {
        type: Sequelize.STRING
      },
      code: {
        type: Sequelize.STRING,
      },
      discount_type_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "discount_types",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      discount: {
        type: Sequelize.DECIMAL(8, 2),
      },
      required_amount: {
        type: Sequelize.DECIMAL(8, 2),
      },
      message: {
        type: Sequelize.STRING,
      },
      info: {
        type: Sequelize.STRING,
      },
      use_per_coupon: {
        type: Sequelize.INTEGER,
      },
      use_per_customer: {
        type: Sequelize.INTEGER,
      },
      image: {
        type: Sequelize.STRING,
      },
      s_date: {
        type: Sequelize.STRING,
      },
      e_date: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('coupons');
  }
};
