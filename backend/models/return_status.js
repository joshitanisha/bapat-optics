"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Return_Status extends Model {

  }
  Return_Status.init(
    {
      name: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Return_Status",
      tableName: "return_status",
       paranoid: true, // Enable soft delete
      timestamps: true, // Ensure timestamps are enabled
    }
  );
  return Return_Status;
};
