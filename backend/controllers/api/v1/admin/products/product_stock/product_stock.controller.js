const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
  barcodeGenerate,
} = require("../../../../../../helper/common/utils/dbUtils");
const Base = require("../../../../../../helper/exception_handling");
const { RoleId, CouponType } = require("../../../../../../helper/fix_ids");
const {
  HTTPS,
} = require("../../../../../../helper/https-status-codes/https-status-codes");
const {
  BarcodeGenerater,
} = require("../../../../../../helper/invoice_generater");
const {
  Offered_Product,
  Product,
  Discount_Type,
  Product_Stock,
  Purchase_Order_Product,
  Receiving_Product,
  Subscription_Product_Details,
  Product_Order_Detail,
  Product_Variant_Stock,
  StockStatus,
  Stocks,
  Prescriptions,
  Product_Variant,
  Supplier,
  Stock_History,
  Brand,
  p_category,
  sequelize,
} = require("../../../../../../models/index");
const { Op } = require("sequelize");

class OfferedController {
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const brand_search = req.query.brand_search?.trim() || "";
      const model_no = req.query.model_no?.trim() || "";
      const bo_code = req.query.bo_code?.trim() || "";
      const category = req.query.category?.trim() || "";

      const whereClauseProduct = { status: true };
      const productOrConditions = [];

      if (name) {
        productOrConditions.push({
          name: { [Op.like]: `%${name}%` },
        });
      }

      if (model_no) {
        productOrConditions.push({
          model_no: { [Op.like]: `%${model_no}%` },
        });
      }

      if (bo_code) {
        productOrConditions.push({
          bo_code: { [Op.like]: `%${bo_code}%` },
        });
      }

      if (productOrConditions.length) {
        whereClauseProduct[Op.or] = productOrConditions;
      }

      const whereClauseBrand = {};

      if (brand_search) {
        whereClauseBrand.name = {
          [Op.like]: `%${brand_search}%`,
        };
      }

      const whereClauseCategory = {};

