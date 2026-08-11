"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {


  class Logs extends Model {

    static associate(models) {
      Logs.belongsTo(models.Users, {
        foreignKey: 'user_id'
      });
    }
  }
  Logs.init(
    {
      ip: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Logs",
      tableName: "logs",
       paranoid: true, // Enable soft delete
      timestamps: true, // Ensure timestamps are enabled
    }
  );
  return Logs;
};
