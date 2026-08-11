'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order_Add_On extends Model {
    static associate(models) {
      Order_Add_On.belongsTo(models.Product_Order_Detail, {
        foreignKey: 'order_detail_id'
      });
      Order_Add_On.belongsTo(models.Food_Add_On, {
        foreignKey: 'add_on_id'
      });
    }
  }
  Order_Add_On.init({
    status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Order_Add_On',
    tableName: "order_add_on",
     paranoid: true, 
    timestamps: true,
  });
  return Order_Add_On;
};