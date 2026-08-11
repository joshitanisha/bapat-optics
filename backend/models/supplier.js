"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Supplier.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      contact: DataTypes.STRING,
      password: DataTypes.STRING,
      shope_name: DataTypes.STRING,
      address: DataTypes.STRING,
      bank_details: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
      gst_no: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Supplier",
      tableName: "suppliers",
       paranoid: true, 
      timestamps: true,
    }
  );
  return Supplier;
};
