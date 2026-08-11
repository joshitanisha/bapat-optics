"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Area extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Area.belongsTo(models.Country, {
        foreignKey: 'country_id'
      });
      Area.belongsTo(models.State, {
        foreignKey: 'state_id'
      });
      Area.belongsTo(models.City, {
        foreignKey: 'city_id'
      });
       Area.belongsTo(models.Pincode, {
        foreignKey: 'pincode_id'
      });
    }
  }
  Area.init(
    {
      name: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Area",
      tableName: "areas",
       paranoid: true, 
      timestamps: true,
    }
  );
  return Area;
};
