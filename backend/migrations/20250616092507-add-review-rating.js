'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const review = await queryInterface.describeTable("rating_reviews");
    if (!review.hasOwnProperty("order_id")) {
      await queryInterface.addColumn("rating_reviews", "order_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "product_orders",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("rating_reviews", "order_id");
  }
};
