"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Purchase_History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Purchase_History.belongsTo(models.Users, {
        foreignKey: "user_id",
      });
      Purchase_History.belongsTo(models.Purchase_Order, {
        foreignKey: "p_o_id",
      });
      Purchase_History.belongsTo(models.Purchase_Order_Status, {
        foreignKey: "p_o_s_id",
      });
    }
  }
  Purchase_History.init(
    {
      total_quantity: DataTypes.STRING,
      comment: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Purchase_History",
      tableName: "purchase_histories",
       paranoid: true, // Enable soft delete
      timestamps: true, // Ensure timestamps are enabled
    }
  );
  return Purchase_History;
};
