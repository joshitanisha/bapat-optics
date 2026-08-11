'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reject_Reason extends Model {
    static associate(models) {

    }
  }
  Reject_Reason.init({
    name: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Reject_Reason',
    tableName: "reject_reasons",
     paranoid: true, // Enable soft delete
    timestamps: true,
  });
  return Reject_Reason;
};