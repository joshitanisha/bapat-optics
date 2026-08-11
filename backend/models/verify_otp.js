"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class verify_otp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      verify_otp.belongsTo(models.Contact_Type, {
        foreignKey: 'contact_type_id'
      });
    }
  }
  verify_otp.init(
    {
      email: DataTypes.STRING,
      contact_no: DataTypes.STRING,
      otp: DataTypes.BIGINT,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "VerifyOtp",
      tableName: "verifyotps",
       paranoid: true, // Enable soft delete
      timestamps: true, // Ensure timestamps are enabled
    }
  );
  return verify_otp;
};
