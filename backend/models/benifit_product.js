"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Benifit_Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Benifit_Product.belongsTo(models.Offered_Product, {
        foreignKey: "offered_product_id",
      });
      Benifit_Product.belongsTo(models.Product, {
        foreignKey: "product_id",
      });
    }
  }
  Benifit_Product.init(
    {},
    {
      sequelize,
      modelName: "Benifit_Product",
      tablenName: "benifit_products",
      paranoid: true,
      timestamps: true,
    }
  );
  return Benifit_Product;
};
