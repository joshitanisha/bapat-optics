"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product_Waste extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product_Waste.belongsTo(models.Product, {
        foreignKey: "product_id",
      });
    }
  }
  Product_Waste.init(
    {
      quantity: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Product_Waste",
      tableName: "product_wastes",
       paranoid: true, // Enable soft delete
      timestamps: true, // Ensure timestamps are enabled
    }
  );
  return Product_Waste;
};
