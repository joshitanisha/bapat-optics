"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.Users, {
        foreignKey: "user_id",
      });
      Notification.belongsTo(models.Product_Order, {
        foreignKey: "order_id",
      });
    }
  }
  Notification.init(
    {
      message: DataTypes.TEXT("long"),
      image: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Notification",
      tableName: "notifications",
      paranoid: true,
      timestamps: true,
    },
  );
  return Notification;
};
