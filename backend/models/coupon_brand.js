"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Coupon_Brand extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     Coupon_Brand.belongsTo(models.Coupon, {
        foreignKey: 'coupon_id'
      });
      Coupon_Brand.belongsTo(models.Brand, {
        foreignKey: 'brand_id'
      });
    }
  }
  Coupon_Brand.init(
    {
      
    },
    {
      sequelize,
      modelName: "Coupon_Brand",
      tableName: "coupon_brands",
      paranoid: true, // Enable soft delete
      timestamps: true,
    }
  );
  return Coupon_Brand;
};
