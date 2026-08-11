const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
  NotificationsManagment,
} = require("../../../../../helper/common/utils/dbUtils");
const Base = require("../../../../../helper/exception_handling");
const IDS = require("../../../../../helper/fix_ids");
const {
  HTTPS,
} = require("../../../../../helper/https-status-codes/https-status-codes");
const {
  sendWatsapp,
  sendWatsappMessageWithMedia,
} = require("../../../../../helper/WhatsAppMessage");
const {
  Notification,
  Users,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");

const { convert } = require("html-to-text");

class NotificationController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const options = {
        where: {
          user_id: IDS.UserId.Admin,
          [Op.or]: [{ message: { [Op.like]: `%${name}%` } }],
        },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Notification, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Notifications:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const result = await CheckExits(Notification, { id: req.params.id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Notification not found");
      }

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Notification:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new country
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        message: req.body?.message?.trim(),
        user_id: IDS.UserId.Admin,
      };
      // const exists = await CheckExits(Notification, { name: data?.name }, t);

      // if (exists) {
      //   await t.rollback();
      //   return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Notification already exists");
      // }
      if (req.files && req.files.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/blog",
        );
      }
      const newItem = await CreateNew(Notification, data, t);
      const text = convert(newItem.message, {
        wordwrap: false,
        selectors: [{ selector: "p", format: "block" }],
      });

      const settings = await Users.findAll({});
      for (const customer of settings) {
        await sendWatsappMessageWithMedia(customer, text, data.image);
      }
      // NotificationsManagment(newItem);

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newItem);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Notification:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a country by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        message: req.body?.message?.trim(),
      };
      if (req.files && req.files.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/blog",
        );
      }
      // const exists = await CheckExits(Notification, { name: data?.name }, t);

      // if (exists?.id != id && exists !== null) {
      //   await t.rollback();
      //   return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Notification name already in use");
      // }

      const update = await UpdateData(Notification, data, { id: id }, t);

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Notification updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Notification:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a country by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Notification, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Notification not found");
      }

      await Notification.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Notification Deleted Successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Notification:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Notification, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Notification,
        { status: result.status ? false : true },
        { id },
        t,
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Notification status updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Notification status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new NotificationController();
