'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Appointment_Status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Appointment_Status.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Appointment_Status',
    tableName: "appointment_statuses",
    // paranoid: true, // Enable soft delete
    timestamps: true,
  });
  return Appointment_Status;
};