"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Admin_Notifiction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Admin_Notifiction.init(
    {
      message: DataTypes.STRING,
      seen_status: DataTypes.BOOLEAN,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Admin_Notifiction",
      tableName: "admin_notifictions",
      paranoid: true,
      timestamps: true,
    },
  );
  return Admin_Notifiction;
};
