'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Eye_Type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Eye_Type.init({
    name: DataTypes.STRING,
     status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Eye_Type',
    tableName: "vission_types",
       paranoid: true, 
      timestamps: true,
  });
  return Eye_Type;
};