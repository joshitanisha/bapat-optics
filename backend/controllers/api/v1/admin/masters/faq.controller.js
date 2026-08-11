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
const { Faq_Category, Faq, sequelize } = require("../../../../../models/index");
const { Op } = require("sequelize");
class FaqController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const faq_category_id = req.query.faq_category_id || "";
      const options = {
        include: [
          {
            model: Faq_Category,
          },
        ],
        where: {
          [Op.or]: [{ question: { [Op.like]: `%${name}%` } }],
          ...(faq_category_id ? { faq_category_id } : {}),
        },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Faq, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Faq :", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const include = [
        {
          model: Faq_Category,
        },
      ];
      const result = await CheckExits(Faq, { id: req.params.id }, t, include);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Faq not found");
      }

      const data = {
        question: result?.question,
        answer: result?.answer,
        faq_category_id: {
          value: result?.faq_category_id,
          name: "faq_category_id",
          label: result?.Faq_Category?.name,
        },
      };

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Faq :", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new country
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        // faq_category_id: req.body?.faq_category_id,
        question: req.body?.question?.trim(),
        answer: req.body?.answer?.trim(),
      };
      const exists = await CheckExits(
        Faq,
        { question: data?.question },
        t
      );

      if (exists) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Faq  already exists");
      }

      const newItem = await CreateNew(Faq, data, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newItem);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Faq :", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a country by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        // faq_category_id: req.body?.faq_category_id,
        question: req.body?.question?.trim(),
        answer: req.body?.answer?.trim(),
      };

      const exists = await CheckExits(
        Faq,
        { question: data?.question },
        t
      );

      if (exists?.id != id && exists !== null) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Faq already in use");
      }

      const update = await UpdateData(Faq, data, { id: id }, t);

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Faq  updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Faq :", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a country by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Faq, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Faq not found");
      }

      await Faq.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "Faq Category Successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Faq Category :", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Faq, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Faq,
        { status: result.status ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Faq  status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Faq status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new FaqController();
