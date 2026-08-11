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
const { Shipping_Policy, sequelize } = require("../../../../../models/index");
const { Op } = require("sequelize");
class shippingPolicyController {
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
      await Paginate(Shipping_Policy, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Shipping_Policy :", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const result = await CheckExits(Shipping_Policy, { id: req.params.id }, t);
      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Shipping_Policy not found");
      }
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Shipping_Policy :", error);
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
      const exists = await CheckExits(Shipping_Policy, { content: data?.content }, t);

      if (exists) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Content  already exists");
      }

      const newItem = await CreateNew(Shipping_Policy, data, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newItem);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Shipping_Policy :", error);
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

      const exists = await CheckExits(Shipping_Policy, { content: data?.content }, t);

      if (exists?.id != id && exists !== null) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Shipping_Policy already in use");
      }

      const update = await UpdateData(Shipping_Policy, data, { id: id }, t);

      await t.commit();
      return Base.sendResponse(res, HTTPS.ACCEPTED, "Shipping_Policy  updated successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error updating Shipping_Policy :", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a country by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Shipping_Policy, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Shipping_Policy not found");
      }

      await Shipping_Policy.destroy({ where: { id }, transaction: t, });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "Shipping_Policy Category Successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Shipping_Policy Category :", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }


  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Shipping_Policy, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(Shipping_Policy, { status: result.status ? false : true }, { id }, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, "Shipping_Policy  status updated successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error updating Shipping_Policy status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new shippingPolicyController();
