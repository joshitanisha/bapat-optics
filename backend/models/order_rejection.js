'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order_Rejection extends Model {
    static associate(models) {
      Order_Rejection.belongsTo(models.Product_Order, {
        foreignKey: 'order_id'
      });
      Order_Rejection.belongsTo(models.Reject_Reason, {
        foreignKey: 'reject_reason_id'
      });
    }
  }
  Order_Rejection.init({
    message: DataTypes.TEXT,
    status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Order_Rejection',
    tableName: "order_rejections",
     paranoid: true, 
    timestamps: true,
  });
  return Order_Rejection;
};