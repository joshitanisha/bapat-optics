"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product_Images extends Model {
    static associate(models) {
      Product_Images.belongsTo(models.Product, {
        foreignKey: 'product_id'
      });
    }
  }
  Product_Images.init(
    {
      image: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Product_Images",
      tableName: "product_images",
       paranoid: true, // Enable soft delete
      timestamps: true, // Ensure timestamps are enabled
    }
  );
  return Product_Images;
};
