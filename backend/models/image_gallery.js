"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Image_Gallery extends Model {
  }
  Image_Gallery.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Image_Gallery",
      tableName: "image_gallery",
       paranoid: true, // Enable soft delete
      timestamps: true, // Ensure timestamps are enabled
    }
  );
  return Image_Gallery;
};
