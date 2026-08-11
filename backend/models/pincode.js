'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pincode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Pincode.belongsTo(models.Country, {
        foreignKey: 'country_id'
      });
      Pincode.belongsTo(models.State, {
        foreignKey: 'state_id'
      });
      Pincode.belongsTo(models.City, {
        foreignKey: 'city_id'
      });
      Pincode.hasMany(models.Area, { foreignKey: 'pincode_id' });
    }
  }
  Pincode.init({
    name: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Pincode',
    tableName: "pincodes",
     paranoid: true, // Enable soft delete
    timestamps: true, // Ensure timestamps are enabled

  });
  return Pincode;
};