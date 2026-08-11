"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("suppliers");
    if (!table.hasOwnProperty("gst_no")) {
      await queryInterface.addColumn("suppliers", "gst_no", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("suppliers", "gst_no");
  },
};
