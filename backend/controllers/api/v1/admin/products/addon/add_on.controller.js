const Base = require("../../../../../../helper/exception_handling");
const {
  HTTPS,
} = require("../../../../../../helper/https-status-codes/https-status-codes");
const { Addon, sequelize } = require("../../../../../../models/index");
const { Op } = require("sequelize");
const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
} = require("../../../../../../helper/common/utils/dbUtils");

class HomeAddonController {
  // Fetch all Data
  async findAll(req, res) {

    console.log('hhhhhhhhhhhhhhhhhh');
    
    try {
      const name = req.query.term?.trim() || "";
      const options = {
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
        },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Addon, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching countries:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single Data by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const result = await CheckExits(Addon, { id: req.params.id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Add Addon not found");
      }
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Add Addon:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new Data
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        name: req.body?.name?.trim(),
        price: req.body?.price?.trim(),
        mrp: req.body?.mrp?.trim(),
        description: req.body?.description?.trim(),
        status: 1,
        image: await File_Uploade(req.files?.image, "/uploads/masters/addon"),
      };

      const esits = await CheckExits(Addon, { name: data?.name }, t);

      if (esits) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Addon already exists"
        );
      }

      const newItem = await CreateNew(Addon, data, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newItem);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Add Addon:", error);
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
        price: req.body?.price?.trim(),
        mrp: req.body?.mrp?.trim(),
        description: req.body?.description?.trim(),
      };

      if (req.files && req.files.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/addon"
        );
      }

      const exits = await CheckExits(Addon, { name: data.name }, t);

      if (exits?.id != id && exits !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Add Addon name already in use"
        );
      }

      const update = await UpdateData(Addon, data, { id: id }, t);

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Add Addon updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Add Addon:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a Data by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the Data exists
      const result = await CheckExits(Addon, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Add Addon not found");
      }

      await Addon.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "Add Addon Deleted Successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Add Addon:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a Data
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Addon, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Addon,
        { status: result.status ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Add Addon status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Add Addon status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new HomeAddonController();
