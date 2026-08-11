"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Vission_Mission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Vission_Mission.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      logo: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Vission_Mission",
      tableName: "vission_missions",
       paranoid: true, 
      timestamps: true,
    }
  );
  return Vission_Mission;
};
