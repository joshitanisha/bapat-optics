'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Faq extends Model {
    static associate(models) {
      Faq.belongsTo(models.Faq_Category, {
        foreignKey: 'faq_category_id'
      });
    }
  }
  Faq.init({
    question: DataTypes.STRING,
    answer: DataTypes.TEXT,
    status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Faq',
    tableName: "faqs",
     paranoid: true, 
    timestamps: true,
  });
  return Faq;
};