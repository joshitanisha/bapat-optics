'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_histories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      delivery_boy_assigned: {
        allowNull: true,
        type: Sequelize.DATE
      },
      out_for_delivery: {
        allowNull: true,
        type: Sequelize.DATE
      },
      deliveredAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      cancelledAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      returnRequestedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      returnScheduledAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      itemPickedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      returnedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
       processedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      refundedAt: {
        allowNull: true,
        type: Sequelize.DATE
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
    await queryInterface.dropTable('order_histories');
  }
};
