'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class All_Banner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     All_Banner.belongsTo(models.Banner_Type, {
        foreignKey: 'banner_type_id'
      });

      All_Banner.belongsTo(models.p_category, {
        foreignKey: 'category_id'
      });
    }
  }
  All_Banner.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'All_Banner',
    tableName: "all_banners",
    paranoid: true,
    timestamps: true,
  });
  return All_Banner;
};