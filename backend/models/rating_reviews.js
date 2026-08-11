'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rating_Reviews extends Model {
    static associate(models) {
      Rating_Reviews.belongsTo(models.Product, {
        foreignKey: 'product_id'
      });
      Rating_Reviews.belongsTo(models.Users, {
        foreignKey: 'user_id'
      });
       Rating_Reviews.belongsTo(models.Review_Reason, {
        foreignKey: 'reason_id'
      });
       Rating_Reviews.belongsTo(models.Product_Order, {
        foreignKey: "order_id",
      });

       Rating_Reviews.belongsTo(models.Product_Order_Detail, {
        foreignKey: "order_detail_id",
      });
    }
  }
  Rating_Reviews.init({
    ratings: DataTypes.INTEGER,
    title: DataTypes.STRING,
    review: DataTypes.STRING,
    image: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: "Rating_Reviews",
    tableName: "rating_reviews",
     paranoid: true, 
    timestamps: true,
  });
  return Rating_Reviews;
};