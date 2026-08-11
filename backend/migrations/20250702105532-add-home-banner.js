'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   const homebanner = await queryInterface.describeTable("home_banners");
    if (!homebanner.hasOwnProperty("website_image")) {
      await queryInterface.addColumn(
        "home_banners",
        "website_image",
        {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue:false,
        }
      );
    }
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.removeColumn(
      "home_banners",
      "website_image"
    );
  }
};
