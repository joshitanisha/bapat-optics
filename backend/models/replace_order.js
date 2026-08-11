"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Replace_Order extends Model {
    static associate(models) {
      Replace_Order.belongsTo(models.Product_Order, {
        foreignKey: "order_id",
      });
      Replace_Order.belongsTo(models.Return_Reason, {
        foreignKey: "return_reason_id",
      });
      Replace_Order.belongsTo(models.ReplaceOrderStatus, {
        foreignKey: "replace_order_status_id",
      });
      Replace_Order.belongsTo(models.Users, {
        foreignKey: "delivery_boy_id",
      });
    }
  }
  Replace_Order.init(
    {
      message: DataTypes.TEXT,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Replace_Order",
      tableName: "replace_orders",
       paranoid: true, 
      timestamps: true,
    }
  );
  return Replace_Order;
};
