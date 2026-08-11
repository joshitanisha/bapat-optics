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
const { About_Us, sequelize } = require("../../../../../models/index");
const { Op } = require("sequelize");
class About_UsController {
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
      await Paginate(About_Us, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching About_Us :", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const result = await CheckExits(About_Us, { id: req.params.id }, t);
      if (!result) {
        
      await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "About_Us not found");
      }
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching About_Us :", error);
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
      const exists = await CheckExits(About_Us, { content: data?.content }, t);

      if (exists) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Content  already exists");
      }

      const newItem = await CreateNew(About_Us, data, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newItem);
    } catch (error) {
      await t.rollback();
      console.error("Error creating About_Us :", error);
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

      const exists = await CheckExits(About_Us, { content: data?.content }, t);

      if (exists?.id != id && exists !== null) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "About_Us already in use");
      }

      const update = await UpdateData(About_Us, data, { id: id }, t);

      await t.commit();
      return Base.sendResponse(res, HTTPS.ACCEPTED, "About_Us  updated successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error updating About_Us :", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a country by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(About_Us, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "About_Us not found");
      }

      await About_Us.destroy({ where: { id }, transaction: t, });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "About_Us Category Successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting About_Us Category :", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }


  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(About_Us, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(About_Us, { status: result.status ? false : true }, { id }, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, "About_Us  status updated successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error updating About_Us status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new About_UsController();
