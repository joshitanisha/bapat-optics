"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Header_News extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Header_News.init(
    {
      name: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Header_News",
      tableName: "header_news",
      paranoid: true,
      timestamps: true,
    }
  );
  return Header_News;
};
