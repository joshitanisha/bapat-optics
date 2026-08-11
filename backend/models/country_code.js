'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Country_Code extends Model {
    static associate(models) {
      Country_Code.belongsTo(models.Country, {
        foreignKey: 'country_id'
      });
    }
  }
  Country_Code.init({
    country_code: DataTypes.STRING,
    name: DataTypes.STRING,
    no_length: DataTypes.INTEGER,
    flag: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Country_Code',
    tableName: "country_codes",
     paranoid: true, // Enable soft delete
    timestamps: true,
  });
  return Country_Code;
};