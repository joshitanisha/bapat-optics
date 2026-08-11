'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("wallet_histories");
    if (!table.hasOwnProperty("order_id")) {
      await queryInterface.addColumn("wallet_histories", "order_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "product_orders",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }

   
    if (!table.hasOwnProperty("transaction_type_id")) {
      await queryInterface.addColumn("wallet_histories", "transaction_type_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "transaction_types",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("wallet_histories", "transaction_type_id");
  }
};
