'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bank_Detail extends Model {
    static associate(models) {
      Bank_Detail.belongsTo(models.Users, {
        foreignKey: 'user_id'
      });
    }
  }
  Bank_Detail.init({
    account_no: DataTypes.STRING,
    bank_name: DataTypes.STRING,
    branch_name: DataTypes.STRING,
    bank_address: DataTypes.STRING,
    ifsc: DataTypes.STRING,
    swift_code: DataTypes.STRING,
    national_clearing_code: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Bank_Detail',
    tableName: "bank_details",
     paranoid: true, 
    timestamps: true,
  });
  return Bank_Detail;
};