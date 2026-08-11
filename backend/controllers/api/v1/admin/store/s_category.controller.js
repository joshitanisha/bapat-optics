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
const {
  s_category,
  s_sub_category,
  s_child_category,
  sequelize,
} = require("../../../../../models/index");
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
        order: [["sort_order", "ASC"]],
      };
      await Paginate(s_category, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching countries:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const result = await CheckExits(s_category, { id: req.params.id }, t);

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
        image: await File_Uploade(
          req.files?.image,
          "/uploads/masters/s_category"
        ),
        banner_image: await File_Uploade(
          req.files?.banner_image,
          "/uploads/masters/s_category"
        ),
        is_restaurant_flow: req?.body?.is_restaurant_flow,
      };

      const greaterCategory = await s_category.findOne({
        order: [["sort_order", "DESC"]],
        limit: 1,
        transaction: t,
      });

      data.sort_order = Number(greaterCategory?.sort_order) + 1;
      const existingCategory = await CheckExits(
        s_category,
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

      const newCategory = await CreateNew(s_category, data, t);

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
        is_restaurant_flow: req?.body?.is_restaurant_flow,
      };

      if (req.files && req.files.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/s_category"
        );
      }

      if (req.files && req.files.banner_image) {
        data.banner_image = await File_Uploade(
          req.files?.banner_image,
          "/uploads/masters/s_category"
        );
      }

      const exits = await CheckExits(s_category, { name: data.name }, t);

      if (exits?.id != id && exits !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Category name already in use"
        );
      }

      const update = await UpdateData(s_category, data, { id: id }, t);

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

      const category = await CheckExits(s_category, { id }, t);

      if (!category) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Category not found");
      }

      const sub_categories = await s_sub_category.findAll({
        where: {
          s_category_id: id,
        },
        transaction: t,
      });

      for (const sub of sub_categories) {
        const childs = await s_child_category.findAll({
          where: {
            s_sub_category_id: sub.id,
          },
          transaction: t,
        });

        for (const child of childs) {
          await s_child_category.destroy({
            where: {
              id: child.id,
            },
            transaction: t,
          });
        }

        await s_sub_category.destroy({
          where: {
            id: sub.id,
          },
          transaction: t,
        });
      }

      await s_category.destroy({
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

      const country = await CheckExits(s_category, { id }, t);

      if (!country) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Category not found");
      }

      await UpdateData(
        s_category,
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

  async ShortOrder(req, res) {
    const t = await sequelize.transaction(); // Start a new transaction

    // Check if sort_order is provided in the request body, and if it's neither 0 nor an empty string
    if (
      req?.body?.sort_order === undefined ||
      req?.body?.sort_order === "" ||
      req?.body?.sort_order === 0
    ) {
      return res.send(Base.sendError("Invalid sort_order value"));
    }

    try {
      const { id } = req.params;

      // Find the data with the same sort_order
      const dataToUpdate = await CheckExits(
        s_category,
        { sort_order: req?.body?.sort_order },
        t
      );

      if (!dataToUpdate) {
        // If no existing category has the requested sort_order, proceed with updating the category
        await UpdateData(
          s_category,
          { sort_order: req?.body?.sort_order },
          { id },
          t
        );
        await t.commit(); // Commit the transaction
        return Base.sendResponse(
          res,
          HTTPS.OK,
          "Category Sort Order updated successfully"
        );
      }

      // If dataToUpdate exists, swap the sort_order with the category having the requested sort_order
      const dataWithId = await CheckExits(s_category, { id }, t);

      if (!dataWithId) {
        await t.rollback();
        return Base.sendError("Category with the given ID not found");
      }

      // Swap the sort_order values between the two categories
      const tempSortOrder = dataWithId.sort_order;
      dataWithId.sort_order = dataToUpdate.sort_order;
      dataToUpdate.sort_order = tempSortOrder;

      // Save the changes to both categories within the same transaction
      await dataWithId.save({ transaction: t });
      await dataToUpdate.save({ transaction: t });

      await t.commit(); // Commit the transaction
      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Category Sort Order updated successfully"
      );
    } catch (error) {
      await t.rollback(); // If an error occurs, rollback the transaction
      console.error(error);
      return res.send(Base.sendError(error.message || error));
    }
  }
}

module.exports = new SCategoryController();
