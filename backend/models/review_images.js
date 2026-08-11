'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review_Images extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review_Images.belongsTo(models.Rating_Reviews, {
        foreignKey: "rating_id",
      });
    }
  }
  Review_Images.init({
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Review_Images',
    tableName: "review_images",
     paranoid: true, // Enable soft delete
    timestamps: true, // Ensure timestamps are enabled
  });
  return Review_Images;
};