const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
} = require("../../../../../helper/common/utils/dbUtils");
const Base = require("../../../../../helper/exception_handling");
const { HTTPS } = require("../../../../../helper/https-status-codes/https-status-codes");
const { Terms_And_Condition, sequelize } = require("../../../../../models/index");
const { Op } = require("sequelize");
class Terms_And_ConditionController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      // const name = req.query.term?.trim() || "";
      const options = {
        where: {
          // [Op.or]: [{ question: { [Op.like]: `%${name}%` } }],
        },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Terms_And_Condition, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Terms_And_Condition :", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }


}

module.exports = new Terms_And_ConditionController();
