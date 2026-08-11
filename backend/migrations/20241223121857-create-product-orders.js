"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("product_orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      order_status_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "order_status",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      delivery_type_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "delivery_types",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      payment_method_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "payment_methods",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      // pack_type_id: {
      //   type: Sequelize.INTEGER,
      //   allowNull: true,
      //   references: {
      //     model: "pack_types",
      //     key: "id",
      //   },
      //   onUpdate: "CASCADE",
      //   onDelete: "SET NULL",
      // },
      address_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "user_addresses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      delivery_boy_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
          as: "delivery_boy",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      time_slot_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "time_slots",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      invoice_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      invoice: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      no_of_item: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_mrp: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_selling_price: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      packing_charges: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      delivery_charges: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_tax: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_amount: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_kg: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_offer_discount: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_refer_discount: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_coupon_discount: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      delivery_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      expiry_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      razorpay_order_id: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable("product_orders");
  },
};
