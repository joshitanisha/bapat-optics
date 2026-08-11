const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
  NotificationsManagment,
} = require("../../../../../../helper/common/utils/dbUtils");
const Base = require("../../../../../../helper/exception_handling");
const { RoleId } = require("../../../../../../helper/fix_ids");
const {
  HTTPS,
} = require("../../../../../../helper/https-status-codes/https-status-codes");
const {
  Receiving_Product,
  Receiving,
  Purchase_Receiving,
  Purchase_Order_Product,
  Purchase_Order,
  Purchase_Order_Status,
  Product_Variant_Stock,
  Product_Variant,
  Purchase_History,
  Supplier,
  Product,
  Product_Stock,
  sequelize,
  Colour,
  Brand,
  Stocks,
} = require("../../../../../../models/index");
const { Op } = require("sequelize");
const product = require("../../../../../../models/product");
const IDS = require("../../../../../../helper/fix_ids");
const moment = require("moment");
const purchase_order = require("../../../../../../models/purchase_order");

const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
const https = require("https");
const { formatDateTime } = require("../../../../../../helper/common/function");
class PlanController {
  // Fetch all Data
  async findAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const per_page = parseInt(req.query.per_page) || 10;
      const name = req.query.term || "";
      const model_no = req.query.model_no || "";
      const bo_code = req.query.bo_code || "";
      const supplier_search = req.query.supplier_search || "";
      const brand_search = req.query.brand_search || "";
      const product_search = req.query.product_search || "";
      const description = req.query.description || "";

      const whereClause = {
        [Op.and]: [
          {
            batch_no: { [Op.like]: `%${name}%` },
          },
        ],
      };

      if (brand_search) {
        whereClause[Op.and].push(
          sequelize.literal(`
      EXISTS (
        SELECT 1
        FROM receiving_products rp
        INNER JOIN products p ON p.id = rp.product_id
        INNER JOIN brands b ON b.id = p.brand_id
        WHERE
          rp.receiving_id = Receiving.id
          AND rp.deletedAt IS NULL
          AND b.name LIKE '%${brand_search}%'
      )
    `),
        );
      }

      const fromDate = req.query.from ? new Date(req.query.from.trim()) : null;
      const toDate = req.query.to ? new Date(req.query.to.trim()) : null;
      let startCheckDate;

      if (toDate) {
        startCheckDate = new Date(toDate);
        startCheckDate.setDate(startCheckDate.getDate() + 1);
        startCheckDate.setHours(0, 0, 0, 0);
      }

      if (fromDate && toDate) {
        whereClause.createdAt = {
          [Op.between]: [fromDate.toISOString(), startCheckDate.toISOString()],
        };
      } else if (fromDate) {
        whereClause.createdAt = {
          [Op.gte]: fromDate.toISOString(),
        };
      } else if (toDate) {
        whereClause.createdAt = {
          [Op.lte]: startCheckDate.toISOString(),
        };
      }

      const whereClauseProduct = {};
      const whereClauseRecievingProduct = {};

      const productOrConditions = [];

