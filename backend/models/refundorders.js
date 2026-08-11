"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RefundOrders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RefundOrders.belongsTo(models.Product_Order, {
        foreignKey: "order_id",
      });
      RefundOrders.belongsTo(models.Users, {
        foreignKey: "user_id",
      });
      RefundOrders.belongsTo(models.Return_Order, {
        foreignKey: "return_order_id",
      });

      RefundOrders.hasMany(models.Refund_Order_Details, {
        foreignKey: "refund_order_id",
      });
     
    }
  }
  RefundOrders.init(
    {
      payment_status: DataTypes.BOOLEAN,
      refund_amount: DataTypes.STRING,
      c_scanner: DataTypes.STRING,
      c_remark: DataTypes.STRING,
      message: DataTypes.TEXT,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "RefundOrders",
      tableName: "refund_orders",
       paranoid: true, 
      timestamps: true,
    }
  );
  return RefundOrders;
};
