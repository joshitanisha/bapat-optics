'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Career_language extends Model {

    static associate(models) {
      Career_language.belongsTo(models.Career, {
        foreignKey: 'career_id'
      });

      Career_language.belongsTo(models.Language, {
        foreignKey: 'language_id'
      });


    }
  }
  Career_language.init({
  }, {
    sequelize,
    modelName: 'Career_language',
    tableName: 'career_languages',
    paranoid: true
  });
  return Career_language;
};