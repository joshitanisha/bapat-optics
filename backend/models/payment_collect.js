"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payment_Collect extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Payment_Collect.belongsTo(models.Product_Order, {
        foreignKey: "order_id",
      });
      Payment_Collect.belongsTo(models.Users, {
        foreignKey: "user_id",
      });
      Payment_Collect.belongsTo(models.Users, {
        foreignKey: "delivery_boy_id",
        as: "delivery_boy",
      });

      Payment_Collect.belongsTo(models.Payment_Method, {
        foreignKey: "payment_method_id",
      });

      Payment_Collect.hasMany(models.Payment_Collect_Details, {
        foreignKey: "payment_collect_id",
      });
    }
  }
  Payment_Collect.init(
    {
      
      no_of_item: DataTypes.STRING,
      receive_payment: DataTypes.STRING,
      total_amount: DataTypes.STRING,
      total_kg: DataTypes.STRING,
      collected_at: DataTypes.DATE,
      payment_receive_status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Payment_Collect",
      tableName: "payment_collects",
       paranoid: true, 
      timestamps: true, 
    }
  );
  return Payment_Collect;
};
