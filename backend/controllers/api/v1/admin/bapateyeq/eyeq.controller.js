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
const { Eyeq, sequelize } = require("../../../../../models/index");
const { Op } = require("sequelize");
class EyeqController {
  // Fetch all Eyeq
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const options = {
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
        },
        order: [["sort_order", "ASC"]],
      };
      await Paginate(Eyeq, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Eyeq:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single Eyeq by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const result = await CheckExits(Eyeq, { id: req.params.id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Eyeq not found");
      }
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Eyeq:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new Eyeq
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const Count = await Eyeq.count({});
      const data = {
        name: req.body?.name?.trim(),
        description: req.body?.description?.trim(),
        sort_order: Count + 1,
        image: await File_Uploade(req.files?.image, "/uploads/masters/eyeq"),
      };
      const exists = await CheckExits(Eyeq, { name: data?.name }, t);

      if (exists) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Eyeq already exists");
      }

      const newItem = await CreateNew(Eyeq, data, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newItem);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Eyeq:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a Eyeq by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        name: req.body?.name?.trim(),
        description: req.body?.description?.trim(),
        sort_order: req.body.sort_order,
      };

      if (req.files && req.files.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/eyeq",
        );
      }

      const exists = await CheckExits(Eyeq, { name: data?.name }, t);

      if (exists?.id != id && exists !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Eyeq name already in use",
        );
      }

      const exitssort_order = await Eyeq.findOne({
        where: {
          sort_order: req.body.sort_order,
        },
        transaction: t,
      });

      const exitsid = await Eyeq.findOne({
        where: {
          id: req.params.id,
        },
        transaction: t,
      });

      if (Number(exitssort_order?.sort_order) === Number(req.body.sort_order)) {
        const update = await Eyeq.update(
          { sort_order: exitsid?.sort_order },
          {
            where: {
              id: exitssort_order?.id,
            },
            transaction: t,
          },
        );
      }

      const update = await UpdateData(Eyeq, data, { id: id }, t);

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Eyeq updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Eyeq:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete Eyeq by id
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Eyeq, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Eyeq not found");
      }

      await Eyeq.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "Eyeq Deleted Successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Eyeq:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Eyeq, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Eyeq,
        { status: result.status ? false : true },
        { id },
        t,
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Eyeq status updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Eyeq status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new EyeqController();
