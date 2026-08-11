'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart_Detail extends Model {
    static associate(models) {
      Cart_Detail.belongsTo(models.Cart, {
        foreignKey: 'cart_id'
      });
     
    }
  }
  Cart_Detail.init({
    add_on_quantity: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Cart_Detail',
    tableName: "cart_details",
     paranoid: true, 
    timestamps: true,
  });
  return Cart_Detail;
};