'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      City.belongsTo(models.Country, {
        foreignKey: 'country_id'
      });
      City.belongsTo(models.State, {
        foreignKey: 'state_id'
      });
    
    }
  }
  City.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'City',
    tableName: "cities",
     paranoid: true, // Enable soft delete
    timestamps: true,
  });
  return City;
};