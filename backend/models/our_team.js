"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Our_Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    Our_Team.hasMany(models.Team_Social_Link, {
        foreignKey: 'our_team_id'
      });
    }
  }
  Our_Team.init(
    {
      name: DataTypes.STRING,
      designation: DataTypes.STRING,
      image: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Our_Team",
      tableName: "our_teams",
       paranoid: true, 
      timestamps: true,
    }
  );
  return Our_Team;
};
