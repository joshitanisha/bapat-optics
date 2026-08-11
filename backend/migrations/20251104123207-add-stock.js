'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   const table = await queryInterface.describeTable("stocks");

    if (!table.hasOwnProperty("stock_id")) {
      await queryInterface.addColumn("stocks", "supplier_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "suppliers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("stocks", "supplier_id");
  }
};
