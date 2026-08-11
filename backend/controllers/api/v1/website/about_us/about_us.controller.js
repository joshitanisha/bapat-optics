const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
} = require("../../../../../helper/common/utils/dbUtils");
const bcrypt = require("bcryptjs");
const Base = require("../../../../../helper/exception_handling");
const {
  HTTPS,
} = require("../../../../../helper/https-status-codes/https-status-codes");
const {
  Vission_Mission,
  Social_Link,
  Team_Social_Link,
  Our_Team,
  About_Us,
  Users,
  Rating_Reviews,
  Product,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
const { UserId, RoleId } = require("../../../../../helper/fix_ids");

class HomeController {
  async allVissionMission(req, res) {
    try {
      // Fetch user with roles and permissions
      const data = await Vission_Mission.findAll({
        where: {
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Units:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allOurTeam(req, res) {
    try {
      const data = await Our_Team.findAll({
        include: [
          { model: Team_Social_Link, include: [{ model: Social_Link }] },
        ],
        where: {
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Units:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allCounter(req, res) {
    try {
      const users = await Users.count({
        where: {
          role_id: RoleId.Customer,
        },
      });
      const review = await Rating_Reviews.count({});
      const product = await Product.count({});

      const data = {
        users,
        review,
        product,
      };

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Units:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allAboutUs(req, res) {
    try {
      const data = await About_Us.findOne({
        // where: {
        //   status: true,
        // },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Units:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = new HomeController();
