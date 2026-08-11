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
  LensType,
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
        order: [["id", "DESC"]],
      };

      await Paginate(LensType, options, req, res, Op);
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
        LensType,
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
      const Count = await LensType.count({});
      const data = {
        name: req.body?.name.trim(),

        status: true,
      };
      if (req?.body?.image) {
        data.image = req?.body?.image;
      } else if (req?.files && req?.files?.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/LensType"
        );
      }

      const existingCategory = await CheckExits(
        LensType,
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

      const newCategory = await CreateNew(LensType, data, t);

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
      };

      if (req?.body?.image) {
        data.image = req?.body?.image;
      } else if (req.files && req.files.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/LensType"
        );
      }

      const exits = await CheckExits(LensType, { name: data.name }, t);

      if (exits?.id != id && exits !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Category name already in use"
        );
      }

      

      const exitsid = await LensType.findOne({
        where: {
          id: req.params.id,
        },
        transaction: t,
      });

      console.log(exitsid, "exitsid");

      
      const update = await UpdateData(LensType, data, { id: id }, t);
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

      const category = await CheckExits(LensType, { id }, t);

      if (!category) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Category not found");
      }

      

      await LensType.destroy({
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

      const country = await CheckExits(LensType, { id }, t);

      if (!country) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Category not found");
      }

      await UpdateData(
        LensType,
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

      const country = await CheckExits(LensType, { id }, t);

      if (!country) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Category not found");
      }

      await UpdateData(
        LensType,
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

      const country = await CheckExits(LensType, { id }, t);

      if (!country) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Category not found");
      }

      await UpdateData(
        LensType,
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
