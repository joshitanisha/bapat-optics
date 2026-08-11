"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("products");

    if (!table.hasOwnProperty("lens_type_id")) {
      await queryInterface.addColumn("products", "lens_type_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "lens_types",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }

    if (!table.hasOwnProperty("lens_category_id")) {
      await queryInterface.addColumn("products", "lens_category_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "lens_categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }

    if (!table.hasOwnProperty("color_id")) {
      await queryInterface.addColumn("products", "color_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "colours",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }

    if (!table.hasOwnProperty("lens_color_id")) {
      await queryInterface.addColumn("products", "lens_color_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "colours",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }

    if (!table.hasOwnProperty("bo_code")) {
      await queryInterface.addColumn("products", "bo_code", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (!table.hasOwnProperty("index")) {
      await queryInterface.addColumn("products", "index", {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: true,
      });
    }
    if (!table.hasOwnProperty("coating_name")) {
      await queryInterface.addColumn("products", "coating_name", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (!table.hasOwnProperty("water_content")) {
      await queryInterface.addColumn("products", "water_content", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (!table.hasOwnProperty("base_curve")) {
      await queryInterface.addColumn("products", "base_curve", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (!table.hasOwnProperty("diameter")) {
      await queryInterface.addColumn("products", "diameter", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (!table.hasOwnProperty("modality")) {
      await queryInterface.addColumn("products", "modality", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (!table.hasOwnProperty("dk_t")) {
      await queryInterface.addColumn("products", "dk_t", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("products", "lens_type_id");
    await queryInterface.removeColumn("products", "lens_category_id");
    await queryInterface.removeColumn("products", "color_id");
    await queryInterface.removeColumn("products", "lens_color_id");
    await queryInterface.removeColumn("products", "bo_code");
    await queryInterface.removeColumn("products", "modality");
    await queryInterface.removeColumn("products", "index");
    await queryInterface.removeColumn("products", "coating_name");
    await queryInterface.removeColumn("products", "water_content");
    await queryInterface.removeColumn("products", "base_curve");
    await queryInterface.removeColumn("products", "diameter");
    await queryInterface.removeColumn("products", "dk_t");
  },
};