      if (category) {
        whereClauseCategory.name = {
          [Op.like]: `%${category}%`,
        };
      }
      const options = {
        include: [
          // {
          //   model: Product_Variant,
          // },
          {
            model: Receiving_Product,
          },
          {
            model: Purchase_Order_Product,
          },
          {
            model: Product_Order_Detail,

            required: false,
            where: { status: true, return_status: true },
          },
          {
            model: p_category,
            where: whereClauseCategory,
          },
          {
            model: Brand,
            paranoid: false,
            where: whereClauseBrand,
          },
          {
            model: Prescriptions,

            as: "Lense",
            required: false,
            include: [
              { model: Product, paranoid: false },
              {
                model: Product_Order_Detail,
                required: false,
                where: { status: true, return_status: true },
              },
            ],
          },
        ],
        paranoid: true,
        where: whereClauseProduct,
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Product, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Offered Products:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async findInventoryAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const product_id = req.params.id;
      const supplier_search = req.query.supplier_search?.trim() || "";
      const brand_search = req.query.brand_search?.trim() || "";
      const model_no = req.query.model_no?.trim() || "";
      const bo_code = req.query.bo_code?.trim() || "";
      const barcode_no = req.query.barcode_no?.trim() || "";

      const whereClauseProduct = { status: true };
      const productOrConditions = [];

      if (name) {
        productOrConditions.push({
          name: { [Op.like]: `%${name}%` },
        });
      }

      if (model_no) {
        productOrConditions.push({
          model_no: { [Op.like]: `%${model_no}%` },
        });
      }

      if (bo_code) {
        productOrConditions.push({
          bo_code: { [Op.like]: `%${bo_code}%` },
        });
      }

      if (productOrConditions.length) {
        whereClauseProduct[Op.or] = productOrConditions;
      }

      const whereClauseBrand = {};

      if (brand_search) {
        whereClauseBrand.name = {
          [Op.like]: `%${brand_search}%`,
        };
      }
      const whereClauseSupplier = {};

      if (supplier_search) {
        whereClauseSupplier.name = {
          [Op.like]: `%${supplier_search}%`,
        };
      }

      const whereClause = {
        product_id,
      };

      if (barcode_no) {
        whereClause.barcode_no = {
          [Op.like]: `%${barcode_no}%`,
        };
      }

      const options = {
        include: [
          {
            model: Product,
            required: true,
            paranoid: false,
            where: whereClauseProduct,
            include: [{ model: Brand, where: whereClauseBrand }],
          },
          {
            model: Supplier,
            required: false,
            paranoid: false,
            where: whereClauseSupplier,
          },
          {
            model: Stock_History,
          },
          {
            model: StockStatus,
          },
        ],
        where: whereClause,
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Stocks, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Offered Products:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async BracodeGenerate(req, res) {
    try {
      console.log(req.body, "req.body req.body");

      const monthWiseRecords = await Stocks.findAll({
        include: [
          { model: Product, include: [{ model: Brand }] },
          { model: Supplier },
        ],
        where: {
          id: req.body,
        },
      });

      const update = await Stocks.update(
        {
          barcode_status: true,
        },
        {
          where: {
            id: req.body,
          },
        },
      );
      const pdf = await BarcodeGenerater(monthWiseRecords);
      console.log(pdf);

      return Base.sendResponse(res, HTTPS.OK, pdf);
    } catch (error) {
      console.error("Error fetching Offered Products:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      console.log(req.params.id, "req.params.id");

      const result = await Stocks.findOne({
        include: [
          {
            model: Product,
          },
        ],
        where: { id: req.params.id },
        transaction: t,
      });

      // if (!result) {
      //   await t.rollback();
      //   return Base.sendError(res, HTTPS.NOT_FOUND, "Product not found");
      // }

      const data = {
        id: result.id,
        product_id: result?.Product?.id,
        price: result?.Product?.price,
        mrp: result?.Product?.mrp,
        tax_percentage: result?.Product?.tax_percentage,
        tax_amount: result?.Product?.tax_amount,
        discount: result?.Product?.discount,
        discount_amount: result?.Product?.discount_amount,
        base_amount: result?.Product?.base_amount,
        barcode_no: result?.barcode_no,
      };

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Offered Product:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async findAllStock(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      // const product_id = req.params.id;
      const supplier_search = req.query.supplier_search?.trim() || "";
      const brand_search = req.query.brand_search?.trim() || "";
      const model_no = req.query.model_no?.trim() || "";
      const bo_code = req.query.bo_code?.trim() || "";
      const barcode_no = req.query.barcode_no?.trim() || "";

      const whereClauseProduct = { status: true };
      const productOrConditions = [];

      const fromDate = req.query.from ? new Date(req.query.from.trim()) : null;
      const toDate = req.query.to ? new Date(req.query.to.trim()) : null;

      if (name) {
        productOrConditions.push({
          name: { [Op.like]: `%${name}%` },
        });
      }

      if (model_no) {
        productOrConditions.push({
          model_no: { [Op.like]: `%${model_no}%` },
        });
      }

      if (bo_code) {
        productOrConditions.push({
          bo_code: { [Op.like]: `%${bo_code}%` },
        });
      }

      if (productOrConditions.length) {
        whereClauseProduct[Op.or] = productOrConditions;
      }

      const whereClauseBrand = {};

      if (brand_search) {
        whereClauseBrand.name = {
          [Op.like]: `%${brand_search}%`,
        };
      }
      const whereClauseSupplier = {};

      if (supplier_search) {
        whereClauseSupplier.name = {
          [Op.like]: `%${supplier_search}%`,
        };
      }

      const whereClause = {
        // product_id,
      };

      if (barcode_no) {
        whereClause.barcode_no = {
          [Op.like]: `%${barcode_no}%`,
        };
      }
      if (fromDate && toDate) {
        fromDate.setHours(0, 0, 0, 0); // Start of day
        toDate.setHours(23, 59, 59, 999); // End of day

        whereClause.createdAt = {
          [Op.between]: [fromDate, toDate],
        };
      } else if (fromDate) {
        fromDate.setHours(0, 0, 0, 0);

        whereClause.createdAt = {
          [Op.gte]: fromDate,
        };
      } else if (toDate) {
        toDate.setHours(23, 59, 59, 999);

        whereClause.createdAt = {
          [Op.lte]: toDate,
        };
      }

      const options = {
        include: [
          {
            model: Product,
            required: true,
            paranoid: false,
            where: whereClauseProduct,
            include: [{ model: Brand, where: whereClauseBrand }],
          },
          {
            model: Supplier,
            required: supplier_search ? true : false,
            paranoid: false,
            where: whereClauseSupplier,
          },
          {
            model: Stock_History,
          },
          {
            model: StockStatus,
          },
        ],
        where: whereClause,
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Stocks, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Offered Products:", error);
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
        t,
      );

      if (exists) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Offered Product already exists",
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
        t,
      );
      if (exists) {
        const update = await UpdateData(
          Product_Stock,
          data,
          { product_id: id },
          t,
        );
      } else {
        const create = await CreateNew(Product_Stock, data, t);
      }

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Product stock updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Offered Product:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async BarcodeUpdate(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        price: req.body?.price ? Number(req.body.price) : null,
        mrp: req.body?.mrp ? Number(req.body.mrp) : null,
        discount: req.body?.discount ? Number(req.body.discount) : null,
        discount_amount: req.body?.discount_amount
          ? Number(req.body.discount_amount)
          : null,
        tax_percentage: req.body?.tax_percentage
          ? Number(req.body.tax_percentage)
          : null,
        tax_amount: req.body?.tax_amount ? Number(req.body.tax_amount) : null,
        base_amount: req.body?.base_amount
          ? Number(req.body.base_amount)
          : null,
      };
      const barcode = await barcodeGenerate(req.body.barcode_no, t);

      const update = await UpdateData(
        Product,
        data,
        { id: req.body.product_id },
        t,
      );
      const updatestock = await UpdateData(
        Stocks,
        { barcode_no: req.body.barcode_no, barcode: barcode.barcode },
        { id: id },
        t,
      );

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Product stock updated successfully",
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
          "Offered Product not found",
        );
      }

      await Offered_Product.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Offered Product Deleted Successfully",
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
        t,
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Offered Product status updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Offered Product status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new OfferedController();
