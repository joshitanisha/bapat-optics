"use strict";

module.exports = {
  // async up(queryInterface, Sequelize) {
  //   try {
  //     await queryInterface.bulkInsert('jobtypes', [
  //       {
  //         id: 1,
  //         name: 'Full Time',
  //         createdAt: new Date(),
  //         updatedAt: new Date()
  //       },
  //       {
  //         id: 2,
  //         name: 'Part Time',
  //         createdAt: new Date(),
  //         updatedAt: new Date()
  //       }

  //     ], {});
  //   } catch (error) {
  //     console.error("Error during up migration: ", error);
  //     throw error;
  //   }
  // },

  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "buy_withs",
      [
        {
          id: 1,
          name: "Full Time",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "Part Time",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {
        // Add this option to ensure that the existing records are updated
        updateOnDuplicate: ["name", "updatedAt"],
      }
    );
  },
  // async down(queryInterface, Sequelize) {
  //   try {
  //     await queryInterface.bulkDelete(
  //       "jobtypes",
  //       {
  //         id: {
  //           [Sequelize.Op.in]: [1, 2],
  //         },
  //       },
  //       {}
  //     );
  //   } catch (error) {
  //     console.error("Error during down migration: ", error);
  //     throw error;
  //   }
  // },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "jobtypes",
      {
        id: {
          [Sequelize.Op.in]: [1, 2],
        },
      },
      {}
    );
  },
};
