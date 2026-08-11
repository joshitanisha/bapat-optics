"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const coupons = await queryInterface.describeTable("coupons");
    if (!coupons.hasOwnProperty("brand_id")) {
      await queryInterface.addColumn("coupons", "brand_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "brands",
          key: "id",
        },
        onUpdate: "CASCADE",
      });
    }

    if (!coupons.hasOwnProperty("category_id")) {
      await queryInterface.addColumn("coupons", "category_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "p_categories",
          key: "id",
        },
        onUpdate: "CASCADE",
      });
    }

    if (!coupons.hasOwnProperty("coupon_type_id")) {
      await queryInterface.addColumn("coupons", "coupon_type_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "coupon_types",
          key: "id",
        },
        onUpdate: "CASCADE",
      });
    }

    if (!coupons.hasOwnProperty("date_status")) {
      await queryInterface.addColumn("coupons", "date_status", {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("coupons", "category_id");
    await queryInterface.removeColumn("coupons", "brand_id");
    await queryInterface.removeColumn("coupons", "coupon_type_id");
    await queryInterface.removeColumn("coupons", "date_status");
  },
};
