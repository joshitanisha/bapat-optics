'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Faq_Category extends Model {
    static associate(models) {
      Faq_Category.hasMany(models.Faq, {
        foreignKey: 'faq_category_id'
      });
    }
  }
  Faq_Category.init({
    name: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Faq_Category',
    tableName: "faq_categories",
     paranoid: true, 
    timestamps: true,
  });
  return Faq_Category;
};