"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Return_Reason extends Model {
    static associate(models) {
      Return_Reason.hasOne(models.Return_Order, {
        foreignKey: "return_reason_id",
      });

      Return_Reason.hasOne(models.Replace_Order, {
        foreignKey: "return_reason_id",
      });
    }
  }
  Return_Reason.init(
    {
      name: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Return_Reason",
      tableName: "return_reasons",
       paranoid: true, 
      timestamps: true,
    }
  );
  return Return_Reason;
};
