const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Base = require("../../../../../helper/exception_handling");
const {
  HTTPS,
} = require("../../../../../helper/https-status-codes/https-status-codes");
const {
  Users,
  Notification,
  Product_Order,
  Order_status,
  sequelize,
} = require("../../../../../models/index");
const IDS = require("../../../../../helper/fix_ids");
const {
  VerifyAnyOtp,
  CheckExits,
  UpdateData,
} = require("../../../../../helper/common/utils/dbUtils");
const { Op } = require("sequelize");
class NotificationController {
  async GetAllNotifications(req, res) {
    try {
      const term = req.query.term || "";
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const per_page = req.query.per_page ? parseInt(req.query.per_page) : 10;

      const { count, rows: data } = await Notification.findAndCountAll({
        include: [
          {
            model: Product_Order,
            include: {
              model: Order_status,
            },
          },
         
        ],
        order: [["createdAt", "DESC"]],
        where: {
          user_id: {
            [Op.or]: [IDS.UserId.Admin, req?.user?.user_id],
          },
        },
        offset: (page - 1) * per_page,
        limit: per_page,
        distinct: true,
      });

      const total_pages = Math.ceil(count / per_page);

      return Base.sendResponse(res, HTTPS.OK, {
        data: data,
        current_page: page,
        total_pages: total_pages,
        per_page: per_page,
        total: count,
        search_name: term,
      });
    } catch (error) {
      console.error("Error in Notification:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }
  async GetAllPlanNotifications(req, res) {
    try {
      const term = req.query.term || "";
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const per_page = req.query.per_page ? parseInt(req.query.per_page) : 10;

      const { count, rows: data } = await Notification.findAndCountAll({
        include: [
         
        ],
        where: {
          user_id: req?.user?.user_id,
        },
        offset: (page - 1) * per_page,
        limit: per_page,
        distinct: true,
      });

      const total_pages = Math.ceil(count / per_page);

      return Base.sendResponse(res, HTTPS.OK, {
        data: data,
        current_page: page,
        total_pages: total_pages,
        per_page: per_page,
        total: count,
        search_name: term,
      });
    } catch (error) {
      console.error("Error in Notification:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const include = [
        {
          model: Product_Order,
        },
      
      ];
      const notification = await CheckExits(
        Notification,
        { id: req.params.id },
        t,
        include
      );

      if (!notification) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "notification not found");
      }
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, notification);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching State:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new NotificationController();
