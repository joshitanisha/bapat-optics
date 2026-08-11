"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class App_Setup extends Model {
    static associate(models) {
      App_Setup.belongsTo(models.Pincode, {
        foreignKey: "pincode_id",
      });

       App_Setup.belongsTo(models.State, {
        foreignKey: "state_id",
      });
    }
  }
  App_Setup.init(
    {
      website_name: DataTypes.STRING,
      logo: DataTypes.STRING,
      contact_no: DataTypes.STRING,
      alt_contact_no: DataTypes.STRING,
      email: DataTypes.STRING,
      address: DataTypes.STRING,
      minimum_order: DataTypes.STRING,
      free_delivery_order_price: DataTypes.STRING,
      delivery_price: DataTypes.STRING,
      lat: DataTypes.STRING,
      long: DataTypes.STRING,
      refer_to_order: DataTypes.STRING,
      refer_by_order: DataTypes.STRING,
      delivery_range: DataTypes.STRING,
      delivery_time: DataTypes.TIME,
      reward_discount: DataTypes.STRING,
      refer_percentage: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
      // subscription_status: DataTypes.BOOLEAN,
      delivery_price_three_kilometer: DataTypes.STRING,
      customer_limit: DataTypes.STRING,
      low_stock_day: DataTypes.STRING,
      refer_to_percentage: DataTypes.STRING,
      order_time: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "App_Setup",
      tableName: "app_setups",
       paranoid: true,
      timestamps: true,
    }
  );
  return App_Setup;
};
