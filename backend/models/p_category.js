"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class p_category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      p_category.belongsTo(models.Users, {
        foreignKey: "user_id",
      });
      p_category.belongsTo(models.Item_Type, {
        foreignKey: "item_type_id",
      });
      p_category.hasMany(models.p_sub_category, {
        foreignKey: "p_category_id",
      });
      p_category.hasMany(models.p_child_category, {
        foreignKey: "p_category_id",
      });

      p_category.hasMany(models.Product, {
        foreignKey: "p_category_id",
      });
    }
  }
  p_category.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      sort_order: DataTypes.STRING,
      background_color: DataTypes.STRING,
      button_color: DataTypes.STRING,
      tax_percentage: DataTypes.INTEGER,
      discount_percentage: DataTypes.INTEGER,
      eight_plus_status: DataTypes.BOOLEAN,
      status: DataTypes.BOOLEAN,
      customer_view: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "p_category",
      tableName: "p_categories",
      paranoid: true,
      timestamps: true,
    }
  );
  return p_category;
};
