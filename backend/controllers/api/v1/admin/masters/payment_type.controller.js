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
const { Payment_Type, sequelize } = require("../../../../../models/index");
const { Op } = require("sequelize");
class BrandController {
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
      await Paginate(Payment_Type, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Payment Type:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const result = await CheckExits(Payment_Type, { id: req.params.id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Payment Type not found");
      }
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Payment Type:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new country
  async create(req, res) {
    const t = await sequelize.transaction();
    try {

      const data = {
        name: req.body?.name?.trim(),
        image: await File_Uploade(req.files?.image, "/uploads/masters/payment_type")
      }

      const exists = await CheckExits(Payment_Type, { name: data?.name }, t);

      if (exists) {
        await t.rollback();
        return Base.sendError(res, HTTPS.FORBIDDEN, "Payment Type already exists");
      }

      const newItem = await CreateNew(Payment_Type, data, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newItem, "Payment Type Created Successfuly");
    } catch (error) {
      await t.rollback();
      console.error("Error creating Payment Type:", error);
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

      if (req.files && req.files.image) {
        data.image = await File_Uploade(req.files?.image, "/uploads/masters/payment_type")
      }

      const exists = await CheckExits(Payment_Type, { name: data?.name }, t);

      if (exists?.id != id && exists !== null) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Payment Type name already in use");

      }

      const update = await UpdateData(Payment_Type, data, { id: id }, t);

      await t.commit();
      return Base.sendResponse(res, HTTPS.ACCEPTED, "Payment Type updated successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error updating Payment Type:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a country by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Payment_Type, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Payment Type not found");
      }

      await Payment_Type.destroy({ where: { id }, transaction: t, });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "Payment Type Deleted Successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Payment Type:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }


  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Payment_Type, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(Brand, { status: result.status ? false : true }, { id }, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, "Payment Type status updated successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error updating Payment Type status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new BrandController();
