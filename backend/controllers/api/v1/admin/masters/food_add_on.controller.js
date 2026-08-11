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
  Food_Add_On,
  Food_Add_On_Category,
  Store_Detail,
  Product,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
class Food_Add_OnController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const add_on_category_id = req.query.add_on_category_id || "";
      const options = {
        include: [
          {
            model: Food_Add_On_Category,
          },
          {
            model: Store_Detail,
          },
        ],
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
          ...(req?.user?.role_id === RoleId.Vendor
            ? { store_id: req?.user?.store_id }
            : {}),
          ...(add_on_category_id
            ? { add_on_category_id: add_on_category_id }
            : {}),
        },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Food_Add_On, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Food_Add_Ons:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const include = [
        {
          model: Food_Add_On_Category,
        },
      ];
      const result = await CheckExits(
        Food_Add_On,
        { id: req.params.id },
        t,
        include
      );

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Food_Add_On not found");
      }

      const data = {
        name: result?.name,
        image: result?.image,
        price: result?.price,
        add_on_category_id: {
          value: result?.add_on_category_id,
          name: "add_on_category_id",
          label: result?.Food_Add_On_Category?.name,
        },
      };
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Food_Add_On:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new country
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        add_on_category_id: req.body?.add_on_category_id,
        name: req.body?.name?.trim(),
        price: req.body?.price,
        store_id: req?.user?.store_id,
      };

      if (req?.body?.image) {
        data.image = req?.body?.image;
      } else {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/food_add_on"
        );
      }

      const exists = await CheckExits(
        Food_Add_On,
        { name: data?.name, store_id: data?.store_id },
        t
      );

      if (exists) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Food_Add_On already exists"
        );
      }

      const newItem = await CreateNew(Food_Add_On, data, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newItem);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Food_Add_On:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a country by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        add_on_category_id: req.body?.add_on_category_id,
        name: req.body?.name?.trim(),
        price: req.body?.price,
        store_id: req?.user?.store_id,
      };

      if (req?.body?.image) {
        data.image = req?.body?.image;
      } else if (req.files && req.files.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/food_add_on"
        );
      }

      const exists = await CheckExits(
        Food_Add_On,
        { name: data?.name, store_id: data?.store_id },
        t
      );

      if (exists?.id != id && exists !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Food_Add_On name already in use"
        );
      }

      const update = await UpdateData(Food_Add_On, data, { id: id }, t);

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Food_Add_On updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Food_Add_On:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a country by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Food_Add_On, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Food_Add_On not found");
      }

      await Food_Add_On.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Food_Add_On Deleted Successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Food_Add_On:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Food_Add_On, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Food_Add_On,
        { status: result.status ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Food_Add_On status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Food_Add_On status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new Food_Add_OnController();
