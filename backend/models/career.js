'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Career extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Career.hasMany(models.Career_language, {
        foreignKey: 'career_id'
      });

      Career.hasMany(models.Career_Qualification, {
        foreignKey: 'career_id'
      });


      Career.belongsTo(models.JobType, {
        foreignKey: 'job_type_id'
      });

      Career.belongsTo(models.Shift, {
        foreignKey: 'shift_type_id'
      });


      // Career.hasOne(models.JobType, {
      //   foreignKey: 'id'
      // });

      // Career.hasOne(models.Shift, {
      //   foreignKey: 'id'
      // });

    }
  }
  Career.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    skill: DataTypes.STRING,
    job_location: DataTypes.STRING,
    role_permission: DataTypes.STRING,
    hr_name: DataTypes.STRING,
    recruiter_email: DataTypes.STRING,
    recruiter_contact_number: DataTypes.INTEGER,
    start_annual_package: DataTypes.DECIMAL,
    end_annual_package: DataTypes.DECIMAL,
    company_name: DataTypes.STRING,
    vacancy: DataTypes.STRING,
    image: DataTypes.STRING,
    experience_from: DataTypes.INTEGER,
    experience_to: DataTypes.INTEGER,
    deadline: DataTypes.DATE

  }, {
    sequelize,
    modelName: 'Career',
    tableName: 'career',
    paranoid: true
  });
  return Career;
};