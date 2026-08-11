'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Time_Slot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Time_Slot.init({
    from: DataTypes.TIME,
    to: DataTypes.TIME,
    status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Time_Slot',
    tableName: "time_slots",
     paranoid: true, 
    timestamps: true,
  });
  return Time_Slot;
};