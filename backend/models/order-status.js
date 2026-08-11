'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order_status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order_status.init({
    name: DataTypes.STRING,
 
    status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: "Order_status",
    tableName: "order_status",
     paranoid: true, // Enable soft delete
    timestamps: true, // Ensure timestamps are enabled
  });
  return Order_status;
};