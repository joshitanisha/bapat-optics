const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CheckExits_T, // ✅ ADDED THIS
  CreateNew,
  UpdateData,
  File_Uploade,
} = require("../../../../../helper/common/utils/dbUtils.js");

const Base = require("../../../../../helper/exception_handling/index.js");
const { HTTPS } = require("../../../../../helper/https-status-codes/https-status-codes.js");
const { Qualification, sequelize } = require("../../../../../models/index");
const { Op } = require("sequelize");

class QualificationController {
  // Fetch all Qualifications
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const whereClause = {};
      if (name) {
        whereClause.name = { [Op.like]: `%${name}%` };
      }
      const options = {
        where: whereClause,
        order: [['createdAt', 'DESC']],
      }
      await Paginate(Qualification, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching qualification:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single Qualification by ID
  async findOne(req, res) {
    try {
      const qualification = await CheckExits(Qualification, { id: req.params.id });
      if (!qualification) {
        return Base.sendError(res, HTTPS.NOT_FOUND, "qualification not found");
      }
      return Base.sendResponse(res, HTTPS.OK, qualification);
    } catch (error) {
      console.error("Error fetching qualification:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create Qualification
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const { name } = req.body;


      if (!name || typeof name !== "string" || name.trim() === "") {
        await t.rollback();
        return Base.sendError(res, HTTPS.BAD_REQUEST, "Qualification name is required");
      }

      const trimmedName = name.trim();

      const existingQualification = await CheckExits(Qualification, { name: trimmedName }, t);
      if (existingQualification) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Qualification already exists");
      }

      const newQualification = await CreateNew(Qualification, { name: trimmedName, status: 1 }, t);
      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, newQualification, "Qualification Created successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error creating Qualification:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update Qualification by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const data = {
        name: req.body.name.trim(),
      };

      const exits = await CheckExits(Qualification, { name: data.name }, t);
      if (exits?.id != id && exits !== null) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Qualification name already in use");
      }

      await UpdateData(Qualification, data, { id: id }, t);
      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, {}, "Qualification updated successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error updating Qualification:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete Qualification by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const qualification = await CheckExits(Qualification, { id }, t);
      if (!qualification) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "qualification not found");
      }

      await Qualification.destroy({ where: { id }, transaction: t });
      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, {}, "Qualification deleted successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error deleting Qualification:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update Qualification status
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Qualification, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(Qualification, { status: result.status ? false : true }, { id }, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, "Qualification status updated successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error updating Qualification status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new QualificationController();