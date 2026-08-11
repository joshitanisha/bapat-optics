"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product_Variant extends Model {
    static associate(models) {
      Product_Variant.belongsTo(models.Product, {
        foreignKey: "product_id",
      });
      Product_Variant.belongsTo(models.Unit, {
        foreignKey: "unit_id",
      });

      Product_Variant.hasOne(models.Product_Variant_Stock, {
        foreignKey: "variant_id",
      });

      Product_Variant.hasMany(models.Product_Images, {
        foreignKey: "variant_id",
      });
      Product_Variant.belongsTo(models.Colour, {
        foreignKey: "color_id",
      });

      Product_Variant.hasMany(models.Stocks, {
        foreignKey: "variant_id",
      });
    }
  }
  Product_Variant.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      price: DataTypes.STRING,
      mrp: DataTypes.STRING,
      size: DataTypes.STRING,
      barcode: DataTypes.STRING,
      model_no: DataTypes.STRING,
      description: DataTypes.TEXT,
      status: DataTypes.BOOLEAN,

      general_stock: DataTypes.INTEGER,
      // subscription_stock: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Product_Variant",
      tableName: "product_variants",
      paranoid: true,
      timestamps: true,
    }
  );
  return Product_Variant;
};
