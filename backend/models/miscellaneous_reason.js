"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Miscellaneous_Reason extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Miscellaneous_Reason.init(
    {
      name: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Miscellaneous_Reason",
      tableName: "miscellaneous_reasons",
       paranoid: true, 
      timestamps: true,
    }
  );
  return Miscellaneous_Reason;
};
