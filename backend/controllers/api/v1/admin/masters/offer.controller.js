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
const {
  Offer,
  Discount_Type,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
class OfferController {
  // Fetch all Offer
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const options = {
        include: [
          {
            model: Discount_Type,
          },
        ],

        where: {
          [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
        },
         order: [["sort_order", "ASC"]],
      };
      await Paginate(Offer, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Offer:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single Offer by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const include = [
        {
          model: Discount_Type,
        },
      ];
      const result = await CheckExits(Offer, { id: req.params.id }, t, include);
      const data = {
        name: result?.name,
        image: result?.image,
        discount: result?.discount,
        sort_order: result?.sort_order,
        message: result?.message,
        discount_type_id: {
          value: result?.discount_type_id,
          name: "discount_type_id",
          label: result?.Discount_Type?.name,
        },
      };

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Offer not found");
      }
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Offer:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new Offer
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const Count = await Offer.count({});
      const data = {
        name: req.body?.name?.trim(),
        message: req.body?.message?.trim(),
        discount_type_id: req.body?.discount_type_id,
        discount: req.body?.discount,
        sort_order: Count + 1,
        status: 1,
      };
      if (req.files && req.files.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/Uploads/masters/offer",
        );
      }
      const exists = await CheckExits(Offer, { name: data?.name }, t);

      if (exists) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Offer already exists",
        );
      }

      const newItem = await CreateNew(Offer, data, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newItem);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Offer:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a Offer by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        name: req.body?.name?.trim(),
        message: req.body?.message?.trim(),
        discount_type_id: req.body?.discount_type_id,
        discount: req.body?.discount,
        sort_order: req.body.sort_order,
      };
      if (req.files && req.files.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/Uploads/masters/offer",
        );
      }

      const exists = await CheckExits(Offer, { name: data?.name }, t);

      if (exists?.id != id && exists !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Offer name already in use",
        );
      }

      const exitssort_order = await Offer.findOne({
        where: {
          sort_order: req.body.sort_order,
        },
        transaction: t,
      });

      const exitsid = await Offer.findOne({
        where: {
          id: req.params.id,
        },
        transaction: t,
      });

      if (Number(exitssort_order?.sort_order) === Number(req.body.sort_order)) {
        const update = await Offer.update(
          { sort_order: exitsid?.sort_order },
          {
            where: {
              id: exitssort_order?.id,
            },
            transaction: t,
          },
        );
      }
      const update = await UpdateData(Offer, data, { id: id }, t);

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Offer updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Offer:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete Offer by id
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Offer, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Offer not found");
      }

      await Offer.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "Offer Deleted Successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Offer:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Offer, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Offer,
        { status: result.status ? false : true },
        { id },
        t,
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Offer status updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Offer status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new OfferController();
