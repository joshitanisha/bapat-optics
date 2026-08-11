"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Stocks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Stocks.belongsTo(models.Product, {
        foreignKey: "product_id",
      });

      Stocks.belongsTo(models.Product_Variant, {
        foreignKey: "variant_id",
      });

      Stocks.belongsTo(models.StockStatus, {
        foreignKey: "stock_status_id",
      });

      Stocks.belongsTo(models.Product_Variant_Stock, {
        foreignKey: "product_variant_stock_id",
      });
      Stocks.belongsTo(models.Product_Stock, {
        foreignKey: "product_stock_id",
      });

      Stocks.belongsTo(models.Supplier, {
        foreignKey: "supplier_id",
      });

      Stocks.hasMany(models.Stock_History, {
        foreignKey: "stock_id",
      });
    }
  }
  Stocks.init(
    {
      barcode: DataTypes.STRING,
      barcode_no: DataTypes.INTEGER,
      model: DataTypes.STRING,
      barcode_status: DataTypes.BOOLEAN,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Stocks",
      tableName: "stocks",
      paranoid: true,
      timestamps: true,
    }
  );
  return Stocks;
};
