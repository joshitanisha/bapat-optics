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
  Offered_Product,
  Offer,
  Discount_Type,
  Product,
  Benifit_Product,
  Product_Variant,
} = require("../../../../../models/index");
const { Op } = require("sequelize");

class BenifitController {
  async allBenifit(req, res) {
    try {
      // Fetch user with roles and permissions
      const data = await Offer.findOne({
        include: [
          {
            model: Offered_Product,
            where: { status: true },
            include: [
              {
                model: Product,
                where: { status: true },
                include: [{ model: Product_Variant }],
              },
            ],
          },
        ],
        where: {
          id: req.params.id,
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Units:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allOffer(req, res) {
    try {
      const data = await Offer.findAll({
        include: [
          { model: Offered_Product, where: { status: true }, required: false },
        ],
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

module.exports = new BenifitController();
