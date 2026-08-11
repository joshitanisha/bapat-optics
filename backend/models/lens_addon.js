"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Lense_Addons extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     Lense_Addons.belongsTo(models.Product, {
        foreignKey: "product_id",
      });
    }
  }
  Lense_Addons.init(
    {
      lense_addon_name: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
      lense_addon_price: DataTypes.DECIMAL(10, 2),
      lense_addon_mrp: DataTypes.DECIMAL(10, 2),
    },
    {
      sequelize,
      modelName: "Lense_Addons",
      tableName: "lense_addonss",
      paranoid: true, // Enable soft delete
      timestamps: true,
    }
  );
  return Lense_Addons;
};
