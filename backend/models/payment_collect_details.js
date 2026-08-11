"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payment_Collect_Details extends Model {
    static associate(models) {
      Payment_Collect_Details.belongsTo(models.Product_Order_Detail, {
        foreignKey: "order_details_id",
      });
      Payment_Collect_Details.belongsTo(models.Product, {
        foreignKey: "product_id",
      });
      Payment_Collect_Details.belongsTo(models.Product_Variant, {
        foreignKey: "variant_id",
      });
      Payment_Collect_Details.belongsTo(models.Collect_Status, {
        foreignKey: "collection_status_id",
      });

      Payment_Collect_Details.belongsTo(models.Payment_Collect, {
        foreignKey: "payment_collect_id",
      });
    }
  }
  Payment_Collect_Details.init(
    {
      quantity: DataTypes.INTEGER,

      total_amount: DataTypes.STRING,
      receive_payment: DataTypes.STRING,

      total_kg: DataTypes.STRING,
      payment_status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Payment_Collect_Details",
      tableName: "payment_collect_details",
       paranoid: true, 
      timestamps: true,
    }
  );
  return Payment_Collect_Details;
};
