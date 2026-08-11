"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Stock_History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Stock_History.belongsTo(models.Stocks, {
        foreignKey: "stock_id",
      });
    }
  }
  Stock_History.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Stock_History",
      tableName: "stock_histories",
      paranoid: true, // Enable soft delete
      timestamps: true,
    }
  );
  return Stock_History;
};
