"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Privacy_Policy extends Model {
    static associate(models) {
    }
  }
  Privacy_Policy.init(
    {
      content: DataTypes.TEXT,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Privacy_Policy",
      tableName: "privacy_policy",
       paranoid: true, // Enable soft delete
      timestamps: true, // Ensure timestamps are enabled
    }
  );
  return Privacy_Policy;
};
