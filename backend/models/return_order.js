"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Return_Order extends Model {
    static associate(models) {
      Return_Order.belongsTo(models.Product_Order, {
        foreignKey: "order_id",
      });
      Return_Order.belongsTo(models.Return_Reason, {
        foreignKey: "return_reason_id",
      });
      Return_Order.belongsTo(models.Users, {
        foreignKey: "delivery_boy_id",
      });
      Return_Order.belongsTo(models.Return_Status, {
        foreignKey: "return_status_id",
      });

      Return_Order.hasOne(models.RefundOrders, {
        foreignKey: "return_order_id",
      });
      Return_Order.belongsTo(models.Payment_Method, {
        foreignKey: "payment_method_id",
      });
      Return_Order.hasMany(models.Return_Order_Details, {
        foreignKey: "return_order_id",
      });
    }
  }
  Return_Order.init(
    {
      total_mrp: DataTypes.STRING,
      total_tax: DataTypes.STRING,
      total_selling_price: DataTypes.STRING,
      total_amount: DataTypes.STRING,
      total_offer_discount: DataTypes.STRING,
      total_coupon_discount: DataTypes.STRING,
      delivery_charges: DataTypes.STRING,
      no_of_item: DataTypes.STRING,
      // payment_proof: DataTypes.STRING,
      // other_image: DataTypes.STRING,
      message: DataTypes.TEXT,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Return_Order",
      tableName: "return_orders",
       paranoid: true, 
      timestamps: true,
    }
  );
  return Return_Order;
};
