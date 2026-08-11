'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Deliveryboy_Rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Deliveryboy_Rating.belongsTo(models.Product, {
        foreignKey: 'product_id'
      });
      Deliveryboy_Rating.belongsTo(models.Users, {
        foreignKey: 'user_id',
        as:"customer"
      });
       Deliveryboy_Rating.belongsTo(models.Users, {
        foreignKey: 'delivery_boy_id',
        as:"delivery_boy"
      });
       Deliveryboy_Rating.belongsTo(models.Review_Reason, {
        foreignKey: 'reason_id'
      });
       Deliveryboy_Rating.belongsTo(models.Product_Order, {
        foreignKey: "order_id",
      });
    }
  }
  Deliveryboy_Rating.init({
    ratings: DataTypes.INTEGER,
    title: DataTypes.STRING,
    review: DataTypes.STRING,
    image: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Deliveryboy_Rating',
     tableName: "deliveryboy_ratings",
     paranoid: true, 
    timestamps: true,
  });
  return Deliveryboy_Rating;
};