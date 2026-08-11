"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Food_Add_On extends Model {
    static associate(models) {
      Food_Add_On.belongsTo(models.Food_Add_On_Category, {
        foreignKey: 'add_on_category_id'
      });
    
    }

  }
  Food_Add_On.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      price: DataTypes.DECIMAL(8, 2),
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Food_Add_On",
      tableName: "food_add_on",
       paranoid: true, // Enable soft delete
      timestamps: true, // Ensure timestamps are enabled
    }
  );
  return Food_Add_On;
};
