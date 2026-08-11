'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Eye_Unit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Eye_Unit.init({
    name: DataTypes.STRING,
     status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Eye_Unit',
    tableName: "eye_units",
       paranoid: true, 
      timestamps: true,
  });
  return Eye_Unit;
};