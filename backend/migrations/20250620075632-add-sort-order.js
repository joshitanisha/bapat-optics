'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     const category = await queryInterface.describeTable("p_categories");
    if (!category.hasOwnProperty("p_categories")) {
      await queryInterface.addColumn(
        "p_categories",
        "sort_order",
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        }
      );
    }
     const subcategory = await queryInterface.describeTable("p_sub_categories");
    if (!subcategory.hasOwnProperty("p_sub_categories")) {
      await queryInterface.addColumn(
        "p_sub_categories",
        "sort_order",
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        }
      );
    }

     const childcategory = await queryInterface.describeTable("p_child_categories");
    if (!childcategory.hasOwnProperty("p_child_categories")) {
      await queryInterface.addColumn(
        "p_child_categories",
        "sort_order",
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        }
      );
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      "p_categories",
      "sort_order"
    );
    await queryInterface.removeColumn(
      "p_sub_categories",
      "sort_order"
    );
    await queryInterface.removeColumn(
      "p_child_categories",
      "sort_order"
    );
  }
};
