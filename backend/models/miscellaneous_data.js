"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Miscellaneous_Data extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Miscellaneous_Data.belongsTo(models.Miscellaneous_Reason, {
        foreignKey: 'miscellaneous_reason_id'
      });
    }
  }
  Miscellaneous_Data.init(
    {
      rupees: DataTypes.STRING,
      comment: DataTypes.STRING,
      date: DataTypes.DATE,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Miscellaneous_Data",
      tableName: "miscellaneous_data",
       paranoid: true, 
      timestamps: true,
    }
  );
  return Miscellaneous_Data;
};
