"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Team_Social_Link extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Team_Social_Link.belongsTo(models.Social_Link, {
        foreignKey: "social_media_id",
      });

      Team_Social_Link.belongsTo(models.Our_Team, {
        foreignKey: "our_team_id",
      });
    }
  }
  Team_Social_Link.init(
    {
      link: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Team_Social_Link",
      tableName: "team_social_links",
       paranoid: true, 
      timestamps: true,
    }
  );
  return Team_Social_Link;
};
