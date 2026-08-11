"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Purchase_Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Purchase_Order.belongsTo(models.Users, {
        foreignKey: "user_id",
      });
      Purchase_Order.belongsTo(models.Supplier, {
        foreignKey: "supplier_id",
      });
      Purchase_Order.belongsTo(models.Purchase_Order_Status, {
        foreignKey: "p_o_s_id",
      });
      Purchase_Order.hasMany(models.Purchase_Order_Product, {
        foreignKey: "p_o_id",
      });

    }
  }
  Purchase_Order.init(
    {
      total_quantity: DataTypes.STRING,
      batch_no: DataTypes.STRING,
     
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Purchase_Order",
      tableName: "purchase_orders",
       paranoid: true, 
      timestamps: true,
    }
  );
  return Purchase_Order;
};
