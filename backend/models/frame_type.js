"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Frame_Type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Frame_Type.init(
    {
      name: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Frame_Type",
      tableName: "frame_types",
      paranoid: true,
      timestamps: true,
    }
  );
  return Frame_Type;
};
