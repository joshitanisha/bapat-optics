const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
  getSingle,
} = require("../../../../../helper/common/utils/dbUtils");
const Base = require("../../../../../helper/exception_handling");
const { HTTPS } = require("../../../../../helper/https-status-codes/https-status-codes");
const { p_category, p_sub_category, p_child_category, sequelize } = require("../../../../../models/index");
const { Op } = require("sequelize");
class PSubCategoryController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const p_category_id = req.query.p_category_id || "";
      const p_sub_category_id = req.query.p_sub_category_id || "";

      const options = {
        include: [
          {
            model: p_category,
            where: p_category_id ? { id: p_category_id } : {}
          },
          {
            model: p_sub_category,
            where: p_sub_category_id ? { id: p_sub_category_id } : {}
          }
        ],
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
        },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(p_child_category, options, req, res, Op);
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
          model: p_category,
        },
        {
          model: p_sub_category,
        }
      ]
      const result = await getSingle(p_child_category, { id: req.params.id }, t, include);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Child Category not found");
      }

      const data = {
        name: result?.name,
        image: result?.image,
        p_category_id: {
          value: result?.p_category_id,
          name: "p_category_id",
          label: result?.p_category?.name
        },
        p_sub_category_id: {
          value: result?.p_sub_category_id,
          name: "p_sub_category_id",
          label: result?.p_sub_category?.name
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
        p_category_id: req.body.p_category_id,
        p_sub_category_id: req.body.p_sub_category_id,
        image: await File_Uploade(req.files?.image, "/uploads/masters/p_child_category")
      }
      const existingCategory = await CheckExits(p_child_category,
        { name: data?.name, p_category_id: data?.p_category_id, p_sub_category_id: data?.p_sub_category_id }, t);

      if (existingCategory) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Child Category already exists"
        );
      }
      const newCategory = await CreateNew(p_child_category, data, t);

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
        p_category_id: req.body.p_category_id,
        p_sub_category_id: req.body.p_sub_category_id,
      }

      if (req.files && req.files.image) {
        data.image = await File_Uploade(req.files?.image, "/uploads/masters/p_child_category")
      }

      const exits = await CheckExits(
        p_child_category,
        {
          name: data.name,
          p_category_id: data?.p_category_id,
          p_sub_category_id: req.body.p_sub_category_id,
        },
        t
      );

      if (exits?.id != id && exits !== null) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Child Category name already in use");
      }

      const update = await UpdateData(p_child_category, data, { id: id }, t);

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

      const childcategory = await CheckExits(p_child_category, { id }, t);

      if (!childcategory) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Child Category not found");
      }

      await p_child_category.destroy({
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

      const country = await CheckExits(p_child_category, { id }, t);

      if (!country) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Child Category not found");
      }

      await UpdateData(
        p_child_category,
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

module.exports = new PSubCategoryController();
