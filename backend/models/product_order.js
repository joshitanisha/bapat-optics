"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product_Order extends Model {
    static associate(models) {
      Product_Order.belongsTo(models.Users, {
        foreignKey: "user_id",
      });
      Product_Order.belongsTo(models.Users, {
        foreignKey: "delivery_boy_id",
        as: "delivery_boy",
      });

      Product_Order.belongsTo(models.Order_status, {
        foreignKey: "order_status_id",
      });
      Product_Order.belongsTo(models.Delivery_Type, {
        foreignKey: "delivery_type_id",
      });
      // Product_Order.belongsTo(models.Pack_Type, {
      //   foreignKey: "pack_type_id",
      // });

      Product_Order.belongsTo(models.User_Address, {
        foreignKey: "address_id",
      });
      Product_Order.hasMany(models.Product_Order_Detail, {
        foreignKey: "order_id",
      });
      Product_Order.hasOne(models.Order_History, {
        foreignKey: "order_id",
      });
      Product_Order.hasOne(models.Order_Payment_Detail, {
        foreignKey: "order_id",
      });
      Product_Order.hasOne(models.Order_Rejection, {
        foreignKey: "order_id",
      });
      Product_Order.hasOne(models.Return_Order, {
        foreignKey: "order_id",
      });

      Product_Order.hasOne(models.RefundOrders, {
        foreignKey: "order_id",
      });

      Product_Order.hasOne(models.Replace_Order, {
        foreignKey: "order_id",
      });
      Product_Order.hasOne(models.Order_Otp, {
        foreignKey: "order_id",
      });
      Product_Order.belongsTo(models.Payment_Method, {
        foreignKey: "payment_method_id",
      });
      Product_Order.belongsTo(models.Time_Slot, {
        foreignKey: "time_slot_id",
      });
      Product_Order.hasOne(models.Rating_Reviews, {
        foreignKey: "order_id",
      });
      Product_Order.belongsTo(models.Tax_Type, {
        foreignKey: "tax_type_id",
      });

      Product_Order.hasOne(models.Deliveryboy_Rating, {
        foreignKey: "order_id",
      });

      Product_Order.hasOne(models.Order_Cancellation, {
        foreignKey: "order_id",
      });
      Product_Order.hasMany(models.Advance_Payment, {
        foreignKey: "product_order_id",
      });

    }
  }
  Product_Order.init(
    {
      invoice_no: DataTypes.STRING,
      invoice: DataTypes.STRING,
      razorpay_order_id: DataTypes.STRING,
      total_mrp: DataTypes.STRING,
      total_selling_price: DataTypes.STRING,
      total_tax: DataTypes.STRING,
      total_amount: DataTypes.STRING,
      total_coupon_discount: DataTypes.STRING,
      total_offer_discount: DataTypes.STRING,
      total_refer_discount: DataTypes.STRING,
      delivery_date: DataTypes.DATE,
      expiry_date: DataTypes.DATE,
      no_of_item: DataTypes.STRING,
      delivery_charges: DataTypes.STRING,
      packing_charges: DataTypes.STRING,
      total_kg: DataTypes.STRING,
      cancel_reason: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
      deliveryboy_payment_status: DataTypes.BOOLEAN,
      deliveryboy_payment: DataTypes.STRING,
      total_kilometer: DataTypes.STRING,
      return_on_of_item: DataTypes.INTEGER,
      cancel_on_of_item: DataTypes.INTEGER,
      reward_discount: DataTypes.STRING,
      total_addon_price: DataTypes.DECIMAL(10, 2),
      total_lense_price: DataTypes.DECIMAL(10, 2),
      total_discount: DataTypes.DECIMAL(10, 2),
      gst_number: DataTypes.STRING,
      doctor_name: DataTypes.STRING,
      discount_percentage: DataTypes.INTEGER,
      tax_percentage: DataTypes.INTEGER,
      lens_discount: DataTypes.STRING,
      lens_mrp: DataTypes.STRING,
      lens_tax: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Product_Order",
      tableName: "product_orders",
      paranoid: true, // Enable soft delete
      timestamps: true, // Ensure timestamps are enabled
    },
  );
  return Product_Order;
};
