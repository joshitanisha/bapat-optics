"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Face_Width extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Face_Width.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Face_Width",
      tableName: "face_widths",
      paranoid: true,
      timestamps: true,
    }
  );
  return Face_Width;
};
