"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const offer = await queryInterface.describeTable("offers");
    if (!offer.hasOwnProperty("offers")) {
      await queryInterface.addColumn("offers", "message", {
        type: Sequelize.TEXT('long'),
        allowNull: true,
      });
    }

    if (!offer.hasOwnProperty("discount_type_id")) {
      await queryInterface.addColumn("offers", "discount_type_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "discount_types",
          key: "id",
        },
        onUpdate: "CASCADE",
      });
    }

    if (!offer.hasOwnProperty("discount")) {
     await queryInterface.addColumn("offers", "discount", {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("offers", "message");
     await queryInterface.removeColumn("offers", "discount");
      await queryInterface.removeColumn("offers", "discount_type_id");
  },
};
