"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Vendors_Delivery_Boy extends Model {
    static associate(models) {
      // Vendors_Delivery_Boy.belongsTo(models.Store_Detail, {
      //   foreignKey: 'store_id'
      // });
      Vendors_Delivery_Boy.belongsTo(models.Users, {
        foreignKey: 'delivery_boy_id'
      });
    }
  }
  Vendors_Delivery_Boy.init(
    {
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Vendors_Delivery_Boy",
      tableName: "venders_delivery_boys",
       paranoid: true, 
      timestamps: true,
    }
  );
  return Vendors_Delivery_Boy;
};
