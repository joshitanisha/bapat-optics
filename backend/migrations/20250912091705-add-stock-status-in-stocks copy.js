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
    const offer = await queryInterface.describeTable("stocks");
    if (!offer.hasOwnProperty("stocks")) {
      await queryInterface.addColumn("stocks", "stock_status_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "stock_status",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
    await queryInterface.removeColumn("stock_status", "stock_status_id");
  },
};
