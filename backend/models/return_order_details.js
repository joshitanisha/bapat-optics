"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Return_Order_Details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Return_Order_Details.belongsTo(models.Product, {
        foreignKey: "product_id",
      });
      Return_Order_Details.belongsTo(models.Product_Order_Detail, {
        foreignKey: "order_details_id",
      });
       Return_Order_Details.belongsTo(models.Return_Order, {
        foreignKey: "return_order_id",
      });
    }
  }
  Return_Order_Details.init(
    {
      // name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Return_Order_Details",
      tableName: "return_order_details",
       paranoid: true, 
      timestamps: true,
    }
  );
  return Return_Order_Details;
};
