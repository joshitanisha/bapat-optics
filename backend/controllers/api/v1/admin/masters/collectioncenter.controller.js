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
const { Collection_Center, sequelize } = require("../../../../../models/index");
const { Op } = require("sequelize");
class Collection_CenterController {
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
      await Paginate(Collection_Center, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Collection_Centers:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const result = await CheckExits(Collection_Center, { id: req.params.id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Collection_Center not found");
      }
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Collection_Center:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new country
  async create(req, res) {
    const t = await sequelize.transaction();
    try {

      const data = {
        name: req.body?.name?.trim(),
      }
      const exists = await CheckExits(Collection_Center, { name: data?.name }, t);

      if (exists) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Collection_Center already exists");
      }

      const newItem = await CreateNew(Collection_Center, data, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newItem);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Collection_Center:", error);
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
      }

      const exists = await CheckExits(Collection_Center, { name: data?.name }, t);

      if (exists?.id != id && exists !== null) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Collection_Center name already in use");
      }

      const update = await UpdateData(Collection_Center, data, { id: id }, t);

      await t.commit();
      return Base.sendResponse(res, HTTPS.ACCEPTED, "Collection_Center updated successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error updating Collection_Center:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a country by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Collection_Center, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Collection_Center not found");
      }

      await Collection_Center.destroy({ where: { id }, transaction: t, });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "Collection_Center Deleted Successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Collection_Center:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }


  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Collection_Center, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(Collection_Center, { status: result.status ? false : true }, { id }, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, "Collection_Center status updated successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error updating Collection_Center status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new Collection_CenterController();
