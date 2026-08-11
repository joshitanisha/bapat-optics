"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "prescription_masters",
      (() => {
        const data = [];
        let id = 1;

        // ✅ Negative values (-20 to -0.25)
        for (let i = -20; i < 0; i += 0.25) {
          data.push({
            id: id++,
            name: i.toFixed(2),
            // type: "power", 
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }

      
        data.push({
          id: id++,
          name: "0.00",
          // type: "power",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

       
        for (let i = 0.25; i <= 20; i += 0.25) {
          data.push({
            id: id++,
            name: `+${i.toFixed(2)}`,
            // type: "power",
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }

        // ✅ Axis values (0 to 180)
        for (let i = 0; i <= 180; i++) {
          data.push({
            id: id++,
            name: i.toString(),
            // type: "axis", // optional (helps differentiate)
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }

        return data;
      })(),
      {
        updateOnDuplicate: ["name", "updatedAt"],
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "prescription_masters",
      {
        id: {
          [Sequelize.Op.in]: [1, 2, 3, 4],
        },
      },
      {},
    );
  },
};
