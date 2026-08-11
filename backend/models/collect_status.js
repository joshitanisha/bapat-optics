"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Collect_Status extends Model {
   
    static associate(models) {
      // define association here
    }
  }
  Collect_Status.init(
    {
      name: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Collect_Status",
      tableName: "collect_statuses",
       paranoid: true, 
      timestamps: true, 
    }
  );
  return Collect_Status;
};
