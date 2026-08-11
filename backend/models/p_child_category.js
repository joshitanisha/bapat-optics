'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class p_child_category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      p_child_category.belongsTo(models.p_category, {
        foreignKey: 'p_category_id'
      });
      p_child_category.belongsTo(models.p_sub_category, {
        foreignKey: 'p_sub_category_id'
      });
    }
  }
  p_child_category.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    p_category_id: DataTypes.BIGINT,
    p_sub_category_id: DataTypes.BIGINT,
    status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'p_child_category',
    tableName: "p_child_categories",
     paranoid: true, // Enable soft delete
    timestamps: true,
  });
  return p_child_category;
};