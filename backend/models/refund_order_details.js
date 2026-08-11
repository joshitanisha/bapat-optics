"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Refund_Order_Details extends Model {
    static associate(models) {
      Refund_Order_Details.belongsTo(models.Product_Order_Detail, {
        foreignKey: "order_detail_id",
      });

      Refund_Order_Details.belongsTo(models.RefundOrders, {
        foreignKey: "refund_order_id",
      });
    }
  }
  Refund_Order_Details.init(
    {
      refund_amount: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Refund_Order_Details",
      tableName: "refund_order_details",
      paranoid: true,
      timestamps: true,
    }
  );
  return Refund_Order_Details;
};
