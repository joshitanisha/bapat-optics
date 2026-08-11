"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Colour extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
       Colour.belongsTo(models.p_category, {
        foreignKey: "category_id",
      });
       Colour.hasMany(models.Color_Category, {
        foreignKey: "color_id",
      });
    }
  }
  Colour.init(
    {
      name: DataTypes.STRING,
      first_color: DataTypes.STRING,
      second_color: DataTypes.STRING,
      image: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Colour",
      tableName: "colours",
      paranoid: true,
      timestamps: true,
    }
  );
  return Colour;
};
