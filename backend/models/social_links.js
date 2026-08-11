"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Social_Link extends Model {

    static associate(models) {

    }
  }
  Social_Link.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      url: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Social_Link",
      tableName: "social_links",
       paranoid: true, // Enable soft delete
      timestamps: true, // Ensure timestamps are enabled
    }
  );
  return Social_Link;
};
