"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.p_category, {
        foreignKey: "p_category_id",
      });

      Product.belongsTo(models.Brand, {
        foreignKey: "brand_id",
      });

      Product.belongsTo(models.Shape, {
        foreignKey: "shape_id",
      });
      Product.belongsTo(models.Face_Width, {
        foreignKey: "face_width_id",
      });
      Product.belongsTo(models.Material, {
        foreignKey: "material_id",
      });
      Product.belongsTo(models.Frame_Type, {
        foreignKey: "frame_type_id",
      });
      Product.belongsTo(models.Gender, {
        foreignKey: "gender_id",
      });
      Product.belongsTo(models.Approval_Status, {
        foreignKey: "approval_status_id",
      });
      Product.hasMany(models.Product_Images, {
        foreignKey: "product_id",
      });
      Product.hasMany(models.Rating_Reviews, {
        foreignKey: "product_id",
      });
      Product.hasMany(models.Product_Order_Detail, {
        foreignKey: "product_id",
      });

      Product.hasMany(models.Product_Variant, {
        foreignKey: "product_id",
      });
      Product.hasMany(models.Often_Ordered_With, {
        foreignKey: "product_id",
      });
      Product.belongsTo(models.Country, {
        foreignKey: "made_in_id",
      });
      // Product.belongsTo(models.Pack_Type, {
      //   foreignKey: "pack_type_id",
      // });
      Product.belongsTo(models.Stock_Type, {
        foreignKey: "stock_type_id",
      });
      // Product.hasMany(models.Product_Farmer, {
      //   foreignKey: "product_id",
      // });
      // Product.hasMany(models.Product_Pack_Type, {
      //   foreignKey: "product_id",
      // });
      // Product.hasMany(models.Product_Delivery_Type, {
      //   foreignKey: "product_id",
      // });
      Product.hasOne(models.Offered_Product, {
        foreignKey: "product_id",
      });
      Product.hasOne(models.Product_Stock, {
        foreignKey: "product_id",
      });

      Product.hasMany(models.Product_Variant_Stock, {
        foreignKey: "product_id",
      });

      Product.hasMany(models.Purchase_Order_Product, {
        foreignKey: "product_id",
      });
      Product.hasMany(models.Receiving_Product, {
        foreignKey: "product_id",
      });
      // Product.hasMany(models.Subscription_Product_Details, {
      //   foreignKey: "product_id",
      // });
      Product.hasMany(models.Product_Order_Detail, {
        foreignKey: "product_id",
      });
      Product.hasMany(models.Lense_Addons, {
        foreignKey: "product_id",
      });

      Product.hasMany(models.Stocks, {
        foreignKey: "product_id",
      });
      Product.hasOne(models.Stocks, {
        foreignKey: "product_id",
        as: "Stock",
      });
      Product.belongsTo(models.LensType, {
        foreignKey: "lens_type_id",
      });
      Product.belongsTo(models.LensCategory, {
        foreignKey: "lens_category_id",
      });
      Product.belongsTo(models.Colour, {
        foreignKey: "color_id",
      });
      Product.belongsTo(models.Colour, {
        foreignKey: "lens_color_id",
        as: "lens_color",
      });

      Product.belongsTo(models.Coating, {
        foreignKey: "coating_id",
      });
      Product.hasMany(models.Prescriptions, {
        foreignKey: "lense_product_id",
        as: "Lense",
      });
    }
  }
  Product.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      manufacturer: DataTypes.STRING,
      description: DataTypes.TEXT,
      status: DataTypes.BOOLEAN,
      size: DataTypes.STRING,
      total_measurements: DataTypes.STRING,
      model_no: DataTypes.STRING,
      is_returnable: DataTypes.BOOLEAN,
      return_days: DataTypes.INTEGER,
      allowed_quanitity: DataTypes.INTEGER,
      customer_view: DataTypes.BOOLEAN,
      bo_code: DataTypes.STRING,
      index: DataTypes.DECIMAL(20, 2),
      coating_name: DataTypes.STRING,
      base_curve: DataTypes.STRING,
      water_content: DataTypes.STRING,
      dk_t: DataTypes.STRING,
      diameter: DataTypes.STRING,
      modality: DataTypes.STRING,
      mrp: DataTypes.DECIMAL(20, 2),
      discount: DataTypes.DECIMAL(20, 2),
      discount_amount: DataTypes.DECIMAL(20, 2),
      price: DataTypes.DECIMAL(20, 2),
      tax_percentage: DataTypes.STRING,
      tax_amount: DataTypes.DECIMAL(20, 2),
      base_amount: DataTypes.DECIMAL(20, 2),
      available_stock: DataTypes.INTEGER,
      tranding_status: DataTypes.BOOLEAN,
      barcode_status: DataTypes.BOOLEAN,
      top_status: DataTypes.BOOLEAN,
      customer_name: DataTypes.STRING,
      hsn_code: DataTypes.STRING,
      vto_enable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // or true, matching your database default
      },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products",
      paranoid: true,
      timestamps: true,
    },
  );
  return Product;
};
