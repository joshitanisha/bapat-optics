"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      Cart.belongsTo(models.Users, {
        foreignKey: 'user_id'
      });
      Cart.belongsTo(models.Product, {
        foreignKey: 'product_id'
      });
      Cart.belongsTo(models.Product_Variant, {
        foreignKey: 'variant_id'
      });
      
      Cart.hasMany(models.Cart_Detail, {
        foreignKey: 'cart_id'
      });

       Cart.belongsTo(models.Prescriptions, {
        foreignKey: 'prescription_id'
      });
    }
  }
  Cart.init(
    {
      quantity: DataTypes.INTEGER,
      coupon_discount: DataTypes.INTEGER,
      coupon_status: DataTypes.BOOLEAN,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Cart",
      tableName: "carts",
       paranoid: true,
      timestamps: true,
    }
  );
  return Cart;
};
