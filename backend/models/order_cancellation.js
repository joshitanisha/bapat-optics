'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order_Cancellation extends Model {
    static associate(models) {
      Order_Cancellation.belongsTo(models.Product_Order, {
        foreignKey: 'order_id'
      });
      Order_Cancellation.belongsTo(models.Cancel_Reason, {
        foreignKey: 'cancel_reason_id'
      });
    }
  }
  Order_Cancellation.init({
    message: DataTypes.TEXT,
    status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Order_Cancellation',
    tableName: "order_cancellations",
     paranoid: true, 
    timestamps: true,
  });
  return Order_Cancellation;
};