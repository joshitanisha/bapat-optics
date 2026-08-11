"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const ratingraview = await queryInterface.describeTable("rating_reviews");
    if (!ratingraview.hasOwnProperty("order_detail_id")) {
      await queryInterface.addColumn("rating_reviews", "order_detail_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "product_order_details",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("rating_reviews", "order_detail_id");
  },
};
