"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order_Payment_Detail extends Model {
    static associate(models) {
      Order_Payment_Detail.belongsTo(models.Product_Order, {
        foreignKey: "order_id",
      });
      Order_Payment_Detail.belongsTo(models.Users, {
        foreignKey: "delivery_boy_id",
      });
      Order_Payment_Detail.belongsTo(models.Payment_Method, {
        foreignKey: "payment_method_id",
      });

  
    }
  }
  Order_Payment_Detail.init(
    {
      payment_proof: DataTypes.STRING,
      other_image: DataTypes.STRING,
      payment_id: DataTypes.STRING,
      message: DataTypes.STRING,
      amount: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Order_Payment_Detail",
      tableName: "order_payment_details",
      paranoid: true,
      timestamps: true,
    }
  );
  return Order_Payment_Detail;
};
