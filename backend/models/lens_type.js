"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LensType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  LensType.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "LensType",
      tableName: "lens_types",
      paranoid: true,
      timestamps: true,
    }
  );
  return LensType;
};
