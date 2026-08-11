"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users_Refer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Users_Refer.belongsTo(models.Users, {
        foreignKey: "refer_by",
        as: "refer", // Alias for the "refer_by" relationship
      });

      Users_Refer.belongsTo(models.Users, {
        foreignKey: "refer_to",
        as: "refered", // Alias for the "refer_to" relationship
      });
    }
  }
  Users_Refer.init(
    {
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Users_Refer",
      tableName: "users_refers",
       paranoid: true, 
      timestamps: true,
    }
  );
  return Users_Refer;
};
