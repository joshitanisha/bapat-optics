"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Terms_And_Condition extends Model {
    static associate(models) {
    }
  }
  Terms_And_Condition.init(
    {
      content: DataTypes.TEXT,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Terms_And_Condition",
      tableName: "terms_and_conditions",
       paranoid: true, // Enable soft delete
      timestamps: true, // Ensure timestamps are enabled
    }
  );
  return Terms_And_Condition;
};
