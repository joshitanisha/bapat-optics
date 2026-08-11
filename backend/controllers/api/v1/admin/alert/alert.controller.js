const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Base = require("../../../../../helper/exception_handling");
const { HTTPS } = require("../../../../../helper/https-status-codes/https-status-codes");
const {
  Product,
  Product_Order,
  Order_History,
  Payment_Type,
  Order_Payment_Detail,
  Rating_Reviews,
  Store_Detail,
  Delivery_Boy_Detail,
  sequelize,
} = require("../../../../../models/index");
const IDS = require("../../../../../helper/fix_ids");
const { VerifyAnyOtp } = require("../../../../../helper/common/utils/dbUtils");
const { Op, fn, col } = require("sequelize");
const moment = require("moment");

class AlertController {
  async getallAlertCounts(req, res) {
    try {
      
      // const pendingVendors = await Store_Detail.count({
      //   where: {
      //     approval_status_id: 1,
      //   },
      // });

      const pendingDeliveryBoy = await Delivery_Boy_Detail.count({
        where: {
          approval_status_id: 1,
        },
      });

      const pendingProducts = await Product.count({
        where: {
          approval_status_id: 1,
        },
      });


      const data = {
          // pending_vendors: pendingVendors,
          pending_delivery_boys: pendingDeliveryBoy,
          pending_products: pendingProducts,
      };

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Alert Details:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

 
}

module.exports = new AlertController();
