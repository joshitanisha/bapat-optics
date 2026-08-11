"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Coupon_Type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Coupon_Type.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Coupon_Type",
      tableName: "coupon_types",
      paranoid: true,
      timestamps: true,
    }
  );
  return Coupon_Type;
};
