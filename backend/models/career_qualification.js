'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Career_Qualification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Career_Qualification.belongsTo(models.Career, {
        foreignKey: 'career_id'
      });



      Career_Qualification.belongsTo(models.Qualification, {
        foreignKey: 'qualification_id'
      });
    }
  }
  Career_Qualification.init({
  }, {
    sequelize,
    modelName: 'Career_Qualification',
    tableName: 'career_qualifications',
    paranoid: true
  });
  return Career_Qualification;
};