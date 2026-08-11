"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Purchase_Order_Product extends Model {
    static associate(models) {
      Purchase_Order_Product.belongsTo(models.Users, {
        foreignKey: "user_id",
      });
      Purchase_Order_Product.belongsTo(models.Product, {
        foreignKey: "product_id",
      });
      Purchase_Order_Product.belongsTo(models.Purchase_Order, {
        foreignKey: "p_o_id",
      });
    }
  }
  Purchase_Order_Product.init(
    {
      quantity: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Purchase_Order_Product",
      tableName: "purchase_order_products",
      paranoid: true,
      timestamps: true,
    }
  );
  return Purchase_Order_Product;
};
