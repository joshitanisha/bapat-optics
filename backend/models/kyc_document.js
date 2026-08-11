"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Kyc_Document extends Model {
    static associate(models) {
      Kyc_Document.belongsTo(models.Users, {
        foreignKey: "user_id",
      });
    }
  }
  Kyc_Document.init(
    {
      aadhar_no: DataTypes.STRING,
      aadhar_image: DataTypes.STRING,
      driving_license_no: DataTypes.STRING,
      driving_license_image: DataTypes.STRING,
      pan_no: DataTypes.STRING,
      pan_image: DataTypes.STRING,
      is_verified: DataTypes.BOOLEAN,
      status: DataTypes.BOOLEAN,
      pan_back_image: DataTypes.STRING,
      aadhar_back_image: DataTypes.STRING,
      driving_license_back_image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Kyc_Document",
      tableName: "kyc_documents",
       paranoid: true, 
      timestamps: true,
    }
  );
  return Kyc_Document;
};
