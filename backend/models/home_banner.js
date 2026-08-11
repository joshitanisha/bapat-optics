"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Home_Banner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
       Home_Banner.belongsTo(models.p_category, {
        foreignKey: 'category_id'
      });
    }
  }
  Home_Banner.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      website_image: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Home_Banner",
      tableName: "home_banners",
       paranoid: true, // Enable soft delete
      timestamps: true, // Ensure timestamps are enabled
    }
  );
  return Home_Banner;
};
