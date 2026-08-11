"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkInsert(
        "home_banners",
        [
          {
            id: 1,
            name: "The Moon Banner",
            image: "/public/assets/images/The-Moon-Home_Banner.jpeg",
            status: true,
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW"),
          },
        ],
        {
          // Add this option to ensure that the existing records are updated
          updateOnDuplicate: ["name", "image", "updatedAt"],
        }
      );
    } catch (error) {
      console.error("Error during up migration: ", error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkDelete(
        "home_banners",
        {
          id: {
            [Sequelize.Op.in]: [1],
          },
        },
        {}
      );
    } catch (error) {
      console.error("Error during down migration: ", error);
      throw error;
    }
  },
};
