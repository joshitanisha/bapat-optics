'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cancel_Reason extends Model {
    static associate(models) {

    }
  }
  Cancel_Reason.init({
    name: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Cancel_Reason',
    tableName: "cancel_reasons",
     paranoid: true, // Enable soft delete
    timestamps: true,
  });
  return Cancel_Reason;
};