"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Roles_Permissions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Roles_Permissions.belongsTo(models.Roles, {
        foreignKey: "role_id",
        // as: "role",
      });

      Roles_Permissions.belongsTo(models.Permissions, {
        foreignKey: "permission_id",
        // as: "permissions",
      });
    }
  }
  Roles_Permissions.init(
    {
      permission_id: DataTypes.INTEGER,
      role_id: DataTypes.INTEGER,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Roles_Permissions",
      tableName: "roles_permissions",
    }
  );
  return Roles_Permissions;
};
