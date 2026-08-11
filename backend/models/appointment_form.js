"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Appointment_Form extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Appointment_Form.belongsTo(models.Appointment_Reason, {
        foreignKey: "appointment_reason_id",
      });
      Appointment_Form.belongsTo(models.Appointment_Status, {
        foreignKey: "appointment_status_id",
      });
      Appointment_Form.belongsTo(models.Users, {
        foreignKey: "user_id",
      });
    }
  }
  Appointment_Form.init(
    {
      name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      contact_no: DataTypes.STRING,
      date_of_birth: DataTypes.STRING,
      date: DataTypes.STRING,
      time: DataTypes.TIME,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Appointment_Form",
      tableName: "appointment_forms",
      paranoid: true, // Enable soft delete
      timestamps: true,
    },
  );
  return Appointment_Form;
};
