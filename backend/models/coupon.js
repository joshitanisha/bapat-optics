"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Coupon extends Model {
    static associate(models) {
      // Associating Coupon with Store_Detail

      Coupon.belongsTo(models.Discount_Type, {
        foreignKey: "discount_type_id",
      });

      Coupon.belongsTo(models.Brand, {
        foreignKey: "brand_id",
      });

      Coupon.belongsTo(models.p_category, {
        foreignKey: "category_id",
      });
      Coupon.belongsTo(models.Coupon_Type, {
        foreignKey: "coupon_type_id",
      });

      Coupon.hasMany(models.Coupon_Brand, {
        foreignKey: "coupon_id",
      });
    }
  }

  Coupon.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      discount: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true,
      },
      required_amount: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      info: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      use_per_coupon: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      use_per_customer: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      s_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      e_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      customer_view: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: "Coupon",
      tableName: "coupons",
      paranoid: true,
      timestamps: true,
    },
  );

  return Coupon;
};
