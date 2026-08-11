"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Offer extends Model {
   
    static associate(models) {
      Offer.belongsTo(models.Discount_Type, {
        foreignKey: "discount_type_id",
      });

       Offer.hasMany(models.Offered_Product, {
        foreignKey: "offer_id",
      });
    }
  }
  Offer.init(
    {
      sort_order: DataTypes.INTEGER,
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      discount: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Offer",
      tableName: "offers",
      paranoid: true,
      timestamps: true,
    }
  );
  return Offer;
};
