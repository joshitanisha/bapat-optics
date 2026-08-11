"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Stock_Type extends Model {

  }
  Stock_Type.init(
    {
      name: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Stock_Type",
      tableName: "stock_types",
       paranoid: true, 
      timestamps: true, 
    }
  );
  return Stock_Type;
};
