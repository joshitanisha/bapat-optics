"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("wallet_histories");

    if (!table.hasOwnProperty("purchase_amount")) {
      await queryInterface.addColumn("wallet_histories", "purchase_amount", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("wallet_histories", "purchase_amount");
  },
};
