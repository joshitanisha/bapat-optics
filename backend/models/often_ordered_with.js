"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Often_Ordered_With extends Model {
    static associate(models) {
      Often_Ordered_With.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: "main_product"
      });
      Often_Ordered_With.belongsTo(models.Product, {
        foreignKey: 'linked_product_id',
        as: "linked_product"
      });
    }
  }
  Often_Ordered_With.init(
    {
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Often_Ordered_With",
      tableName: "often_ordered_with",
       paranoid: true, 
      timestamps: true,
    }
  );
  return Often_Ordered_With;
};
