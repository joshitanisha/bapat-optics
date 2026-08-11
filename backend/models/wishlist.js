"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    static associate(models) {
      Wishlist.belongsTo(models.Users, {
        foreignKey: 'user_id'
      });
      Wishlist.belongsTo(models.Product, {
        foreignKey: 'product_id'
      });
      Wishlist.belongsTo(models.Product_Variant, {
        foreignKey: 'variant_id'
      });
    }
  }
  Wishlist.init(
    {
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Wishlist",
      tableName: "wishlists",
       paranoid: true, 
      timestamps: true,
    }
  );
  return Wishlist;
};
