"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Eyeq extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Eyeq.init(
    {
      name: DataTypes.STRING,
      sort_order: DataTypes.INTEGER,
      image: DataTypes.STRING,
      description: DataTypes.TEXT,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Eyeq",
      tableName: "eyeqs",
      paranoid: true,
      timestamps: true,
    }
  );
  return Eyeq;
};
