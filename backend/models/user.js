"use strict";
const { Model, DATE } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      Users.belongsTo(models.Roles, {
        foreignKey: "role_id",
      });
      Users.belongsTo(models.Gender, {
        foreignKey: "gender_id",
      });
      Users.belongsTo(models.Country_Code, {
        foreignKey: "country_code_id",
      });
      Users.hasOne(models.Wallet, {
        foreignKey: "user_id",
      });

      Users.hasMany(models.Logs, {
        foreignKey: "user_id",
      });
      Users.hasMany(models.User_Address, {
        foreignKey: "user_id",
      });
      Users.hasMany(models.Product_Order, {
        foreignKey: "user_id",
        as: "customer_orders",
      });
      Users.hasMany(models.Product_Order, {
        foreignKey: "delivery_boy_id",
        as: "delivery_boy_orders",
      });
      // Users.hasOne(models.Subscription, {
      //   foreignKey: "user_id",
      // });
      Users.hasOne(models.Delivery_Boy_Detail, {
        foreignKey: "user_id",
      });
      Users.hasOne(models.Vendors_Delivery_Boy, {
        foreignKey: "delivery_boy_id",
      });
      Users.hasOne(models.Kyc_Document, {
        foreignKey: "user_id",
      });
      Users.hasOne(models.Bank_Detail, {
        foreignKey: "user_id",
      });

      Users.hasMany(models.Payment_Collect, {
        foreignKey: "delivery_boy_id",
      });
      Users.hasMany(models.Product_Order, {
        foreignKey: "user_id",
      });
    }
  }

  Users.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      contact_no: DataTypes.STRING,
      customer_id: DataTypes.STRING,
      image: DataTypes.STRING,
      last_name: DataTypes.STRING,
      password: DataTypes.STRING,
      device_key: DataTypes.STRING,
      alternate_no: DataTypes.STRING,
      refer_code: DataTypes.STRING,
      refer_order_count: DataTypes.STRING,
      description: DataTypes.TEXT,
      date_of_birth: DataTypes.DATE,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Users",
      tableName: "users",
      paranoid: true,
      timestamps: true,
    }
  );

  return Users;
};
