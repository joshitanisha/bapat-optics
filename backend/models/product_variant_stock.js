"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product_Variant_Stock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Product_Variant_Stock.belongsTo(models.Receiving, {
        foreignKey: "receiving_id",
      });
      Product_Variant_Stock.belongsTo(models.Product, {
        foreignKey: "product_id",
      });

      Product_Variant_Stock.belongsTo(models.Receiving_Product, {
        foreignKey: "receiving_product_id",
      });

      Product_Variant_Stock.belongsTo(models.Product_Variant, {
        foreignKey: "variant_id",
      });

      Product_Variant_Stock.hasMany(models.Stocks, {
        foreignKey: "product_variant_stock_id",
      });
    }
  }
  Product_Variant_Stock.init(
    {
      subscription_stock: DataTypes.STRING,
      general_stock: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Product_Variant_Stock",
      tableName: "product_variant_stocks",
       paranoid: true, 
      timestamps: true, 
    }
  );
  return Product_Variant_Stock;
};
