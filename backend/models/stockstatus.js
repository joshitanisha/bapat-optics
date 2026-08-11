"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StockStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StockStatus.hasOne(models.Stocks, {
        foreignKey: "stock_status_id",
      });
    }
  }
  StockStatus.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "StockStatus",
      tableName: "stock_status",
      paranoid: true,
      timestamps: true,
    }
  );
  return StockStatus;
};
