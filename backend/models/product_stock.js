"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product_Stock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product_Stock.belongsTo(models.Product, {
        foreignKey: "product_id",
      });
      Product_Stock.belongsTo(models.Receiving_Product, {
        foreignKey: "receiving_product_id",
      });
       Product_Stock.belongsTo(models.Receiving, {
        foreignKey: "receiving_id",
      });

        Product_Stock.hasMany(models.Stocks, {
        foreignKey: "product_stock_id",
      });
    }
  }
  Product_Stock.init(
    {
      general_stock: DataTypes.STRING,
      subscription_stock: DataTypes.STRING,

    },
    {
      sequelize,
      modelName: "Product_Stock",
      tableName: "product_stocks",
       paranoid: true, // Enable soft delete
      timestamps: true, // E
    }
  );
  return Product_Stock;
};
