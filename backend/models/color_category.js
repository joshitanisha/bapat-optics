"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Color_Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Color_Category.belongsTo(models.p_category, {
        foreignKey: "category_id",
      });
      Color_Category.belongsTo(models.Colour, {
        foreignKey: "color_id",
      });
    }
  }
  Color_Category.init(
    {
      // name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Color_Category",
      tableName: "color_categories",
      paranoid: true,
      timestamps: true,
    }
  );
  return Color_Category;
};
