"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class About_Us extends Model {
    static associate(models) {}
  }
  About_Us.init(
    {
      content: DataTypes.TEXT,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "About_Us",
      tableName: "about_us",
      paranoid: true, // Enable soft delete
      timestamps: true, // Ensure timestamps are enabled
    }
  );
  return About_Us;
};
