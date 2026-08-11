'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lens_Option extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Lens_Option.init({
    name: DataTypes.STRING,
     status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Lens_Option',
    tableName: "lens_options",
       paranoid: true, 
      timestamps: true,
  });
  return Lens_Option;
};