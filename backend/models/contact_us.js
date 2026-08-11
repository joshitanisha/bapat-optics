'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contact_us extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Contact_us.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    message: DataTypes.STRING,
    number: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Contact_us',
    tableName:'contact_us',
    paranoid:true,
  });
  return Contact_us;
};