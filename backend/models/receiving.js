"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Receiving extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Receiving.belongsTo(models.Users, {
        foreignKey: "user_id",
      });
      Receiving.belongsTo(models.Supplier, {
        foreignKey: "supplier_id",
      });
      Receiving.belongsTo(models.Purchase_Order, {
        foreignKey: "p_o_id",
      });
      Receiving.hasMany(models.Receiving_Product, {
        foreignKey: "receiving_id",
      });
    }
  }
  Receiving.init(
    {
      quantity: DataTypes.STRING,
      waste_quantity: DataTypes.STRING,
      invoice_no: DataTypes.STRING,
      order_no: DataTypes.STRING,
      batch_no: DataTypes.STRING,
      total_price: DataTypes.DECIMAL,
      status: DataTypes.BOOLEAN,
      base_price: DataTypes.DECIMAL,
      gst: DataTypes.DECIMAL,
      gst_price: DataTypes.DECIMAL,
      wlp: DataTypes.DECIMAL,
      wlpdiscount: DataTypes.DECIMAL,
      wlpdiscountamount: DataTypes.DECIMAL,
      receiving_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Receiving",
      tableName: "receivings",
      paranoid: true, // Enable soft delete
      timestamps: true, // Ensure timestamps are enabled
    }
  );
  return Receiving;
};
