// "use strict";

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     const statuses = [
//       { id: 1, name: "Replace Requested" },
//       { id: 2, name: "Customer Pickup Scheduled" },
//       { id: 3, name: "Customer Item Picked" },
//       { id: 4, name: "Item Returned" },
//       { id: 5, name: "Replace Item Pickup" },
//       { id: 6, name: "Replace Item Delivered" },
//       { id: 7, name: "Replace Item Rejected" },
//     ];

//     const now = new Date();

//     // Add timestamps to all records
//     const statusesWithTimestamps = statuses.map((status) => ({
//       ...status,
//       createdAt: now,
//       updatedAt: now,
//     }));

//     await queryInterface.bulkInsert(
//       "replace_order_statuses",
//       statusesWithTimestamps,
//       {
//         updateOnDuplicate: ["name", "updatedAt"],
//       }
//     );
//   },

//   async down(queryInterface, Sequelize) {
//     await queryInterface.bulkDelete("replace_order_statuses", {
//       name: [
//         "Replace Requested",
//         "Customer Pickup Scheduled",
//         "Customer Item Picked",
//         "Item Returned",
//         "Replace Item Pickup",
//         "Replace Item Delivered",
//         "Replace Item Rejected",
//       ],
//     });
//   },
// };

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const statuses = [
      { id: 1, name: "Replace Requested" },
      { id: 2, name: "Store Itme Pickup Scheduled" },
      { id: 3, name: "Store Item Picked" },
      // { id: 4, name: "Customer Replace Item" },
      { id: 4, name: "Customer Item Replaced / Store Relace Item Picked" },
      { id: 5, name: "Store Replace Item Delivered" },
      { id: 6, name: "Replace Item Rejected" },
    ];

    const now = new Date();

    // Add timestamps to all records
    const statusesWithTimestamps = statuses.map((status) => ({
      ...status,
      createdAt: now,
      updatedAt: now,
    }));

    await queryInterface.bulkInsert(
      "replace_order_statuses",
      statusesWithTimestamps,
      {
        updateOnDuplicate: ["name", "updatedAt"],
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("replace_order_statuses", {
      name: [
        "Replace Requested",
        "Store Itme Pickup Scheduled",
        "Store Item Picked",
        // "Customer Replace Item",
        "Customer Item Replaced / Store Replace Item Picked",
        "Store Replace Item Delivered",
        "Replace Item Rejected",
      ],
    });
  },
};
