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
const {
  p_category,
  p_sub_category,
  p_child_category,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
class PSubCategoryController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const p_category_id = req.query.p_category_id || "";
      const item_type_id = req.query.item_type_id || "";

      const options = {
        include: [
          {
            model: p_category,
            where: {
              ...(p_category_id && { id: p_category_id }),
              ...(item_type_id && { item_type_id }),
              user_id: req?.user?.user_id,
            },
          },
        ],
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
        },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(p_sub_category, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Sub Categories:", error);
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
      ];
      const result = await CheckExits(
        p_sub_category,
        { id: req.params.id },
        t,
        include
      );

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Sub Category not found");
      }
      const data = {
        name: result?.name,
        image: result?.image,
        p_category_id: {
          value: result?.p_category_id,
          name: "p_category_id",
          label: result?.p_category?.name,
        },
      };
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching sub category:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new country
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        name: req?.body?.name.trim(),
        p_category_id: req?.body?.p_category_id,
        user_id: req?.user?.user_id,
        status: req?.user?.user_id === 1 ? true : false,
      };

      if (req?.body?.image) {
        data.image = req?.body?.image;
      } else if (req?.files && req?.files?.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/p_sub_category"
        );
      }

      const existingCategory = await CheckExits(
        p_sub_category,
        { name: req.body?.name, p_category_id: data?.p_category_id },
        t
      );

      if (existingCategory) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Sub Category already exists"
        );
      }
      const newCategory = await CreateNew(p_sub_category, data, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newCategory);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Sub Category:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a country by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        name: req.body.name.trim(),
        p_category_id: req.body.p_category_id,
      };

      if (req?.body?.image) {
        data.image = req?.body?.image;
      } else if (req.files && req.files.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/p_sub_category"
        );
      }

      const exits = await CheckExits(
        p_sub_category,
        {
          name: data.name,
          p_category_id: data?.p_category_id,
        },
        t
      );

      if (exits?.id != id && exits !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Sub Category name already in use"
        );
      }

      const update = await UpdateData(p_sub_category, data, { id: id }, t);

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Sub category updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating sub category:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a country by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const subcategory = await CheckExits(p_sub_category, { id }, t);

      if (!subcategory) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Sub Category not found");
      }

      const Childs = await p_child_category.findAll({
        where: {
          p_sub_category_id: id,
        },
        transaction: t,
      });

      for (const child of Childs) {
        await p_child_category.destroy({
          where: {
            id: child.id,
          },
          transaction: t,
        });
      }

      await p_sub_category.destroy({
        where: {
          id: id,
        },
        transaction: t,
      });

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Sub Category deleted successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error deleting  Sub Category:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const country = await CheckExits(p_sub_category, { id }, t);

      if (!country) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Sub Category not found");
      }

      await UpdateData(
        p_sub_category,
        { status: country.status ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Sub Category status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Category status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new PSubCategoryController();
