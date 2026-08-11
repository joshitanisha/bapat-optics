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
const { Privacy_Policy, sequelize } = require("../../../../../models/index");
const { Op } = require("sequelize");
class Privacy_PolicyController {
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
      await Paginate(Privacy_Policy, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Privacy_Policy :", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const result = await CheckExits(Privacy_Policy, { id: req.params.id }, t);
      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Privacy_Policy not found");
      }
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Privacy_Policy :", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new country
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        content: req.body?.content?.trim(),
      }
      const exists = await CheckExits(Privacy_Policy, { content: data?.content }, t);

      if (exists) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Content  already exists");
      }

      const newItem = await CreateNew(Privacy_Policy, data, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newItem);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Privacy_Policy :", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a country by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        content: req.body?.content?.trim(),
      }

      const exists = await CheckExits(Privacy_Policy, { content: data?.content }, t);

      if (exists?.id != id && exists !== null) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Privacy_Policy already in use");
      }

      const update = await UpdateData(Privacy_Policy, data, { id: id }, t);

      await t.commit();
      return Base.sendResponse(res, HTTPS.ACCEPTED, "Privacy_Policy  updated successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error updating Privacy_Policy :", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a country by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Privacy_Policy, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Privacy_Policy not found");
      }

      await Privacy_Policy.destroy({ where: { id }, transaction: t, });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "Privacy_Policy Category Successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Privacy_Policy Category :", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }


  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Privacy_Policy, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(Privacy_Policy, { status: result.status ? false : true }, { id }, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, "Privacy_Policy  status updated successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error updating Privacy_Policy status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new Privacy_PolicyController();
