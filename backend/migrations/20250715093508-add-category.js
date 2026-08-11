"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const productOrder = await queryInterface.describeTable("p_categories");
    if (!productOrder.hasOwnProperty("background_color")) {
      await queryInterface.addColumn("p_categories", "background_color", {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: false,
      });
    }
    if (!productOrder.hasOwnProperty("button_color")) {
      await queryInterface.addColumn("p_categories", "button_color", {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: false,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("p_categories", "background_color");

    await queryInterface.removeColumn("p_categories", "button_color");
  },
};
