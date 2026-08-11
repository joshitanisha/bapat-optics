"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Offered_Product extends Model {
    static associate(models) {
      // Associating Offered_Product with Store_Detail

      Offered_Product.belongsTo(models.Product, {
        foreignKey: "product_id",
      });
      Offered_Product.belongsTo(models.Discount_Type, {
        foreignKey: "discount_type_id",
      });
      Offered_Product.belongsTo(models.Offer, {
        foreignKey: "offer_id",
      });
      Offered_Product.hasMany(models.Benifit_Product, {
        foreignKey: "offered_product_id",
      });
    }
  }

  Offered_Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      discount: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Offered_Product",
      tableName: "offered_products",
      paranoid: true, 
      timestamps: true,
    }
  );

  return Offered_Product;
};
