"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Purchase_Order_Status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Purchase_Order_Status.init(
    {
      name: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Purchase_Order_Status",
      tableName: "purchase_order_statuses",
       paranoid: true, // Enable soft delete
      timestamps: true, // Ensure timestamps are enabled
    }
  );
  return Purchase_Order_Status;
};
