

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
  Offered_Product,
  Offer,
  Discount_Type,
  Product,
  Benifit_Product,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");

class OfferedProductController {
  // Fetch all Offered_Product
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";

      const options = {
        include: [
          { model: Offer },
          { model: Discount_Type },
          {
            model: Benifit_Product,
            include: [{ model: Product }],
          },
        ],
        where: {},
        order: [["createdAt", "DESC"]],
      };

      if (name) {
        options.where.name = { [Op.like]: `%${name}%` };
      }

      await Paginate(Offered_Product, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Offered Product:", error);
      return Base.sendError(
        res,
        HTTPS.INTERNAL_SERVER_ERROR,
        error.message || error
      );
    }
  }

  // Fetch a single Offered_Product by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const include = [
        { model: Offer },
        { model: Discount_Type },
        {
          model: Benifit_Product,
          include: [{ model: Product }],
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
        return Base.sendError(
          res,
          HTTPS.NOT_FOUND,
          "Offered Product not found"
        );
      }

      const data = {
        id: result.id,
        name: result.name,
        message: result.message,
        offer_id: {
          value: result.offer_id,
          name: "offer_id",
          label: result.Offer?.name,
        },
        discount: result.discount,
        discount_type_id: {
          value: result.discount_type_id,
          name: "discount_type_id",
          label: result.Discount_Type?.name,
        },
        status: result.status,
        image: result.image,
        products:
          result.Benifit_Products?.map((bp) => ({
            product_id: {
              value: bp.product_id,
              name: "product_id",
              label: bp.Product?.name,
            },
          })) || [],
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      };

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Offered Product:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new Offered_Product
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      // console.log("Raw request body:", req.body); // Debug log
      // console.log("Raw files:", req.files); // Debug log

      const data = {
        name: req.body?.name?.trim(),
        message: req.body?.message?.trim(),
        offer_id: req.body?.offer_id,
        discount: req.body?.discount,
        discount_type_id: req.body?.discount_type_id,
        status: req.body?.status || true,
        image: await File_Uploade(
          req.files?.image,
          "/Uploads/masters/offered_product"
        ),
      };

      // Validate required fields
      if (
        !data.name ||
        !data.offer_id ||
        !data.discount ||
        !data.discount_type_id
      ) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.BAD_REQUEST,
          "Missing required fields: name, offer_id, discount, or discount_type_id"
        );
      }

      // Check if name already exists
      const existsName = await CheckExits(
        Offered_Product,
        { name: data?.name },
        t
      );

      if (existsName) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Offered Product name already exists"
        );
      }

      const newItem = await CreateNew(Offered_Product, data, t);
      // console.log("Created Offered_Product:", newItem.dataValues); // Debug log

      // Handle multiple product_ids for Benifit_Product
      let productIds = req.body["product_ids[]"] || req.body.product_ids;
      // console.log("Raw product_ids from request:", productIds); // Debug log

      if (productIds) {
        // Handle FormData array (product_ids[])
        if (!Array.isArray(productIds)) {
          productIds = Array.isArray(req.body["product_ids[]"])
            ? req.body["product_ids[]"]
            : [req.body["product_ids[]"]];
        }

        // Convert to numbers, remove duplicates, and filter invalid IDs
        productIds = [...new Set(productIds.map(Number))].filter(
          (id) => id > 0 && !isNaN(id)
        );
        console.log("Parsed product_ids:", productIds); // Debug log

        if (productIds.length === 0) {
          await t.rollback();
          return Base.sendError(
            res,
            HTTPS.BAD_REQUEST,
            "At least one valid product ID is required"
          );
        }

        // Validate that all product_ids exist
        const existingProducts = await Product.findAll({
          where: { id: { [Op.in]: productIds } },
          transaction: t,
        });

        if (existingProducts.length !== productIds.length) {
          const invalidIds = productIds.filter(
            (id) => !existingProducts.some((p) => p.id === id)
          );
          await t.rollback();
          return Base.sendError(
            res,
            HTTPS.NOT_ACCEPTABLE,
            `Invalid product IDs: ${invalidIds.join(", ")}`
          );
        }

        // Create Benifit_Product entries
        const benifitProductPromises = productIds.map((productId) =>
          CreateNew(
            Benifit_Product,
            {
              offered_product_id: newItem.id,
              product_id: productId,
            },
            t
          ).catch((err) => {
            console.error(
              `Error creating Benifit_Product for product_id ${productId}:`,
              err
            );
            throw new Error(
              `Failed to create Benifit_Product for product_id ${productId}: ${err.message}`
            );
          })
        );

        await Promise.all(benifitProductPromises);
        console.log(
          `Created ${productIds.length} Benifit_Product entries for offered_product_id ${newItem.id}`
        );
      } else {
        console.log("No product_ids provided");
      }

      await t.commit();
      return Base.sendResponse(res, HTTPS.CREATED, {
        ...newItem.dataValues,
        product_ids: productIds || [],
      });
    } catch (error) {
      await t.rollback();
      console.error("Error creating Offered Product:", error);
      return Base.sendError(
        res,
        HTTPS.INTERNAL_SERVER_ERROR,
        error.message || error
      );
    }
  }

  // Update a Offered_Product by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      // console.log("Raw request body for update:", req.body); // Debug log
      const { id } = req.params;

      const data = {
        name: req.body?.name?.trim(),
        message: req.body?.message?.trim(),
        offer_id: req.body?.offer_id,
        discount: req.body?.discount,
        discount_type_id: req.body?.discount_type_id,
        status: req.body?.status,
      };

      // Validate required fields
      if (
        !data.name ||
        !data.offer_id ||
        !data.discount ||
        !data.discount_type_id
      ) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.BAD_REQUEST,
          "Missing required fields: name, offer_id, discount, or discount_type_id"
        );
      }

      if (req.files && req.files.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/Uploads/masters/offered_product"
        );
      }

      // Check if name already exists for another record
      const existsName = await CheckExits(
        Offered_Product,
        { name: data?.name, id: { [Op.ne]: id } },
        t
      );

      if (existsName) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Offered Product name already in use"
        );
      }

      // Update Offered_Product data
      await UpdateData(Offered_Product, data, { id }, t);

      // Handle Benifit_Product updates
      let productIds = req.body["product_ids[]"] || req.body.product_ids;
      // console.log("Raw product_ids for update:", productIds); // Debug log

      if (productIds) {
        // Handle FormData array (product_ids[])
        if (!Array.isArray(productIds)) {
          productIds = Array.isArray(req.body["product_ids[]"])
            ? req.body["product_ids[]"]
            : [req.body["product_ids[]"]];
        }

        // Convert to numbers, remove duplicates, and filter invalid IDs
        productIds = [...new Set(productIds.map(Number))].filter(
          (id) => id > 0 && !isNaN(id)
        );
        // console.log("Parsed product_ids for update:", productIds); // Debug log

        if (productIds.length === 0) {
          await t.rollback();
          return Base.sendError(
            res,
            HTTPS.BAD_REQUEST,
            "At least one valid product ID is required"
          );
        }

        // Validate that all product_ids exist
        const existingProducts = await Product.findAll({
          where: { id: { [Op.in]: productIds } },
          transaction: t,
        });

        if (existingProducts.length !== productIds.length) {
          const invalidIds = productIds.filter(
            (id) => !existingProducts.some((p) => p.id === id)
          );
          await t.rollback();
          return Base.sendError(
            res,
            HTTPS.NOT_ACCEPTABLE,
            `Invalid product IDs: ${invalidIds.join(", ")}`
          );
        }

        // Delete existing Benifit_Product records not in the new list
        const deletedCount = await Benifit_Product.destroy({
          where: {
            offered_product_id: id,
            product_id: { [Op.notIn]: productIds },
          },
          transaction: t,
        });
        console.log(
          `Deleted ${deletedCount} Benifit_Product entries for offered_product_id ${id}`
        );

        // Get existing Benifit_Product product_ids
        const existingBenifitProducts = await Benifit_Product.findAll({
          where: { offered_product_id: id },
          transaction: t,
        });

        const existingProductIds = existingBenifitProducts.map((bp) =>
          Number(bp.product_id)
        );

        // Create new Benifit_Product entries for new product_ids
        const benifitProductPromises = productIds
          .filter(
            (productId) => !existingProductIds.includes(Number(productId))
          )
          .map((productId) =>
            CreateNew(
              Benifit_Product,
              {
                offered_product_id: id,
                product_id: productId,
              },
              t
            ).catch((err) => {
              console.error(
                `Error creating Benifit_Product for product_id ${productId}:`,
                err
              );
              throw new Error(
                `Failed to create Benifit_Product for product_id ${productId}: ${err.message}`
              );
            })
          );

        await Promise.all(benifitProductPromises);
        console.log(
          `Created ${benifitProductPromises.length} new Benifit_Product entries for offered_product_id ${id}`
        );
      }

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Offered Product updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Offered Product:", error);
      return Base.sendError(
        res,
        HTTPS.INTERNAL_SERVER_ERROR,
        error.message || error
      );
    }
  }

  // Delete Offered_Product by id
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
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

  // Update the status of an Offered Product
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Offered_Product, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_FOUND,
          "Offered Product not found"
        );
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

module.exports = new OfferedProductController();
