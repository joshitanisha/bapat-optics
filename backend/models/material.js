"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Material extends Model {
    static associate(models) {
      Material.belongsTo(models.p_category, {
        foreignKey: "category_id",
      });
    }
  }
  Material.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Material",
      tableName: "materials",
      paranoid: true,
      timestamps: true,
    }
  );
  return Material;
};
