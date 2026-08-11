const Base = require("../../../../../helper/exception_handling");
const { HTTPS } = require("../../../../../helper/https-status-codes/https-status-codes");
const { Advertisement_Banner, sequelize } = require("../../../../../models/index");
const { Op } = require("sequelize");
const { Paginate, SingleCheckExits, CheckExits, CreateNew, UpdateData, File_Uploade, } = require("../../../../../helper/common/utils/dbUtils");

class HomeBannerController {

  // Fetch all Data
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const options = {
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
        },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Advertisement_Banner, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching countries:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single Data by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const result = await CheckExits(Advertisement_Banner, { id: req.params.id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Add Banner not found");
      }
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Add Banner:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new Data
  async create(req, res) {
    const t = await sequelize.transaction();
    try {

      const data = {
        name: req.body?.name?.trim(),
        image: await File_Uploade(req.files?.image, "/uploads/masters/Advertisement_Banner")
      }

      const esits = await CheckExits(Advertisement_Banner, { name: data?.name }, t);

      if (esits) {
        await t.rollback(); return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Banner already exists"
        );
      }

      const newItem = await CreateNew(Advertisement_Banner, data, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newItem);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Add Banner:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a Data by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        name: req.body?.name?.trim(),
      }

      if (req.files && req.files.image) {
        data.image = await File_Uploade(req.files?.image, "/uploads/masters/Advertisement_Banner")
      }

      const exits = await CheckExits(Advertisement_Banner, { name: data.name, }, t);

      if (exits?.id != id && exits !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Add Banner name already in use"
        );
      }

      const update = await UpdateData(Advertisement_Banner, data, { id: id, }, t);

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Add Banner updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Add Banner:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a Data by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the Data exists
      const result = await CheckExits(Advertisement_Banner, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Add Banner not found");
      }

      await Advertisement_Banner.destroy({ where: { id }, transaction: t, });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "Add Banner Deleted Successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Add Banner:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a Data
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Advertisement_Banner, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(Advertisement_Banner, { status: result.status ? false : true }, { id }, t);

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Add Banner status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Add Banner status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new HomeBannerController();
