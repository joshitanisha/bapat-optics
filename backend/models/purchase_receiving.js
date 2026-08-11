"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Purchase_Receiving extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Purchase_Receiving.belongsTo(models.Users, {
        foreignKey: "user_id",
      });
      Purchase_Receiving.belongsTo(models.Purchase_Order, {
        foreignKey: "p_o_id",
      });
      Purchase_Receiving.belongsTo(models.Receiving, {
        foreignKey: "receiving_id",
      });
    }
  }
  Purchase_Receiving.init(
    {
      quantity: DataTypes.STRING,
      
    },
    {
      sequelize,
      modelName: "Purchase_Receiving",
      tableName: "purchase_receivings",
      paranoid: true, // Enable soft delete
      timestamps: true, // Ensure timestamps are enabled
    }
  );
  return Purchase_Receiving;
};
