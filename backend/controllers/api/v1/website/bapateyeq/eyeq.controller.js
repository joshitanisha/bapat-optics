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
const { Eyeq } = require("../../../../../models/index");
const { Op } = require("sequelize");

class allEye {
  async allEye(req, res) {
    try {
      // Fetch user with roles and permissions
      const data = await Eyeq.findAll({
        where: {
          status: true,
        },
        order: [["sort_order", "ASC"]],
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Units:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = new allEye();
