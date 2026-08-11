"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Receiving_Product extends Model {
    static associate(models) {
      Receiving_Product.belongsTo(models.Product, {
        foreignKey: "product_id",
      });
      Receiving_Product.belongsTo(models.Receiving, {
        foreignKey: "receiving_id",
      });
      Receiving_Product.belongsTo(models.Purchase_Order_Product, {
        foreignKey: "p_o_p_id",
      });

      Receiving_Product.hasMany(models.Product_Variant_Stock, {
        foreignKey: "receiving_product_id",
      });

      Receiving_Product.hasOne(models.Product_Stock, {
        foreignKey: "receiving_product_id",
      });
    }
  }
  Receiving_Product.init(
    {
      quantity: DataTypes.STRING,
      expiry_date: DataTypes.STRING,
      waste_quantity: DataTypes.STRING,
      total_price: DataTypes.DECIMAL,
      price: DataTypes.DECIMAL,
      description: DataTypes.TEXT,
      gst: DataTypes.DECIMAL,
      gst_price: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "Receiving_Product",
      tableName: "receiving_products",
      paranoid: true,
      timestamps: true,
    }
  );
  return Receiving_Product;
};
