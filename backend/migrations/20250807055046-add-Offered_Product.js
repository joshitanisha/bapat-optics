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
    const offered_products = await queryInterface.describeTable(
      "offered_products"
    );
    if (!offered_products.hasOwnProperty("offer_id")) {
      await queryInterface.addColumn("offered_products", "offer_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "offers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }

    if (!offered_products.hasOwnProperty("name")) {
      await queryInterface.addColumn("offered_products", "name", {
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
    await queryInterface.removeColumn("offered_products", "offer_id");
    await queryInterface.removeColumn("offered_products", "name");
  },
};
