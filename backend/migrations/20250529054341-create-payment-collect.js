'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payment_collects', {
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
      
      payment_method_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "payment_methods",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    
      
      delivery_boy_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
          as: "delivery_boy",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      
      no_of_item: {
        type: Sequelize.STRING,
        allowNull: true,
      },
       
      total_amount: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_kg: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      
       receive_payment: {
        type: Sequelize.STRING,
        allowNull: true,
      },
       payment_receive_status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      collected_at: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('payment_collects');
  }
};