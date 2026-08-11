"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Food_Add_On_Category extends Model {
    static associate(models) {
      Food_Add_On_Category.hasMany(models.Food_Add_On, {
        foreignKey: 'add_on_category_id'
      });
      
    }
  }
  Food_Add_On_Category.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Food_Add_On_Category",
      tableName: "food_add_on_categories",
       paranoid: true, // Enable soft delete
      timestamps: true, // Ensure timestamps are enabled
    }
  );
  return Food_Add_On_Category;
};
