"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Brand_Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Brand_Category.belongsTo(models.Brand, {
        foreignKey: "brand_id",
      });

      Brand_Category.belongsTo(models.p_category, {
        foreignKey: "category_id",
      });
    }
  }
  Brand_Category.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Brand_Category",
      tableName: "brand_categories",
      paranoid: true, // Enable soft delete
      timestamps: true, // Ensure timestamps are enabled
    }
  );
  return Brand_Category;
};
