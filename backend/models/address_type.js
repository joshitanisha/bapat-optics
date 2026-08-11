"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Address_Type extends Model {
    static associate(models) {

    }
  }
  Address_Type.init(
    {
      name: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Address_Type",
      tableName: "address_types",
      paranoid: true,
      timestamps: true,
    }
  );
  return Address_Type;
};
