"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("prescriptions");

    if (!table.hasOwnProperty("a_size")) {
      await queryInterface.addColumn("prescriptions", "a_size", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (!table.hasOwnProperty("b_size")) {
      await queryInterface.addColumn("prescriptions", "b_size", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (!table.hasOwnProperty("dbl")) {
      await queryInterface.addColumn("prescriptions", "dbl", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (!table.hasOwnProperty("fh")) {
      await queryInterface.addColumn("prescriptions", "fh", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("prescriptions", "a_size");
    await queryInterface.removeColumn("prescriptions", "b_size");
    await queryInterface.removeColumn("prescriptions", "dbl");
    await queryInterface.removeColumn("prescriptions", "fh");
  },
};
