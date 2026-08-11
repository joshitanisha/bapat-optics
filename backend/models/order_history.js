"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order_History extends Model {
    static associate(models) {
      Order_History.belongsTo(models.Product_Order, {
        foreignKey: "order_id",
      });
    }
  }
  Order_History.init(
    {
      delivery_boy_assigned: DataTypes.DATE,
      out_for_delivery: DataTypes.DATE,
      deliveredAt: DataTypes.DATE,
      cancelledAt: DataTypes.DATE,
      returnRequestedAt: DataTypes.DATE,
      returnScheduledAt: DataTypes.DATE,
      itemPickedAt: DataTypes.DATE,
      returnedAt: DataTypes.DATE,
      processedAt: DataTypes.DATE,
      refundedAt: DataTypes.DATE,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Order_History",
      tableName: "order_histories",
      paranoid: true,
      timestamps: true,
    }
  );
  return Order_History;
};
