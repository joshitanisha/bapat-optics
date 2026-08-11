"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product_Order_Detail extends Model {
    static associate(models) {
      Product_Order_Detail.belongsTo(models.Product_Order, {
        foreignKey: "order_id",
      });
      Product_Order_Detail.belongsTo(models.Product, {
        foreignKey: "product_id",
      });
      Product_Order_Detail.belongsTo(models.Product_Variant, {
        foreignKey: "variant_id",
      });

      Product_Order_Detail.hasOne(models.Rating_Reviews, {
        foreignKey: "order_detail_id",
      });
      Product_Order_Detail.belongsTo(models.Prescriptions, {
        foreignKey: "prescription_id",
      });
      Product_Order_Detail.belongsTo(models.Stocks, {
        foreignKey: "stock_id",
      });
       Product_Order_Detail.belongsTo(models.Stocks, {
        foreignKey: "lense_stock_id",
        as:"Lens_Stock"
      });
    }
  }
  Product_Order_Detail.init(
    {
      quantity: DataTypes.INTEGER,
      mrp: DataTypes.STRING,
      invoice_no: DataTypes.STRING,
      tax_percentage: DataTypes.STRING,
      total_mrp: DataTypes.STRING,
      total_tax: DataTypes.STRING,
      total_amount: DataTypes.STRING,
      coupon_discount: DataTypes.STRING,
      offer_discount: DataTypes.STRING,
      delivery_charges: DataTypes.STRING,
      packing_charges: DataTypes.STRING,
      refer_discount: DataTypes.STRING,
      selling_price: DataTypes.STRING,
      total_selling_price: DataTypes.STRING,
      total_kg: DataTypes.STRING,
      batch_no: DataTypes.STRING,
      expiry_date: DataTypes.STRING,
      reward_discount: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
      return_status: DataTypes.BOOLEAN,
      total_addon_price: DataTypes.DECIMAL(10, 2),
      total_lense_price: DataTypes.DECIMAL(10, 2),
      total_discount: DataTypes.DECIMAL(10, 2),
    },
    {
      sequelize,
      modelName: "Product_Order_Detail",
      tableName: "product_order_details",
      paranoid: true,
      timestamps: true,
    }
  );
  return Product_Order_Detail;
};
