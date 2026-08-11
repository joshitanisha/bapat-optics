'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Career_Resume extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Career_Resume.belongsTo(models.Career, {
        foreignKey: 'career_id'
      });

    }
  }
  Career_Resume.init({
    resume: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Career_Resume',
    tableName: 'career_resumes',
     paranoid: true, 
  });
  return Career_Resume;
};