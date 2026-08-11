"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Delivery_Boy_Detail extends Model {
    static associate(models) {
      Delivery_Boy_Detail.belongsTo(models.Users, {
        foreignKey: 'user_id'
      });
      Delivery_Boy_Detail.belongsTo(models.Country, {
        foreignKey: 'country_id'
      });
      Delivery_Boy_Detail.belongsTo(models.State, {
        foreignKey: 'state_id'
      });
      Delivery_Boy_Detail.belongsTo(models.City, {
        foreignKey: 'city_id'
      });
      Delivery_Boy_Detail.belongsTo(models.Pincode, {
        foreignKey: 'pincode_id'
      });
      Delivery_Boy_Detail.belongsTo(models.Approval_Status, {
        foreignKey: 'approval_status_id'
      });
    }
  }
  Delivery_Boy_Detail.init(
    {
      image: DataTypes.STRING,
      lat: DataTypes.STRING,
      long: DataTypes.STRING,
      // area: DataTypes.TEXT,
      // address: DataTypes.TEXT,
      // commission: DataTypes.FLOAT,
      status: DataTypes.BOOLEAN,
      payment: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Delivery_Boy_Detail",
      tableName: "delivery_boy_details",
       paranoid: true, 
      timestamps: true,
    }
  );
  return Delivery_Boy_Detail;
};
