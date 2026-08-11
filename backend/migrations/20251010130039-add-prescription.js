'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("prescriptions");
    
    if (!table.hasOwnProperty("lens_type_id")) {
      await queryInterface.addColumn("prescriptions", "lens_type_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "lens_types",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }

     if (!table.hasOwnProperty("addon_id")) {
      await queryInterface.addColumn("prescriptions", "addon_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "addons",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }
  },

  async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn("prescriptions", "lens_type_id");
  await queryInterface.removeColumn("prescriptions", "addon_id");
  }
};
