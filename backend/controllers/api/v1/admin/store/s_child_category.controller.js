const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
  getSingle,
} = require("../../../../../helper/common");
const Base = require("../../../../../helper/exception-handling");
const { HTTPS } = require("../../../../../helper/https-status-codes");
const { s_category, s_sub_category, s_child_category, sequelize } = require("../../../../../models/index");
const { Op } = require("sequelize");
class SSubCategoryController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const s_category_id = req.query.s_category_id || "";
      const s_sub_category_id = req.query.s_sub_category_id || "";

      const options = {
        include: [
          {
            model: s_category,
            where: s_category_id ? { id: s_category_id } : {}
          },
          {
            model: s_sub_category,
            where: s_sub_category_id ? { id: s_sub_category_id } : {}
          }
        ],
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
        },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(s_child_category, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Child Categories:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const include = [
        {
          model: s_category,
        },
        {
          model: s_sub_category,
        }
      ]
      const result = await getSingle(s_child_category, { id: req.params.id }, t, include);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Child Category not found");
      }

      const data = {
        name: result?.name,
        image: result?.image,
        s_category_id: {
          value: result?.s_category_id,
          name: "s_category_id",
          label: result?.s_category?.name
        },
        s_sub_category_id: {
          value: result?.s_sub_category_id,
          name: "s_sub_category_id",
          label: result?.s_sub_category?.name
        }
      }

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Child category:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new country
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        name: req.body?.name.trim(),
        s_category_id: req.body.s_category_id,
        s_sub_category_id: req.body.s_sub_category_id,
        image: await File_Uploade(req.files?.image, "/uploads/masters/s_child_category")
      }
      const existingCategory = await CheckExits(s_child_category,
        { name: data?.name, s_category_id: data?.s_category_id, s_sub_category_id: data?.s_sub_category_id }, t);

      if (existingCategory) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Child Category already exists"
        );
      }
      const newCategory = await CreateNew(s_child_category, data, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newCategory);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Child Category:", error);
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
        s_category_id: req.body.s_category_id,
        s_sub_category_id: req.body.s_sub_category_id,
      }

      if (req.files && req.files.image) {
        data.image = await File_Uploade(req.files?.image, "/uploads/masters/s_child_category")
      }

      const exits = await CheckExits(
        s_child_category,
        {
          name: data.name,
          s_category_id: data?.s_category_id,
          s_sub_category_id: req.body.s_sub_category_id,
        },
        t
      );

      if (exits?.id != id && exits !== null) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Child Category name already in use");
      }

      const update = await UpdateData(s_child_category, data, { id: id }, t);

      await t.commit();
      return Base.sendResponse(res, HTTPS.ACCEPTED, "Child category updated successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error updating child category:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a country by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const childcategory = await CheckExits(s_child_category, { id }, t);

      if (!childcategory) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Child Category not found");
      }

      await s_child_category.destroy({
        where: {
          id: id,
        },
        transaction: t,
      });


      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "Child Category deleted successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error deleting  Child Category:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }


  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const country = await CheckExits(s_child_category, { id }, t);

      if (!country) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Child Category not found");
      }

      await UpdateData(
        s_child_category,
        { status: country.status ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Child Category status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Child Category status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new SSubCategoryController();
