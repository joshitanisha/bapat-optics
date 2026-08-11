const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
  Admin_NotifictionsManagment,
} = require("../../../../../helper/common/utils/dbUtils");
const Base = require("../../../../../helper/exception_handling");
const IDS = require("../../../../../helper/fix_ids");
const {
  HTTPS,
} = require("../../../../../helper/https-status-codes/https-status-codes");
const { sendWatsapp } = require("../../../../../helper/WhatsAppMessage");
const {
  Admin_Notifiction,
  Users,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
class Admin_NotifictionController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const options = {
        where: {
          // user_id: IDS.UserId.Admin,
          [Op.or]: [{ message: { [Op.like]: `%${name}%` } }],
        },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Admin_Notifiction, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Admin_Notifictions:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const result = await CheckExits(
        Admin_Notifiction,
        { id: req.params.id },
        t,
      );

      if (!result) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_FOUND,
          "Admin_Notifiction not found",
        );
      }
      const data = {
        name: result.message,
      };
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Admin_Notifiction:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new country
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        seen_status: true,
      };

      const newItem = await UpdateData(
        Admin_Notifiction,
        data,
        { seen_status: false },
        t,
      );

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newItem);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Admin_Notifiction:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a country by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        message: req.body?.name?.trim(),
      };

      // const exists = await CheckExits(Admin_Notifiction, { name: data?.name }, t);

      // if (exists?.id != id && exists !== null) {
      //   await t.rollback();
      //   return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Admin_Notifiction name already in use");
      // }

      const update = await UpdateData(Admin_Notifiction, data, { id: id }, t);

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Admin_Notifiction updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Admin_Notifiction:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a country by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Admin_Notifiction, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_FOUND,
          "Admin_Notifiction not found",
        );
      }

      await Admin_Notifiction.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Admin_Notifiction Deleted Successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Admin_Notifiction:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Admin_Notifiction, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Admin_Notifiction,
        { status: result.status ? false : true },
        { id },
        t,
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Admin_Notifiction status updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Admin_Notifiction status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new Admin_NotifictionController();
