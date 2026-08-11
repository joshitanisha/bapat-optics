"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product_Serach_History extends Model {
    static associate(models) {
      Product_Serach_History.belongsTo(models.Users, {
        foreignKey: "user_id",
      });
    }
  }
  Product_Serach_History.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Product_Serach_History",
      tableName: "product_serach_histories",
       paranoid: true, 
      timestamps: true,
    }
  );
  return Product_Serach_History;
};
