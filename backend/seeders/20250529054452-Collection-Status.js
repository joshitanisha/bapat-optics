'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    try {
      await queryInterface.bulkInsert(
        "collect_statuses",
        [
          {
            id: 1,
            name: "Accept",
            status: true,
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW"),
          },
          {
            id: 2,
            name: "Reject",
            status: true,
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW"),
          },
        
        ],
        {
          updateOnDuplicate: ["name", "updatedAt"],
        }
      );
    } catch (error) {
      console.error("Error during up migration: ", error);
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     try {
      await queryInterface.bulkDelete(
        "collect_statuses",
        {
          id: {
            [Sequelize.Op.in]: [1,2],
          },
        },
        {}
      );
    } catch (error) {
      console.error("Error during down migration: ", error);
      throw error;
    }
  }
};
