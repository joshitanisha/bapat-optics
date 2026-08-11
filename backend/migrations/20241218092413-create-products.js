"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      manufacturer: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      model_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      size: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_measurements: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
      },
      approval_status_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "approval_status",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        defaultValue: "1",
      },

      gender_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "genders",
          key: "id",
        },
        onUpdate: "CASCADE",
      },

      shape_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "shapes",
          key: "id",
        },
        onUpdate: "CASCADE",
      },

      material_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "materials",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      frame_type_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "frame_types",
          key: "id",
        },
        onUpdate: "CASCADE",
      },

       face_width_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "face_widths",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      tax_percentage: {
        type: Sequelize.STRING,
      },

      is_returnable: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      return_days: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      allowed_quanitity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      p_category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "p_categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      brand_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "brands",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      made_in_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "countries",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      stock_type_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "stock_types",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      customer_view: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("products");
  },
};
