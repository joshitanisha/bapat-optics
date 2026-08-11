"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Prescriptions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Prescriptions.belongsTo(models.Lens, {
        foreignKey: "lens_id",
      });

      Prescriptions.belongsTo(models.Lens_Option, {
        foreignKey: "lens_option_id",
      });
      Prescriptions.belongsTo(models.Prescriptions_Type, {
        foreignKey: "prescriptions_type_id",
      });

      Prescriptions.belongsTo(models.Product, {
        foreignKey: "product_id",
      });
      Prescriptions.belongsTo(models.Users, {
        foreignKey: "user_id",
      });

      Prescriptions.hasMany(models.Prescription_Details, {
        foreignKey: "prescription_id",
      });

      Prescriptions.belongsTo(models.Addon, {
        foreignKey: "addon_id",
      });
      Prescriptions.belongsTo(models.LensType, {
        foreignKey: "lens_type_id",
      });

      Prescriptions.belongsTo(models.Product, {
        foreignKey: "lense_product_id",
        as: "Lense",
      });

      Prescriptions.hasOne(models.Product_Order_Detail, {
        foreignKey: "prescription_id",
      });
    }
  }
  Prescriptions.init(
    {
      name: DataTypes.STRING,
      pdf: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
      fh: DataTypes.STRING,
      dbl: DataTypes.STRING,
      a_size: DataTypes.STRING,
      b_size: DataTypes.STRING,

      lense_discount_percentage: DataTypes.INTEGER,
      lense_tax_percentage: DataTypes.INTEGER,

      tax_amount: DataTypes.DECIMAL(10, 2),
      discount: DataTypes.DECIMAL(10, 2),
      coupon_discount: DataTypes.DECIMAL(10, 2),
      mrp: DataTypes.DECIMAL(10, 2),
      selling_price: DataTypes.DECIMAL(10, 2),
    },
    {
      sequelize,
      modelName: "Prescriptions",
      tableName: "prescriptions",
      paranoid: true,
      timestamps: true,
    },
  );
  return Prescriptions;
};
