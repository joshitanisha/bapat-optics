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
const { Miscellaneous_Reason, sequelize } = require("../../../../../models/index");
const { Op } = require("sequelize");
class Miscellaneous_ReasonController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const options = {
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
        },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Miscellaneous_Reason, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Miscellaneous_Reasons:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const result = await CheckExits(Miscellaneous_Reason, { id: req.params.id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Miscellaneous Reason not found");
      }
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Miscellaneous_Reason:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new country
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        name: req.body?.name?.trim(),
      };
      const exists = await CheckExits(Miscellaneous_Reason, { name: data?.name }, t);

      if (exists) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Miscellaneous Reason already exists"
        );
      }

      const newItem = await CreateNew(Miscellaneous_Reason, data, t);

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.CREATED,
        newItem,
        "Miscellaneous Reason  Created"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error creating Miscellaneous_Reason:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a country by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        name: req.body?.name?.trim(),
      };

      const exists = await CheckExits(Miscellaneous_Reason, { name: data?.name }, t);

      if (exists?.id != id && exists !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Miscellaneous Reason name already in use"
        );
      }

      const update = await UpdateData(Miscellaneous_Reason, data, { id: id }, t);

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        {},
        "Miscellaneous Reason  updated"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Miscellaneous_Reason:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a country by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Miscellaneous_Reason, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Miscellaneous Reason not found");
      }

      await Miscellaneous_Reason.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Miscellaneous Reason Deleted Successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Miscellaneous_Reason:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Miscellaneous_Reason, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Miscellaneous_Reason,
        { status: result.status ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Miscellaneous Reason status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Miscellaneous Reason status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new Miscellaneous_ReasonController();
