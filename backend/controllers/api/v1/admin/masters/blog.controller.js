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
const { Blog, sequelize } = require("../../../../../models/index");
const { Op } = require("sequelize");
class BlogController {
  // Fetch all blog
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const options = {
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
        },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Blog, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Blog:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single blog by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const result = await CheckExits(Blog, { id: req.params.id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Blog not found");
      }
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Blog:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new blog
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        name: req.body?.name?.trim(),
        subname: req.body?.subname?.trim(),
        description: req.body?.description?.trim(),
        image: await File_Uploade(req.files?.image, "/uploads/masters/blog"),
      };
      const exists = await CheckExits(Blog, { name: data?.name }, t);

      if (exists) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Blog already exists");
      }

      const newItem = await CreateNew(Blog, data, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newItem);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Blog:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a blog by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        name: req.body?.name?.trim(),
        subname: req.body?.subname?.trim(),
        description: req.body?.description?.trim(),
      };

      if (req.files && req.files.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/blog",
        );
      }

      const exists = await CheckExits(Blog, { name: data?.name }, t);

      if (exists?.id != id && exists !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Blog name already in use",
        );
      }

      const update = await UpdateData(Blog, data, { id: id }, t);

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Blog updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Blog:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete blog by id
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Blog, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Blog not found");
      }

      await Blog.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "Blog Deleted Successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Blog:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Blog, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Blog,
        { status: result.status ? false : true },
        { id },
        t,
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Blog status updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Blog status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new BlogController();
