const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
} = require("../../../../../helper/common/utils/dbUtils");
const Base = require("../../../../../helper/exception_handling");
const {
  HTTPS,
} = require("../../../../../helper/https-status-codes/https-status-codes");
const { Face_Width, sequelize } = require("../../../../../models/index");
const { Op } = require("sequelize");
class Face_WidthController {
  // Fetch all Face_Width
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const options = {
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
        },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Face_Width, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Face_Width:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single Face_Width by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const result = await CheckExits(Face_Width, { id: req.params.id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Face_Width not found");
      }
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Face_Width:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new Face_Width
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        name: req.body?.name?.trim(),
        image: await File_Uploade(
          req.files?.image,
          "/uploads/masters/facewidth"
        ),
        status: 1,
      };
      const exists = await CheckExits(Face_Width, { name: data?.name }, t);

      if (exists) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Face_Width already exists"
        );
      }

      const newItem = await CreateNew(Face_Width, data, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newItem);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Face_Width:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a Face_Width by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        name: req.body?.name?.trim(),
      };

      if (req.files && req.files.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/facewidth"
        );
      }

      const exists = await CheckExits(Face_Width, { name: data?.name }, t);

      if (exists?.id != id && exists !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Face_Width name already in use"
        );
      }

      const update = await UpdateData(Face_Width, data, { id: id }, t);

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Face_Width updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Face_Width:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete Face_Width by id
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Face_Width, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Face_Width not found");
      }

      await Face_Width.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Face_Width Deleted Successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Face_Width:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Face_Width, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Face_Width,
        { status: result.status ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Face_Width status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Face_Width status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new Face_WidthController();
