"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Coupon_History extends Model {
    static associate(models) {
      Coupon_History.belongsTo(models.Coupon, {
        foreignKey: 'coupon_id'
      });
      Coupon_History.belongsTo(models.Users, {
        foreignKey: 'user_id'
      });
      Coupon_History.belongsTo(models.Product_Order, {
        foreignKey: 'order_id'
      });
    }
  }
  Coupon_History.init(
    {
      discount_price: DataTypes.DECIMAL(8, 2),
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Coupon_History",
      tableName: "coupon_histories",
       paranoid: true, 
      timestamps: true,
    }
  );
  return Coupon_History;
};
