"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const HomeBanner = await queryInterface.describeTable("home_banners");
    if (!HomeBanner.hasOwnProperty("category_id")) {
      await queryInterface.addColumn("home_banners", "category_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "p_categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }

    

    
    const Product = await queryInterface.describeTable("products");

    if (!Product.hasOwnProperty("seasonable_status")) {
      await queryInterface.addColumn("products", "seasonable_status", {
        type: Sequelize.BOOLEAN,
         defaultValue: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("home_banners", "category_id");
  
    
    await queryInterface.removeColumn("products", "seasonable_status");
  },
};
