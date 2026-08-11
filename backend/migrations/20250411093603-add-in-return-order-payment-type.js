"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    const tableDescription = await queryInterface.describeTable(
      "return_orders"
    );

    

    if (!tableDescription.hasOwnProperty("amount")) {
      await queryInterface.addColumn("return_orders", "amount", {
        type: Sequelize.STRING,
        defaultValue: 0,
        allowNull: true,
      });
    }

    if (!tableDescription.hasOwnProperty("payment_proof")) {
      await queryInterface.addColumn("return_orders", "payment_proof", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!tableDescription.hasOwnProperty("other_image")) {
      await queryInterface.addColumn("return_orders", "other_image", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    
    await queryInterface.removeColumn("return_orders", "amount");
    await queryInterface.removeColumn("return_orders", "payment_proof");
    await queryInterface.removeColumn("return_orders", "other_image");
  },
};
