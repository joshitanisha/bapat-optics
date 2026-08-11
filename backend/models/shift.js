'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shift extends Model {
   
    static associate(models) {
      // define association here
      Shift.hasMany(models.Career, {
        foreignKey: 'shift_type_id'
      });
    }
  }
  Shift.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Shift',
    tableName:'shift'
  });
  return Shift;
};