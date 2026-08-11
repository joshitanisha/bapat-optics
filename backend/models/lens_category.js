"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LensCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  LensCategory.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "LensCategory",
      tableName: "lens_categories",
      paranoid: true,
      timestamps: true,
    }
  );
  return LensCategory;
};
