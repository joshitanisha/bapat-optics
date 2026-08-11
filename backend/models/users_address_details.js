"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users_Address_Details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Users_Address_Details.belongsTo(models.Country, {
        foreignKey: 'country_id'
      });
      Users_Address_Details.belongsTo(models.State, {
        foreignKey: 'state_id'
      });
      Users_Address_Details.belongsTo(models.City, {
        foreignKey: 'city_id'
      });
       Users_Address_Details.belongsTo(models.Pincode, {
        foreignKey: 'pincode_id'
      });
       Users_Address_Details.belongsTo(models.Area, {
        foreignKey: 'area_id'
      });
    }
  }
  Users_Address_Details.init(
    {
      // name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Users_Address_Details",
      tableName: "users_address_details",
       paranoid: true, 
      timestamps: true,
    }
  );
  return Users_Address_Details;
};
