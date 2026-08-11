const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
} = require("../../../../../../helper/common/utils/dbUtils");
const Base = require("../../../../../../helper/exception_handling");
const { RoleId, CouponType } = require("../../../../../../helper/fix_ids");
const {
  HTTPS,
} = require("../../../../../../helper/https-status-codes/https-status-codes");
const {
  Offered_Product,
  Product,
  Store_Detail,
  Discount_Type,
  Offer,
  sequelize,
} = require("../../../../../../models/index");
const { Op } = require("sequelize");
class OfferedController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const discount_type_id = req.query.discount_type_id || "";

      const options = {
        include: [
        
          {
            model: Offer,
          },
          {
            model: Product,
            where: {
              [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
            },
          },
          // {
          //   model: Store_Detail,
          // }
        ],
        // where: {
        //   [Op.or]: [{ discount_type_id: { [Op.like]: `%${name}%` } }],
        //   ...req.user.role_id === RoleId.Vendor ? { store_id: req.user.store_id } : {},
        //   ...discount_type_id ? { discount_type_id } : {}
        // },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Offered_Product, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Offered Products:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const include = [
        {
          model: Offer,
        },
        {
          model: Product,
        },
      ];
      const result = await CheckExits(
        Offered_Product,
        { id: req.params.id },
        t,
        include
      );

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Product not found");
      }

      const data = {
        offer_id: {
          value: result?.offer_id,
          name: "offer_id",
          label: result?.Offer?.name,
        },
        product_id: {
          value: result?.product_id,
          name: "product_id",
          label: result?.Product?.name,
        },
      };

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Offered Product:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new country
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        // store_id: req.user.store_id,
        product_id: req.body?.product_id,
        offer_id: req.body?.offer_id,
      };
      const exists = await CheckExits(
        Offered_Product,
        { product_id: data?.product_id },
        t
      );

      if (exists) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Offered Product already exists"
        );
      }

      const newItem = await CreateNew(Offered_Product, data, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newItem);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Offered Product:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a country by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        // store_id: req.user.store_id,
        product_id: req.body?.product_id,
        offer_id: req.body?.offer_id,
      };

      // if (req.files && req.files.image) {
      //   data.image = await File_Uploade(
      //     req.files?.image,
      //     "/uploads/masters/offered_product"
      //   );
      // }

      const exists = await CheckExits(
        Offered_Product,
        { product_id: data?.product_id },
        t
      );

      if (exists?.id != id && exists !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Offered Product already in use"
        );
      }

      const update = await UpdateData(Offered_Product, data, { id: id }, t);

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Offered Product updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Offered Product:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a country by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Offered_Product, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_FOUND,
          "Offered Product not found"
        );
      }

      await Offered_Product.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Offered Product Deleted Successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Offered Product:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Offered_Product, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Offered_Product,
        { status: result.status ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Offered Product status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Offered Product status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new OfferedController();
