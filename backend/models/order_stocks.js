"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderStocks extends Model {
    static associate(models) {
      OrderStocks.belongsTo(models.Product_Order_Detail, {
        foreignKey: "order_details_id",
      });
      OrderStocks.belongsTo(models.Stocks, {
        foreignKey: "stock_id",
      });
    }
  }
  OrderStocks.init(
    {
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "OrderStocks",
      tableName: "order_stocks",
      paranoid: true,
      timestamps: true,
    }
  );
  return OrderStocks;
};
