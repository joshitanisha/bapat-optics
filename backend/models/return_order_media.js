'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Return_Order_Media extends Model {
    static associate(models) {
      Return_Order_Media.belongsTo(models.Return_Order, {
        foreignKey: 'order_id'
      });

    }
  }
  Return_Order_Media.init({
    image: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Return_Order_Media',
    tableName: "return_order_medias",
     paranoid: true, 
    timestamps: true,
  });
  return Return_Order_Media;
};