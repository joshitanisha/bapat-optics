const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
} = require("../../../../../helper/common");
const Base = require("../../../../../helper/exception-handling");
const { HTTPS } = require("../../../../../helper/https-status-codes");
const { Restaurant_Category, sequelize } = require("../../../../../models/index");
const { Op } = require("sequelize");
class SCategoryController {
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
      await Paginate(Restaurant_Category, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching categories:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const result = await CheckExits(Restaurant_Category, { id: req.params.id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Category not found");
      }

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching category:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new country
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        name: req.body?.name.trim(),
        image: await File_Uploade(req.files?.image, "/uploads/masters/restaurant_category")
      }

      const existingCategory = await CheckExits(Restaurant_Category, { name: data?.name }, t);

      if (existingCategory) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Category already exists"
        );
      }

      const newCategory = await CreateNew(Restaurant_Category, data, t);

      await t.commit();
      return Base.sendResponse(res, HTTPS.CREATED, newCategory);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Category:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a country by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        name: req.body?.name.trim(),
      }

      if (req.files && req.files.image) {
        data.image = await File_Uploade(req.files?.image, "/uploads/masters/restaurant_category")
      }

      const exits = await CheckExits(Restaurant_Category, { name: data.name }, t);

      if (exits?.id != id && exits !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Category name already in use"
        );
      }

      const update = await UpdateData(Restaurant_Category, data, { id: id, }, t);

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "category updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating category:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a country by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const category = await CheckExits(Restaurant_Category, { id }, t);

      if (!category) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Category not found");
      }

      await Restaurant_Category.destroy({
        where: {
          id,
        },
        transaction: t,
      });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "Category deleted successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error deleting Category:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }


  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const country = await CheckExits(Restaurant_Category, { id }, t);

      if (!country) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Category not found");
      }

      await UpdateData(
        Restaurant_Category,
        { status: country.status ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Category status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Category status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new SCategoryController();
