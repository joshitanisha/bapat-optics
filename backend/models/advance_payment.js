"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Advance_Payment extends Model {
  
    static associate(models) {
      Advance_Payment.belongsTo(models.Product_Order, {
        foreignKey: "product_order_id",
      });

      Advance_Payment.belongsTo(models.Payment_Method, {
        foreignKey: "payment_method_id",
      });
    }
  }
  Advance_Payment.init(
    {
      amount: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Advance_Payment",
      tableName: "advance_payments",
      paranoid: true,
      timestamps: true,
    }
  );
  return Advance_Payment;
};
