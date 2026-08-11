'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order_Otp extends Model {
  
    static associate(models) {
       Order_Otp.belongsTo(models.Product_Order, {
        foreignKey: 'order_id'
      });
    }
  }
  Order_Otp.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order_Otp',
    tableName: "order_otps",
     paranoid: true, 
    timestamps: true,
  });
  return Order_Otp;
};