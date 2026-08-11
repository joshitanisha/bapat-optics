const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
} = require("../../../../../../helper/common");
const Base = require("../../../../../../helper/exception-handling");
const { RoleId, CouponType } = require("../../../../../../helper/fix_ids");
const { HTTPS } = require("../../../../../../helper/https-status-codes");
const {
  Offered_Product,
  Product,
  Discount_Type,
  Product_Stock,
  Purchase_Order_Product,
  Receiving_Product,
  Subscription_Product_Details,
  Product_Order_Detail,
  Product_Waste,
  sequelize,
} = require("../../../../../../models/index");
const { Op } = require("sequelize");
class OfferedController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";

      const options = {
        include: [
          {
            model: Product,
          },
          // {
          //   model: Receiving_Product,
          // },
          // {
          //   model: Purchase_Order_Product,
          // },
          // {
          //   model: Subscription_Product_Details,
          // },
          // {
          //   model: Product_Order_Detail,
          // },
        ],
        where: {
          status: true,
          [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
        },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Product_Waste, options, req, res, Op);
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
          model: Product,
        },
      ];
      const result = await CheckExits(
        Product_Stock,
        { product_id: req.params.id },
        t,
        include
      );

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Product not found");
      }

      const data = {
        id: result.id,
        general_stock: result?.general_stock,
        subscription_stock: result?.subscription_stock,
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
        product_id: req.params?.product_id,
        subscription_stock: req.body?.subscription_stock,
        general_stock: req.body?.general_stock,
      };
      const exists = await CheckExits(
        Product,
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
        product_id: id,
        subscription_stock: req.body?.subscription_stock,
        general_stock: req.body?.general_stock,
      };

      const exists = await CheckExits(
        Product_Stock,
        { product_id: data?.product_id },
        t
      );
      if (exists) {
        const update = await UpdateData(
          Product_Stock,
          data,
          { product_id: id },
          t
        );
      } else {
        const create = await CreateNew(Product_Stock, data, t);
      }

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Product stock updated successfully"
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
