"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Vission_Type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Vission_Type.init(
    {
      name: DataTypes.STRING,
       status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Vission_Type",
      tableName: "vission_types",
      paranoid: true, 
      timestamps: true,
    }
  );
  return Vission_Type;
};
