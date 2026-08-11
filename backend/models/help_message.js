"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Help_Message extends Model {
    static associate(models) {
      Help_Message.belongsTo(models.Users, {
        foreignKey: 'user_id'
      });
      Help_Message.belongsTo(models.Product_Order, {
        foreignKey: 'order_id'
      });
      
    }
  }
  Help_Message.init(
    {
      message: DataTypes.TEXT,
      is_responded: DataTypes.BOOLEAN,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Help_Message",
      tableName: "help_messages",
       paranoid: true, 
      timestamps: true,
    }
  );
  return Help_Message;
};
