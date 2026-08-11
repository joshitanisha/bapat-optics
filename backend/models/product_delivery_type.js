'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product_Delivery_Type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product_Delivery_Type.belongsTo(models.Product, {
        foreignKey: 'product_id'
      });
      Product_Delivery_Type.belongsTo(models.Delivery_Type, {
        foreignKey: 'delivery_type_id'
      });
    }
  }
  Product_Delivery_Type.init({
  
  }, {
    sequelize,
    modelName: 'Product_Delivery_Type',
    tableName: "product_delivery_types",
     paranoid: true, 
    timestamps: true,
  });
  return Product_Delivery_Type;
};