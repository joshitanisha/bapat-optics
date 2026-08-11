"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Prescription_Details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     Prescription_Details.belongsTo(models.Eye_Type, {
        foreignKey: 'eye_type_id'
      });
         Prescription_Details.belongsTo(models.Eye_Unit, {
        foreignKey: 'eye_unit_id'
      });
         Prescription_Details.belongsTo(models.Vission_Type, {
        foreignKey: 'vission_type_id'
      });
       Prescription_Details.belongsTo(models.Prescriptions, {
        foreignKey: 'prescription_id'
      });
    }
  }
  Prescription_Details.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Prescription_Details",
      tableName: "prescription_details",
      paranoid: true, 
      timestamps: true,
    }
  );
  return Prescription_Details;
};
