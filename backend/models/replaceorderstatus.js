"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ReplaceOrderStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ReplaceOrderStatus.hasOne(models.Replace_Order, {
        foreignKey: "replace_order_status_id",
      });
    }
  }
  ReplaceOrderStatus.init(
    {
      name: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "ReplaceOrderStatus",
      tableName: "replace_order_statuses",
       paranoid: true, 
      timestamps: true,
    }
  );
  return ReplaceOrderStatus;
};
