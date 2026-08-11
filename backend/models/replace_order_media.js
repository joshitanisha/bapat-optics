'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Replace_Order_Media extends Model {
    static associate(models) {
      Replace_Order_Media.belongsTo(models.Return_Order, {
        foreignKey: 'order_id'
      });

    }
  }
  Replace_Order_Media.init({
    image: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Replace_Order_Media',
    tableName: "replace_order_medias",
     paranoid: true, 
    timestamps: true,
  });
  return Replace_Order_Media;
};