      if (product_search) {
        productOrConditions.push({
          name: { [Op.like]: `%${product_search}%` },
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

      if (description) {
        whereClauseRecievingProduct.description = description;
      }
      // if (brand_search) {
      //   whereClause["$Receiving_Products.Product.Brand.name$"] = {
      //     [Op.like]: `%${brand_search}%`,
      //   };
      // }

    

      const { count, rows: data } = await Receiving.findAndCountAll({
        subQuery: false,
        include: [
          {
            model: Receiving_Product,
            // required: true,
            // paranoid: false,
            // where: whereClauseRecievingProduct,

            include: [
              {
                model: Product,
                include: [
                  {
                    model: Brand,

                    // where: whereClauseBrand,
                    // required: Object.keys(whereClauseBrand).length > 0,
                    paranoid: false,
                  },
                ],
                required: true,
                paranoid: false,
                where: whereClauseProduct,
              },
              {
                model: Product_Stock,
              },
            ],
            required: true,
            where: whereClauseRecievingProduct,
          },

          {
            model: Supplier,
            required: true,
            paranoid: false,
            where: whereClauseSupplier,
          },
        ],
        where: whereClause,
        distinct: true,
        col: "id",
        order: [["createdAt", "DESC"]],
        per_page: per_page,
        offset: (page - 1) * per_page,
        limit: per_page,
      });
      const total_pages = Math.ceil(count / per_page);

      return Base.sendResponse(res, HTTPS.OK, {
        data: data,
        current_page: page,
        total_pages: total_pages,
        per_page: per_page,
        total: count,
      });
      // await Paginate(Receiving, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Plans:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const include = [
        {
          model: Receiving_Product,
          include: [
            {
              model: Product,
              include: [
                { model: Brand },
                { model: Colour },
                {
                  model: Colour,
                  as: "lens_color",
                  required: false,
                },
              ],
            },
            {
              model: Product_Stock,
              include: [{ model: Stocks }],
            },
          ],
        },
        {
          model: Supplier,
        },
      ];

      const result = await Receiving.findOne({
        where: { id: req.params.id },
        include: include,
        transaction: t,
      });

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Plan not found");
      }

      const data = {
        id: result.id,
        batch_no: result.batch_no,
        invoice_no: result.invoice_no,
        order_no: result.order_no,

        wlp: result.wlp,
        wlpdiscount: result.wlpdiscount * 100,
        wlp_discountamount: result.wlpdiscountamount,
        base_price: result.base_price,
        gst: result.gst * 100,
        gst_price: result.gst_price,
        total_price: result.total_price,

        supplier_id: {
          value: result.supplier_id,
          name: "supplier_id",
          label: result.Supplier?.name || "",
        },
        quantitys: result.Receiving_Products?.map((val) => ({
          id: val.id,
          quantity: val.quantity,
          total_price: val.total_price,
          price: val.price,
          gst: val.gst * 100,
          gstprice: val.gst_price,
          waste_quantity: val.waste_quantity,
          // expiry_date: val.expiry_date,
          description: val.description,
          product_id: {
            value: val.product_id,
            name: "product_id",
            label: val.Product?.name || "",
            data: val.Product,
          },
          barcode_status: val.Product?.barcode_status,
          models:
            val?.Product_Stock?.Stocks?.map((stock) => stock?.model) || [],
          // varients:
          //   val.Product_Variant_Stocks?.map((variant) => ({
          //     id: variant.id,
          //     product_id: variant.product_id,
          //     varient_id: {
          //       value: variant.variant_id,
          //       label: variant.Product_Variant?.name || "", // assuming `name` is in Product_Variant
          //     },
          //     general_stock: variant.general_stock,
          //     subscription_stock: variant.subscription_stock,
          //     selling_price: variant.Product_Variant?.price,
          //     models: variant?.Stocks?.map((stock) => stock?.model) || [],
          //   })) || [],
        })),
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      };

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Plan:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new country
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const parsequantitys = JSON.parse(req.body.quantitys || "[]");

      const now = new Date();

      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const hour = String(now.getHours()).padStart(2, "0");
      const minute = String(now.getMinutes()).padStart(2, "0");

      // Count existing orders today (optional: per supplier)
      const count = await Purchase_Order.count({
        where: {
          createdAt: {
            [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
        transaction: t,
      });

      const formattedCount = String(count + 1).padStart(3, "0");

      const batchNo = `BN${day}${month}${hour}${minute}${formattedCount}`;

      const PurchaseOrder = await CreateNew(
        Purchase_Order,
        {
          batch_no: batchNo,
          p_o_s_id: IDS.PurchaseOrderStatus.newOrder,
          user_id: req.user.user_id,
          supplier_id: IDS.UserId.Supplier,
          total_quantity: req.body.total_quantity,
        },
        t,
      );

      for (let val of parsequantitys) {
        await CreateNew(
          Purchase_Order_Product,
          {
            user_id: req.user.user_id,
            p_o_id: PurchaseOrder.id,
            product_id: val.product_id,
            quantity: val.quantity,
          },
          t,
        );
      }
      const PurchaseHistory = await CreateNew(
        Purchase_History,
        {
          p_o_id: PurchaseOrder.id,
          p_o_s_id: IDS.PurchaseOrderStatus.newOrder,
          comment: "Order Added",
          user_id: req.user.user_id,
          supplier_id: IDS.UserId.Supplier,
          total_quantity: req.body.total_quantity,
        },
        t,
      );

      await t.commit();
      return Base.sendResponse(res, HTTPS.CREATED, PurchaseOrder);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Plan:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const parsequantitys = JSON.parse(req.body.quantitys || "[]");
      const PurchaseOrder = await UpdateData(
        Receiving,
        {
          supplier_id: req.body.supplier_id,
          quantity: req.body.total_quantity,
          waste_quantity: req.body.total_waste_quantity,
          total_price: req.body.total_price,
        },
        { id: id },
        t,
      );

      // await Receiving_Product.destroy({
      //   where: {
      //     receiving_id: id,
      //   },
      //   transaction: t,
      // });

      // await Product_Variant_Stock.destroy({
      //   where: {
      //     receiving_id: id,
      //   },
      //   transaction: t,
      // });

      for (let val of parsequantitys) {
        await UpdateData(
          Receiving_Product,
          {
            receiving_id: id,
            user_id: req.user.user_id,
            p_o_p_id: val?.id,
            product_id: val?.product_id,
            quantity: val?.quantity,
            waste_quantity: val?.waste_quantity,
            expiry_date: val?.expiry_date,
            total_price: val?.total_price,
            price: val?.price,
          },
          { id: val?.id },
          t,
        );

        for (let val1 of val.varients || []) {
          await UpdateData(
            Product_Variant_Stock,
            {
              receiving_id: id,
              receiving_product_id: val.id,
              product_id: val1.product_id,
              variant_id: val1.variant_id,
              general_stock: val1.general_stock,
              selling_price: val1.selling_price,
              subscription_stock: val1.subscription_stock,
              user_id: req.user.user_id,
            },
            { id: val1?.id },
            t,
          );
        }
      }

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Plan updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Plan:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async ReceivingCreate(req, res) {
    const t = await sequelize.transaction();
    try {
      const parsequantitys = JSON.parse(req.body.quantitys || "[]");

      const Receivingdata = await CreateNew(
        Receiving,
        {
          p_o_id: req.body.id,
          batch_no: req.body.batch_no,
          user_id: req.user.user_id,
          supplier_id: IDS.UserId.Supplier,
          quantity: req.body.total_quantity,
          total_price: req.body.total_price,
        },
        t,
      );

      for (let val of parsequantitys) {
        await CreateNew(
          Receiving_Product,
          {
            receiving_id: Receivingdata.id,
            user_id: req.user.user_id,
            p_o_p_id: val?.id,
            product_id: val?.product_id,
            quantity: val?.quantity,
            total_price: val?.total_price,
            price: val?.price,
          },
          t,
        );
      }
      const ReceivingHistory = await CreateNew(
        Purchase_Receiving,
        {
          p_o_id: req.body.id,
          receiving_id: Receivingdata?.id,

          user_id: req.user.user_id,
        },
        t,
      );
      const PurchaseOrder = await UpdateData(
        Purchase_Order,
        {
          p_o_s_id: IDS.PurchaseOrderStatus.Ordered,
        },
        { id: req.params.id },
        t,
      );
      const PurchaseHistory = await CreateNew(
        Purchase_History,
        {
          p_o_id: req.body.id,
          p_o_s_id: IDS.PurchaseOrderStatus.Ordered,
          comment: "Order Converte To Receving",
          user_id: req.user.user_id,
          supplier_id: IDS.UserId.Supplier,
          total_quantity: req.body.total_quantity,
        },
        t,
      );

      await t.commit();
      return Base.sendResponse(res, HTTPS.CREATED, Receivingdata);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Plan:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
  // Delete a country by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Purchase_Order, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Plan not found");
      }
      await Purchase_Order_Product.destroy({
        where: { p_o_id: id },
        transaction: t,
      });
      await Purchase_Order.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "Plan Deleted Successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Plan:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Purchase_Order, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Purchase_Order,
        { status: result.status ? false : true },
        { id },
        t,
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Plan status updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Plan status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async getDownloadExcelOrderList(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const model_no = req.query.model_no?.trim() || "";
      const bo_code = req.query.bo_code?.trim() || "";
      const supplier_search = req.query.supplier_search?.trim() || "";
      const brand_search = req.query.brand_search?.trim() || "";
      const product_search = req.query.product_search?.trim() || "";

      const whereClause = {
        [Op.and]: [
          {
            batch_no: { [Op.like]: `%${name}%` },
          },
        ],
      };

      if (brand_search) {
        whereClause[Op.and].push(
          sequelize.literal(`
      EXISTS (
        SELECT 1
        FROM receiving_products rp
        INNER JOIN products p ON p.id = rp.product_id
        INNER JOIN brands b ON b.id = p.brand_id
        WHERE
          rp.receiving_id = Receiving.id
          AND rp.deletedAt IS NULL
          AND b.name LIKE '%${brand_search}%'
      )
    `),
        );
      }

      const fromDate = req.query.from ? new Date(req.query.from.trim()) : null;
      const toDate = req.query.to ? new Date(req.query.to.trim()) : null;
      let startCheckDate;

      if (toDate) {
        startCheckDate = new Date(toDate);
        startCheckDate.setDate(startCheckDate.getDate() + 1);
        startCheckDate.setHours(0, 0, 0, 0);
      }

      if (fromDate && toDate) {
        whereClause.createdAt = {
          [Op.between]: [fromDate.toISOString(), startCheckDate.toISOString()],
        };
      } else if (fromDate) {
        whereClause.createdAt = {
          [Op.gte]: fromDate.toISOString(),
        };
      } else if (toDate) {
        whereClause.createdAt = {
          [Op.lte]: startCheckDate.toISOString(),
        };
      }

      const whereClauseProduct = {};

      const productOrConditions = [];

      if (product_search) {
        productOrConditions.push({
          name: { [Op.like]: `%${product_search}%` },
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

      // Build include with return status filter
      const include = [
        {
          model: Receiving_Product,

          include: [
            {
              model: Product,
              include: [
                {
                  model: Brand,

                  // where: whereClauseBrand,
                  // required: Object.keys(whereClauseBrand).length > 0,
                  paranoid: false,
                },
              ],
              required: true,
              paranoid: false,
              where: whereClauseProduct,
            },
            {
              model: Product_Stock,
            },
          ],
        },

        {
          model: Supplier,
          required: true,
          paranoid: false,
          where: whereClauseSupplier,
        },
        {
          model: Purchase_Order,
        },
      ];

      const orders = await Receiving.findAll({
        where: whereClause,
        include,
        order: [["createdAt", "DESC"]],
        distinct: true,
      });

      // Create workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Order List");

      // Add header row (adjust columns as per your desired export)
      worksheet.addRow([
        "Sr No",
        "Batch No",
        "Supplier Name ",
        "Supplier GST No",
        "Purchase Date ",
        "Reveiving Date",
        "Product Name",
        "Product Model No",
        "Product BoCode",
        "Quantity",
        "Purchase Price",
        "GST %",
        "GST Amount",
        "Total Purchase Price",
      ]);

      // Populate rows
      let rowIndex = 1;

      orders.forEach((order) => {
        const batchNo = order.batch_no || "-";
        const supplier = order.Supplier || {};

        let isFirstProduct = true;

        order.Receiving_Products?.forEach((rp) => {
          const product = rp.Product || {};

          worksheet.addRow([
            rowIndex++,
            isFirstProduct ? batchNo : "",
            // show batch only first time
            isFirstProduct ? supplier.name || "-" : "",
            isFirstProduct ? supplier.gst_no || "-" : "",
            isFirstProduct
              ? order?.Purchase_Order?.createdAt?.toISOString().split("T")[0] ||
                "-"
              : "",
            isFirstProduct
              ? order?.createdAt?.toISOString().split("T")[0] || "-"
              : "",

            product.name || "-",
            product.model_no || "-",
            product.bo_code || "-",
            rp.quantity || 0,
            rp.price || "-",
            product.tax_percentage || "-",
            Number(rp.price) *
              Number(rp.quantity) *
              (Number(product.tax_percentage) / 100) || "-",
            Number(rp.price) * Number(rp.quantity) +
              Number(rp.price) *
                Number(rp.quantity) *
                (Number(product.tax_percentage) / 100),
          ]);

          isFirstProduct = false; // next rows blank
        });
      });

      // Write to temp file
      const filePath = path.join(
        __dirname,
        "../../../../../../",
        "product_sell_List.xlsx",
      );
      await workbook.xlsx.writeFile(filePath);

      // Send the file and delete after
      res.download(filePath, "product_sell_List.xlsx", (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error downloading file.");
        }
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr)
            console.error("Failed to delete temp file:", unlinkErr);
        });
      });
    } catch (error) {
      console.error("Error generating order list Excel:", error);
      return res.status(500).send("Error generating Excel file.");
    }
  }
}

module.exports = new PlanController();
