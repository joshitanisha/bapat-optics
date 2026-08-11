'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Store_Banner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Store_Banner.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING,
     status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Store_Banner',
      tableName: "store_banners",
     paranoid: true, // Enable soft delete
    timestamps: true,
  });
  return Store_Banner;
};