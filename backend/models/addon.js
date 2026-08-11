"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Addon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Addon.init(
    {
      name: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
      image: DataTypes.STRING,
      description: DataTypes.TEXT("long"),
      price: DataTypes.DECIMAL(10, 2),
      mrp: DataTypes.DECIMAL(10, 2),
    },
    {
      sequelize,
      modelName: "Addon",
      tableName: "addons",
      paranoid: true, // Enable soft delete
      timestamps: true,
    }
  );
  return Addon;
};
