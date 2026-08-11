'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const cart = await queryInterface.describeTable("carts");
    if (!cart.hasOwnProperty("prescription_id")) {
      await queryInterface.addColumn("carts", "prescription_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "prescriptions",
          key: "id",
        },
        onUpdate: "CASCADE",
       
      });
    }
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn("carts", "prescription_id");
  }
};
