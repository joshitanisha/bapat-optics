"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkInsert(
        "app_setups",
        [
          {
            id: 1,
            website_name: "bapet Optics",
            logo: "/public/assets/images/logo.png",
            contact_no: "9876543210",
            alt_contact_no: "9876543210",
            email: "bapatoptics@gmail.com",

            address:
              "Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Pune - 411038",
            delivery_range: 5,
            stock_alert: 5,
            lat: 18.5135, // converted to float
            long: 73.7699, // converted to float
            delivery_price: 1,
            reward_discount: 10, // fixed typo
            free_delivery_order_price: 200,
            minimum_order: 400,
            reward_discount: 5,
            low_stock_day: 5,
            delivery_time: "18:00:00", // fixed format
            status: true,
            createdAt: Sequelize.fn("NOW"),
            updatedAt: Sequelize.fn("NOW"),
          },
        ],
        {
          updateOnDuplicate: [
            "website_name",
            "logo",
            "contact_no",
            "alt_contact_no",
            "email",

            "address",
            "delivery_range",
            "stock_alert",
            "lat",
            "long",
            "delivery_price",
            "reward_discount",
            "free_delivery_order_price",
            "minimum_order",
            "delivery_time",
            "status",
            "updatedAt",
          ],
        },
      );
    } catch (error) {
      console.error("Error during up migration: ", error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkDelete(
        "app_setups",
        {
          id: {
            [Sequelize.Op.in]: [1],
          },
        },
        {},
      );
    } catch (error) {
      console.error("Error during down migration: ", error);
      throw error;
    }
  },
};
