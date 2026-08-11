"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order_Refer_History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order_Refer_History.belongsTo(models.Users, {
        foreignKey: "user_id",
      });
      Order_Refer_History.belongsTo(models.Users, {
        foreignKey: "user_by_id",
      });
    }
  }
  Order_Refer_History.init(
    {
      order_count: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Order_Refer_History",
      tableName: "order_refer_histories",
      paranoid: true,
      timestamps: true,
    }
  );
  return Order_Refer_History;
};
