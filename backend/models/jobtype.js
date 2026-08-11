'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JobType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      JobType.hasMany(models.Career, {
        foreignKey: 'job_type_id'
      })
    }
  }
  JobType.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'JobType',
    tableName:'jobtypes'
  });
  return JobType;
};