"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Doctor_Details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Doctor_Details.belongsTo(models.Users, {
        foreignKey: "user_id",
      });
       Doctor_Details.belongsTo(models.p_category, {
        foreignKey: 'category_id'
      });
    }
  }
  Doctor_Details.init(
    {
      designation: DataTypes.STRING,
      degree: DataTypes.STRING,
      expirence: DataTypes.STRING,
      doctor_code: DataTypes.STRING,
      commission: DataTypes.STRING,
      hospital_name: DataTypes.STRING,
      specialization: DataTypes.STRING,
      address: DataTypes.STRING,
      time: DataTypes.STRING,
      fees: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Doctor_Details",
      tableName: "doctor_details",
       paranoid: true, 
      timestamps: true,
    }
  );
  return Doctor_Details;
};
