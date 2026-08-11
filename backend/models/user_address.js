"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User_Address extends Model {
    static associate(models) {
      User_Address.belongsTo(models.Users, {
        foreignKey: "user_id",
      });
      User_Address.belongsTo(models.Address_Type, {
        foreignKey: "address_type_id",
      });
      User_Address.belongsTo(models.Country_Code, {
        foreignKey: "country_code_id",
      });
      User_Address.hasOne(models.Users_Address_Details, {
        foreignKey: "user_address_id",
      });
    }
  }
  User_Address.init(
    {
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      building: DataTypes.STRING,
      floor: DataTypes.STRING,
      apartment: DataTypes.STRING,
      street: DataTypes.STRING,
      direction: DataTypes.STRING,
      area: DataTypes.STRING,
      contact_no: DataTypes.STRING,
      lat: DataTypes.STRING,
      long: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "User_Address",
      tableName: "user_addresses",
      paranoid: true, 
      timestamps: true,
    }
  );
  return User_Address;
};
