"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Wallet_History extends Model {
    static associate(models) {
      Wallet_History.belongsTo(models.Wallet, {
        foreignKey: "wallet_id",
      });

      Wallet_History.belongsTo(models.Product_Order, {
        foreignKey: "order_id",
      });

      Wallet_History.belongsTo(models.Transaction_Type, {
        foreignKey: "transaction_type_id",
      });
    }
  }
  Wallet_History.init(
    {
      type: DataTypes.ENUM("Purchase", "Referral"),
      amount: DataTypes.STRING,
      transaction_id: DataTypes.STRING,
      description: DataTypes.STRING,
      purchase_amount: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Wallet_History",
      tableName: "wallet_histories",
      paranoid: true, // Enable soft delete
      timestamps: true, // Ensure timestamps are enabled
    }
  );
  return Wallet_History;
};
