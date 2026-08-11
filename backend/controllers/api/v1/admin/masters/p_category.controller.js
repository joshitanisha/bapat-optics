const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
} = require("../../../../../helper/common/utils/dbUtils");
const Base = require("../../../../../helper/exception_handling");
const IDS = require("../../../../../helper/fix_ids");
const {
  HTTPS,
} = require("../../../../../helper/https-status-codes/https-status-codes");
const {
  p_category,
  p_sub_category,
  p_child_category,
  Item_Type,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
const { transaction } = require("../../mobile/wallet/wallet.controller");
class PCategoryController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";

      const options = {
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
        },
        order: [["sort_order", "ASC"]],
      };

      await Paginate(p_category, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching countries:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const include = [];
      const result = await CheckExits(
        p_category,
        { id: req.params.id },
        t,
        include
      );

      // if (!result) {
      //   await t.rollback();
      //   return Base.sendError(res, HTTPS.NOT_FOUND, "Category not found");
      // }

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
      const Count = await p_category.count({});
      const data = {
        name: req.body?.name.trim(),
        tax_percentage: req.body?.tax_percentage.trim(),
        discount_percentage: req.body?.discount_percentage.trim(),
        status: true,
        sort_order: Count + 1,
      };

      if (req?.body?.image) {
        data.image = req?.body?.image;
      } else if (req?.files && req?.files?.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/p_category"
        );
      }

      const existingCategory = await CheckExits(
        p_category,
        { name: data?.name },
        t
      );

      if (existingCategory) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Category already exists"
        );
      }

      const newCategory = await CreateNew(p_category, data, t);

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
        tax_percentage: req.body?.tax_percentage.trim(),
        discount_percentage: req.body?.discount_percentage.trim(),
        sort_order: req.body.sort_order,
      };

      if (req?.body?.image) {
        data.image = req?.body?.image;
      } else if (req.files && req.files.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/p_category"
        );
      }

      const exits = await CheckExits(p_category, { name: data.name }, t);

      if (exits?.id != id && exits !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Category name already in use"
        );
      }

      const exitssort_order = await p_category.findOne({
        where: {
          sort_order: req.body.sort_order,
        },
        transaction: t,
      });

      const exitsid = await p_category.findOne({
        where: {
          id: req.params.id,
        },
        transaction: t,
      });

      

      if (Number(exitssort_order?.sort_order) === Number(req.body.sort_order)) {
        const update = await p_category.update(
          { sort_order: exitsid?.sort_order },
          {
            where: {
              id: exitssort_order?.id,
            },
            transaction: t,
          }
        );
      }
      const update = await UpdateData(p_category, data, { id: id }, t);
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

      const category = await CheckExits(p_category, { id }, t);

      if (!category) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Category not found");
      }

      const sub_categories = await p_sub_category.findAll({
        where: {
          p_category_id: id,
        },
        transaction: t,
      });

      for (const sub of sub_categories) {
        const childs = await p_child_category.findAll({
          where: {
            p_sub_category_id: sub.id,
          },
          transaction: t,
        });

        for (const child of childs) {
          await p_child_category.destroy({
            where: {
              id: child.id,
            },
            transaction: t,
          });
        }

        await p_sub_category.destroy({
          where: {
            id: sub.id,
          },
          transaction: t,
        });
      }

      await p_category.destroy({
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

      const country = await CheckExits(p_category, { id }, t);

      if (!country) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Category not found");
      }

      await UpdateData(
        p_category,
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

  async statusCustomer(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const country = await CheckExits(p_category, { id }, t);

      if (!country) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Category not found");
      }

      await UpdateData(
        p_category,
        { customer_view: country.customer_view ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Category customer_view updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Category status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async eightPlusstatus(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const country = await CheckExits(p_category, { id }, t);

      if (!country) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Category not found");
      }

      await UpdateData(
        p_category,
        { eight_plus_status: country.eight_plus_status ? false : true },
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

module.exports = new PCategoryController();
