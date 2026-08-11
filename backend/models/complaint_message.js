"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Complaint_Message extends Model {
    static associate(models) {
      Complaint_Message.belongsTo(models.Users, {
        foreignKey: 'user_id'
      });
      Complaint_Message.belongsTo(models.Product_Order, {
        foreignKey: 'order_id'
      });
    }
  }
  Complaint_Message.init(
    {
      message: DataTypes.TEXT,
      is_responded: DataTypes.BOOLEAN,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Complaint_Message",
      tableName: "complaint_messages",
       paranoid: true, 
      timestamps: true,
    }
  );
  return Complaint_Message;
};
