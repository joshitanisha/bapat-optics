"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("appointment_forms");

    if (!table.hasOwnProperty("date")) {
      await queryInterface.addColumn("appointment_forms", "date", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("appointment_forms", "date");
  },
};
