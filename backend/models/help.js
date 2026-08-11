'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Help extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Help.init({
    content: DataTypes.STRING,
     status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Help',
      tableName: "help",
       paranoid: true, // Enable soft delete
      timestamps: true, 
  });
  return Help;
};