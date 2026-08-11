"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Supplier_Return_Details extends Model {
    static associate(models) {
      Supplier_Return_Details.belongsTo(models.Stocks, {
        foreignKey: "stock_id",
      });
      Supplier_Return_Details.belongsTo(models.Product, {
        foreignKey: "product_id",
      });
      Supplier_Return_Details.belongsTo(models.Supplier, {
        foreignKey: "supplier_id",
      });

      Supplier_Return_Details.belongsTo(models.Replace_status, {
        foreignKey: "replace_status_id",
      });
    }
  }
  Supplier_Return_Details.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT("long"),
    },
    {
      sequelize,
      modelName: "Supplier_Return_Details",
      tableName: "supplier_return_details",
      paranoid: true,
      timestamps: true,
    }
  );
  return Supplier_Return_Details;
};
