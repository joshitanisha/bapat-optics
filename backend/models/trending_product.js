"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Trending_Product extends Model {
    static associate(models) {
      Trending_Product.belongsTo(models.Product, {
        foreignKey: "product_id",
      });
      Trending_Product.belongsTo(models.Gender, {
        foreignKey: "gender_id",
      });
    }
  }
  Trending_Product.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Trending_Product",
      tableName: "trending_products",
      paranoid: true,
      timestamps: true,
    }
  );
  return Trending_Product;
};
