const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
} = require("../../../../../helper/common/utils/dbUtils");
const Base = require("../../../../../helper/exception_handling");
const { RoleId } = require("../../../../../helper/fix_ids");
const { HTTPS } = require("../../../../../helper/https-status-codes/https-status-codes");
const {
  Food_Add_On_Category,
  Store_Detail,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
class Food_Add_On_CategoryController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const options = {
        include: [
          {
            model: Store_Detail,
          },
        ],
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
          ...(req?.user?.role_id === RoleId.Vendor
            ? { store_id: req?.user?.store_id }
            : {}),
        },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Food_Add_On_Category, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Food_Add_On_Categorys:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const include = [
        {
          model: Store_Detail,
        },
      ];
      const result = await CheckExits(
        Food_Add_On_Category,
        { id: req.params.id },
        t,
        include
      );

      if (!result) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_FOUND,
          "Food_Add_On_Category not found"
        );
      }
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Food_Add_On_Category:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new country
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        name: req.body?.name?.trim(),
        store_id: req?.user?.store_id,
      };
      if (req.files && req.files?.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/food_add_on_category"
        );
      }
      const exists = await CheckExits(
        Food_Add_On_Category,
        { name: data?.name, store_id: data?.store_id },
        t
      );

      if (exists) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Food_Add_On_Category already exists"
        );
      }

      const newItem = await CreateNew(Food_Add_On_Category, data, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newItem);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Food_Add_On_Category:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a country by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        name: req.body?.name?.trim(),
        store_id: req?.user?.store_id,
      };

      if (req.files && req.files.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/food_add_on_category"
        );
      }

      const exists = await CheckExits(
        Food_Add_On_Category,
        { name: data?.name, store_id: data?.store_id },
        t
      );

      if (exists?.id != id && exists !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Food_Add_On_Category name already in use"
        );
      }

      const update = await UpdateData(
        Food_Add_On_Category,
        data,
        { id: id },
        t
      );

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Food_Add_On_Category updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Food_Add_On_Category:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a country by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Food_Add_On_Category, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_FOUND,
          "Food_Add_On_Category not found"
        );
      }

      await Food_Add_On_Category.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Food_Add_On_Category Deleted Successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Food_Add_On_Category:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Food_Add_On_Category, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Food_Add_On_Category,
        { status: result.status ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Food_Add_On_Category status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Food_Add_On_Category status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new Food_Add_On_CategoryController();
