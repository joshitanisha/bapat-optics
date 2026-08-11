const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,

  BulkUploadCreate,
  DownloadSample,
  barcodeGenerate,
  Custom_File_Uploade,
} = require("../../../../../../helper/common/utils/dbUtils");
const Base = require("../../../../../../helper/exception_handling");
const {
  HTTPS,
} = require("../../../../../../helper/https-status-codes/https-status-codes");
const ExcelJS = require("exceljs");

const fs = require("fs");

const {
  Product,
  Brand,
  Unit,
  Users,

  p_category,
  Store_Detail,
  Product_Images,
  Approval_Status,
  Item_Type,
  Brand_Category,
  Product_Variant,
  Often_Ordered_With,
  Country,
  Stock_History,
  Product_Stock,
  Cart,
  Product_Order_Detail,
  Tax_Type,
  Product_Serach_History,
  Colour,
  Shape,
  Material,
  Frame_Type,
  Face_Width,
  Gender,
  sequelize,
  LensType,
  LensCategory,
  Coating,
  Supplier,
  Purchase_Order,
  Purchase_Order_Product,
  Receiving,
  Receiving_Product,
  Purchase_History,
  Purchase_Receiving,
  Color_Category,
  Stocks,
  Lense_Addons,
} = require("../../../../../../models/index");
const { Op } = require("sequelize");
const xlsx = require("xlsx");
const path = require("path");
const nodemailer = require("nodemailer");
const IDS = require("../../../../../../helper/fix_ids");
const { sendMail } = require("../../../../../../helper/NodeMailer");

const AdmZip = require("adm-zip");

const generateItemCode = async () => {
  const randomSuffix = Math.floor(Math.random() * 10000);
  return `${randomSuffix}`;
};

const generatesixDigit = async () => {
  const randomNumber = Math.floor(100000 + Math.random() * 900000); // generates a number between 100000 and 999999
  return `${randomNumber}`;
};

const findUniqueItemCode = async () => {
  let item_code;
  let isUnique = false;

  while (!isUnique) {
    item_code = await generateItemCode();
    const existingProduct = await Product.findOne({
      where: { item_code: item_code },
    });
    if (!existingProduct) {
      isUnique = true;
    }
  }
  return item_code;
};

const unzipAndSaveFromBuffer = async (fileBuffer, fileName, outputFolder) => {
  try {
    const zip = new AdmZip(fileBuffer); // load directly from buffer

    // Use outputFolder directly (no subfolder)
    const extractDir = outputFolder;

    // Ensure the extraction directory exists
    if (!fs.existsSync(extractDir)) {
      fs.mkdirSync(extractDir, { recursive: true });
    }

    zip.getEntries().forEach((entry) => {
      if (!entry.isDirectory) {
        const entryPath = path.join(extractDir, entry.entryName);

        // Ensure the subfolder exists (in case zip has folders inside)
        const entryDir = path.dirname(entryPath);
        if (!fs.existsSync(entryDir)) {
          fs.mkdirSync(entryDir, { recursive: true });
        }

        fs.writeFileSync(entryPath, entry.getData());
      }
    });

    return extractDir;
  } catch (err) {
    console.error("Unzip Error:", err);
    throw err;
  }
};

const findUniqueBarcode = async () => {
  let item_code;
  let isUnique = false;

  while (!isUnique) {
    item_code = await generatesixDigit();
    const existingProduct = await Product_Variant.findOne({
      where: { barcode: item_code },
    });
    if (!existingProduct) {
      isUnique = true;
    }
  }
  return item_code;
};

const findUniqueModel = async () => {
  let item_code;
  let isUnique = false;

  while (!isUnique) {
    item_code = await generatesixDigit();
    const existingProduct = await Product_Variant.findOne({
      where: { model_no: item_code },
    });
    if (!existingProduct) {
      isUnique = true;
    }
  }
  return item_code;
};

const getMissingFields = (rowArray, indexMap, ignoreFields = []) => {
  const missing = [];

  rowArray.forEach((value, index) => {
    const fieldName = indexMap[index];

    // Ignore by FIELD NAME
    if (ignoreFields.includes(fieldName)) return;

    if (
      value === null ||
      value === undefined ||
      value === "" ||
      (typeof value === "number" && isNaN(value))
    ) {
      missing.push(fieldName || `COLUMN_${index}`);
    }
  });

  return missing;
};

const COLUMN_INDEX_MAP_SUN = {
  0: "NO",
  1: "CATEGORY",
  2: "BRAND NAME",
  3: "MODEL NO",
  4: "BARCODE",
  5: "MATERIAL",
  6: "FRAME TYPE",
  7: "GENDER",
  8: "Frame COLOR",
  9: "Lens Color",
  10: "SHAPE",
  11: "SIZE",
  12: "TOTAL MEASUREMENTS",
  13: "HSN CODE",
  14: "MRP",
  // 15: "DISCOUNT",
  // 16: "DISCOUNT AMOUNT",
  // 17: "FINAL PRICE",
  // 18: "GST%",
  // 19: "GST AMOUNT",
  // 20: "BASE AMOUNT",
  15: "DESCRIPTION",
  16: "SUPPLIER NAME",
  17: "GST NUMBER",
  18: "COST PRICE",
};

const COLUMN_INDEX_MAP_EYE = {
  0: "NO",
  1: "CATEGORY",
  2: "BRAND NAME",
  3: "MODEL NO",
  4: "BARCODE",
  5: "MATERIAL",
  6: "FRAME TYPE",
  7: "GENDER",
  8: "COLOR",
  9: "SHAPE",
  10: "SIZE",
  11: "TOTAL MEASUREMENTS",
  12: "HSN CODE",
  13: "MRP",
  // 14: "DISCOUNT",
  // 15: "DISCOUNT AMOUNT",
  // 16: "FINAL PRICE",
  // 17: "GST%",
  // 18: "GST AMOUNT",
  // 19: "BASE AMOUNT",
  14: "DESCRIPTION",
  15: "SUPPLIER NAME",
  16: "GST NUMBER",
  17: "COST PRICE",
};

const LENS_COLUMN_INDEX_MAP = {
  0: "BRAND NAME",
  1: "SR NO",
  2: "BO CODE",
  3: "LENS CAT.",
  4: "LENS TYPE",
  5: "COLOUR",
  6: "MATERIAL",
  7: "INDEX",
  8: "PRODUCT NAME",
  9: "COATING NAME",
  10: "PRICE",
  11: "RESULTANT POWER",
  12: "CYL",
  13: "SUPPLIER NAME",
  14: "GST NUMBER",
  15: "COST PRICE",
  16: "DESCRIPTION",
  17: "HSN CODE",
};

const CONTACT_LENS_COLUMN_INDEX_MAP = {
  0: "SRNO",
  1: "BO CODE",
  2: "MODALITY",
  3: "MATERIAL CATEGORY",
  4: "COMPANY NAME",
  5: "PRODUCT",
  6: "MATERIAL",
  7: "WATER CONTENT",
  8: "BASE CURVE",
  9: "DIAMETER",
  10: "DK/T",
  11: "PACK SIZE",
  12: "QTY",
  13: "POWER RANGE",
  14: "MRP",
  15: "SUPPLIER NAME",
  16: "GST NUMBER",
  17: "COST PRICE",
  18: "DESCRIPTION",
  19: "HSN CODE",
};

class ProductController {
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const approval_status_id = req.query.approval_status_id || "";
      const p_category_id = req.query.p_category_id || "";

      const brand_id = req.query.brand_id || "";
      const made_in_id = req.query.made_in_id || "";
      const sortOrder = req.query.sortOrder || "DESC";

      const fromDate = req.query.from ? new Date(req.query.from.trim()) : null;
      const toDate = req.query.to ? new Date(req.query.to.trim()) : null;
      const whereClause = {};

      // console.log("namenamename",name)
      if (name) {
        whereClause.name = { [Op.like]: `%${name}%` };
      }

      if (approval_status_id) {
        whereClause.approval_status_id = approval_status_id;
      }

      if (p_category_id) {
        whereClause.p_category_id = p_category_id;
      }

      if (brand_id) {
        whereClause.brand_id = brand_id;
      }

      if (made_in_id) {
        whereClause.made_in_id = made_in_id;
      }

      // if (fromDate && toDate) {
      //   whereClause.createdAt = {
      //     [Op.between]: [fromDate.toISOString(), toDate.toISOString()],
      //   };
      // } else if (fromDate) {
      //   whereClause.createdAt = { [Op.gte]: fromDate.toISOString() };
      // } else if (toDate) {
      //   whereClause.createdAt = { [Op.lte]: toDate.toISOString() };
      // }

      // const fromDate = req.query.from ? new Date(req.query.from.trim()) : null;
      // const toDate = req.query.to ? new Date(req.query.to.trim()) : null;
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

      const options = {
        where: whereClause,
        order: [["createdAt", sortOrder]],
        include: [
          {
            model: p_category,
            include: [{ model: Item_Type }],
          },

          // { model: Unit, required: false },
          { model: Brand, required: false },
          { model: Approval_Status },

          { model: Country },
          { model: Product_Order_Detail },

          { model: Product_Variant },
        ],
      };

      await Paginate(Product, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Products:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async findAllSearchHistory(req, res) {
    try {
      const name = req.query.term?.trim() || "";

      const options = {
        include: [
          {
            model: Users,
          },
        ],
        order: [["createdAt", "DESC"]],
        where: { [Op.or]: [{ name: { [Op.like]: `%${name}%` } }] },
      };

      await Paginate(Product_Serach_History, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Products:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async getDownloadExcelOrderList(req, res) {
    try {
      // Extract filters and pagination from req.query or req.body (adjust as needed)
      const name = req.query.term?.trim() || "";
      const approval_status_id = req.query.approval_status_id || "";
      const p_category_id = req.query.p_category_id || "";

      const brand_id = req.query.brand_id || "";
      const made_in_id = req.query.made_in_id || "";
      const sortOrder = req.query.sortOrder || "DESC";

      const fromDate = req.query.from ? new Date(req.query.from.trim()) : null;
      const toDate = req.query.to ? new Date(req.query.to.trim()) : null;
      const whereClause = {};

      if (name) {
        whereClause.name = { [Op.like]: `%${name}%` };
      }

      if (approval_status_id) {
        whereClause.approval_status_id = approval_status_id;
      }

      if (p_category_id) {
        whereClause.p_category_id = p_category_id;
      }

      if (brand_id) {
        whereClause.brand_id = brand_id;
      }

      if (made_in_id) {
        whereClause.made_in_id = made_in_id;
      }

      if (fromDate && toDate) {
        whereClause.createdAt = {
          [Op.between]: [fromDate.toISOString(), toDate.toISOString()],
        };
      } else if (fromDate) {
        whereClause.createdAt = { [Op.gte]: fromDate.toISOString() };
      } else if (toDate) {
        whereClause.createdAt = { [Op.lte]: toDate.toISOString() };
      }
      // Build include with return status filter
      const include = [
        {
          model: p_category,
          include: [{ model: Item_Type }],
        },

        { model: Product_Variant },

        { model: Unit, required: false },
        { model: Brand, required: false },
        { model: Approval_Status },

        { model: Country },
        { model: Product_Order_Detail },
      ];

      // Fetch all matching orders (no pagination for export)
      const orders = await Product.findAll({
        where: whereClause,
        include,
        order: [["createdAt", sortOrder]],
        distinct: true,
      });

      // Create workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Order List");

      // Add header row (adjust columns as per your desired export)
      worksheet.addRow([
        "Sr No",
        "Product Name",
        "Product Code",
        "total SellUnit",
        "gst",
        // "discount",
        "Total MRP,",
        "total SellingPrice ",
        "total Tax",
        "grand Total,",
        "Net Sell ",
      ]);

      // Populate rows
      let rowIndex = 1;

      orders.forEach((order) => {
        const orderDetails = order.Product_Order_Details || [];

        orderDetails.forEach((orderDetail) => {
          const totalSellUnit = orderDetail?.quantity || "-";
          const gst = orderDetail?.total_tax || "-";
          // const discount = orderDetail?.total_offer_discount || "-";
          const totalMRP = orderDetail?.total_mrp || "-";
          const totalSellingPrice = orderDetail?.total_selling_price || "-";
          const totalTax = orderDetail?.total_tax || "-";
          const grandTotal = orderDetail?.total_amount || "-";
          const netSell = orderDetail?.total_selling_price || "-";

          worksheet.addRow([
            rowIndex++,
            order.name || "-",
            order.item_code || "-",
            totalSellUnit,
            gst,
            // discount,
            totalMRP,
            totalSellingPrice,
            totalTax,
            grandTotal,
            netSell,
          ]);
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

  async getDownloadExcelProductList(req, res) {
    try {
      const {
        term = "",
        approval_status_id = "",
        p_category_id = "",

        brand_id = "",
        made_in_id = "",
        sortOrder = "DESC",
        from: fromRaw,
        to: toRaw,
      } = req.query;

      const whereClause = {};
      if (term.trim()) whereClause.name = { [Op.like]: `%${term.trim()}%` };
      if (approval_status_id)
        whereClause.approval_status_id = approval_status_id;

      if (brand_id) whereClause.brand_id = brand_id;
      if (made_in_id) whereClause.made_in_id = made_in_id;

      const fromDate = fromRaw ? new Date(fromRaw.trim()) : null;
      const toDate = toRaw ? new Date(toRaw.trim()) : null;
      if (fromDate && toDate) {
        whereClause.createdAt = { [Op.between]: [fromDate, toDate] };
      } else if (fromDate) {
        whereClause.createdAt = { [Op.gte]: fromDate };
      } else if (toDate) {
        whereClause.createdAt = { [Op.lte]: toDate };
      }

      const include = [
        { model: p_category },

        // { model: Unit, required: false },
        { model: Brand, required: false },
        { model: Approval_Status },
        { model: Country },

        {
          model: Product_Order_Detail,
          include: [
            {
              model: Product_Variant,
            },
          ],
        },
      ];

      const products = await Product.findAll({
        where: whereClause,
        include,
        order: [["createdAt", sortOrder]],
        distinct: true,
      });

      const productBuckets = new Map();

      for (const product of products) {
        let bucket = productBuckets.get(product.id);
        if (!bucket) {
          bucket = {
            productName: product.name ?? "-",
            productId: product.item_code ?? "-",
            productUnit: product.Unit?.name ?? "-",
            variantBuckets: new Map(),
          };
          productBuckets.set(product.id, bucket);
        }

        for (const detail of product.Product_Order_Details ?? []) {
          const variant = detail.Product_Variant;
          if (!variant) continue;

          const unitKg = Number(variant.weight_kg ?? parseFloat(variant.name));
          if (isNaN(unitKg)) continue;

          const qty = Number(detail.quantity || 0);
          const weightKey = unitKg.toString();

          const vb = bucket.variantBuckets.get(weightKey) ?? {
            variantName: variant.name ?? weightKey,
            unitKg,
            qty: 0,
            totalKg: 0,
          };

          vb.qty += qty;
          vb.totalKg += qty * unitKg;

          bucket.variantBuckets.set(weightKey, vb);
        }
      }

      // Create Excel sheet
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet("Product & Variant Summary");

      ws.addRow([
        "Product name",
        "Product unit",
        "Product Id",
        "Varient name",
        "Quantity",
        "Weight",
        "total Weight",
      ]);

      let grandTotalKg = 0;

      for (const [, bucket] of productBuckets) {
        let firstRow = true;

        const sortedVariants = [...bucket.variantBuckets.values()].sort(
          (a, b) => a.unitKg - b.unitKg,
        );

        const productTotalKg = sortedVariants.reduce(
          (sum, vb) => sum + vb.totalKg,
          0,
        );

        grandTotalKg += productTotalKg;

        for (const vb of sortedVariants) {
          ws.addRow([
            firstRow ? bucket.productName : "",
            firstRow ? bucket.productId : "",
            firstRow ? bucket.productUnit : "",
            vb.variantName,
            vb.qty,
            vb.totalKg.toFixed(2),
            firstRow ? productTotalKg.toFixed(2) : "",
          ]);
          firstRow = false;
        }
      }

      // Add grand total row
      // ws.addRow(["", "", "", "Grand Total", grandTotalKg.toFixed(2)]);

      const filePath = path.join(
        __dirname,
        "../../../../../../",
        "product_sell_List.xlsx",
      );
      await wb.xlsx.writeFile(filePath);

      res.download(filePath, "product_Order_summary.xlsx", (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error downloading file.");
        }
        fs.unlink(
          filePath,
          (uErr) => uErr && console.error("Temp file delete failed:", uErr),
        );
      });
    } catch (err) {
      console.error("Excel export error:", err);
      res.status(500).send("Error generating Excel file.");
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    // try {
    const include = [
      {
        model: p_category,
      },

      {
        model: Brand,
        required: false,
      },
      {
        model: LensType,
        required: false,
      },
      {
        model: LensCategory,
        required: false,
      },
      {
        model: Face_Width,
        required: false,
      },
      {
        model: Frame_Type,
        required: false,
      },
      {
        model: Gender,
        required: false,
      },
      {
        model: Material,
        required: false,
      },
      {
        model: Shape,
        required: false,
      },

      {
        model: Product_Images,
      },

      {
        model: Approval_Status,
      },

      {
        model: Country,
      },
      {
        model: Colour,
        as: "lens_color",
        required: false,
      },
      {
        model: Colour,
        required: false,
      },
      {
        model: Coating,
        required: false,
      },
      {
        model: Lense_Addons,
        required: false,
      },
    ];
    const result = await CheckExits(Product, { id: req.params.id }, t, include);

    if (!result) {
      await t.rollback();
      return Base.sendError(res, HTTPS.NOT_FOUND, "Product not found");
    }

    const data = {
      name: result?.name,
      customer_name: result?.customer_name,
      image: result?.image,
      price: result?.price,
      mrp: result?.mrp,
      tax_percentage: result?.tax_percentage,
      tax_amount: result?.tax_amount,
      discount: result?.discount,
      discount_amount: result?.discount_amount,
      base_amount: result?.base_amount,
      water_content: result?.water_content,
      diameter: result?.diameter,
      base_curve: result?.base_curve,
      modality: result?.modality,
      dk_t: result?.dk_t,
      index: result?.index,
      bo_code: result?.bo_code,
      coating_name: result?.coating_name,
      lens_type_id: result?.lens_type_id,
      lens_category_id: result?.lens_category_id,
      general_stock: result?.Product_Stock?.general_stock,
      subscription_stock: result?.Product_Stock?.subscription_stock,
      product_name: result?.manufacturer,
      description: result?.description,
      item_code: result?.item_code,
      model_no: result?.model_no,

      lic_no: result?.lic_no,
      tag: result?.tag,
      measurements: result?.measurements,
      is_returnable: result?.is_returnable,
      return_days: result?.return_days,
      is_replaceble: result?.is_replaceble,
      replace_days: result?.replace_days,
      allowed_quanitity: result?.allowed_quanitity,
      is_cod: result?.is_cod,
      top_pick: result?.top_pick,
      createdAt: result?.createdAt,
      farmer_status: result?.farmer_status,
      expity_date_days: result?.expity_date_days,
      sort_order: result?.sort_order,
      size: result?.size,
      total_measurements: result?.total_measurements,
      hsn_code: result?.hsn_code,
      approval_status_id: {
        value: result?.approval_status_id,
        name: "approval_status_id",
        label: result?.Approval_Status?.name,
      },
      color_id: {
        value: result?.color_id,
        name: "color_id",
        code: result?.Colour?.first_color,
        label: result?.Colour?.name,
      },
      lens_color_id: {
        value: result?.lens_color_id,
        name: "lens_color_id",
        code: result?.lens_color?.first_color,
        label: result?.lens_color?.name,
      },
      p_category_id: {
        value: result?.p_category_id,
        name: "p_category_id",
        label: result?.p_category?.name,
      },

      unit_id: {
        value: result?.unit_id,
        name: "unit_id",
        label: result?.Unit?.name,
      },
      brand_id: {
        value: result?.brand_id,
        name: "brand_id",
        label: result?.Brand?.name,
      },
      gender_id: {
        value: result?.gender_id,
        name: "gender_id",
        label: result?.Gender?.name,
      },
      frame_type_id: {
        value: result?.frame_type_id,
        name: "frame_type_id",
        label: result?.Frame_Type?.name,
      },
      face_width_id: {
        value: result?.face_width_id,
        name: "face_width_id",
        label: result?.Face_Width?.name,
      },
      material_id: {
        value: result?.material_id,
        name: "material_id",
        label: result?.Material?.name,
      },
      shape_id: {
        value: result?.shape_id,
        name: "shape_id",
        label: result?.Shape?.name,
      },
      lens_category_id: {
        value: result?.lens_category_id,
        name: "shape_id",
        label: result?.LensCategory?.name,
      },
      lens_type_id: {
        value: result?.lens_type_id,
        name: "shape_id",
        label: result?.LensType?.name,
      },
      made_in_id: {
        value: result?.made_in_id,
        name: "made_in_id",
        label: result?.Country?.name,
      },
      coating_id: {
        value: result?.coating_id,
        name: "coating_id",
        label: result?.Coating?.name,
      },
      variant_images:
        result?.Product_Images?.map((img) => ({
          id: img?.id ?? null,
          image: img?.image ?? "",
        })) ?? [],
      lense_addons:
        result?.Lense_Addons?.map((addon) => ({
          id: addon.id ?? null,
          lense_addon_name: addon.lense_addon_name ?? "",
          lense_addon_price: addon.lense_addon_price ?? "",
          lense_addon_mrp: addon.lense_addon_mrp ?? "",
        })) ?? [],
    };

    await t.commit();
    return Base.sendResponse(res, HTTPS.OK, data);
    // } catch (error) {
    //   await t.rollback();
    //   console.error("Error fetching Product:", error);
    //   return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    // }
  }

  async create(req, res) {
    const t = await sequelize.transaction();
    const parseLensAddons = JSON.parse(req.body.lense_addons || "[]");
    const Count = await Product.count({});
    try {
      const data = {
        name: req.body?.name?.trim(),
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
        manufacturer: req.body?.manufacturer?.trim() ?? "",
        description: req.body?.description?.trim(),
        p_category_id: req.body?.p_category_id || null,
        brand_id: req.body?.brand_id || null,
        gender_id: req.body?.gender_id || null,
        shape_id: req.body?.shape_id || null,
        color_id: req.body?.color_id || null,
        frame_type_id: req.body?.frame_type_id || null,
        face_width_id: req.body?.face_width_id || null,
        material_id: req.body?.material_id || null,
        made_in_id: req.body?.made_in_id || null,
        approval_status_id: IDS.ApprovalStatus.Approved,
        sort_order: Count + 1,
        // image: req.files?.thumbnail
        //   ? await File_Uploade(req.files?.thumbnail, "/uploads/Product")
        //   : null,
        tax_type_id: req.body?.tax_type_id || null,
        water_content: req.body?.water_content?.trim(),
        diameter: req.body?.diameter?.trim(),
        base_curve: req.body?.base_curve?.trim(),
        modality: req.body?.modality?.trim(),
        dk_t: req.body?.dk_t?.trim(),
        index:
          req.body?.index && !isNaN(req.body.index)
            ? Number(req.body.index)
            : null,

        lens_type_id: req.body?.lens_type_id || null,
        coating_id: req.body?.coating_id || null,
        lens_color_id: req.body?.lens_color_id || null,
        lens_category_id: req.body?.lens_category_id || null,
        bo_code: req.body?.bo_code?.trim(),
        coating_name: req.body?.coating_name?.trim(),
        size: req.body?.size?.trim(),
        total_measurements: req.body?.total_measurements?.trim(),
        // available_stock: req.body?.quantity,
        model_no: req.body?.model_no,
        customer_view: req.body?.customer_view,
        customer_name: req.body?.customer_name ?? "",
        hsn_code: req.body?.hsn_code ?? "",
      };

      if (req.files && req.files.thumbnail) {
        data.image = await File_Uploade(
          req.files.thumbnail,
          "/uploads/Product",
        );
      }

      const exists = await CheckExits(Product, { name: data?.name }, t);
      if (exists) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Product already exists",
        );
      }

      let newProduct;
      try {
        newProduct = await CreateNew(Product, data, t);
      
      } catch (err) {
        console.error("Error creating product:", err);
        await t.rollback();
        return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, err);
      }

      for (let addon of parseLensAddons) {
        await CreateNew(
          Lense_Addons,
          {
            product_id: newProduct.id,
            lense_addon_name: addon.lense_addon_name,
            lense_addon_price: addon.lense_addon_price,
            lense_addon_mrp: addon.lense_addon_mrp,
            status: true,
          },
          t,
        );
      }

      if (req?.files && req?.files?.image) {
        const variantImages = req.files.image;
        const images = Array.isArray(variantImages)
          ? variantImages
          : variantImages
            ? [variantImages]
            : [];

        for (const image of images) {
          const imageUrl = await File_Uploade(image, "/uploads/Product");

          await Product_Images.create(
            {
              product_id: newProduct.id,
              image: imageUrl,
            },
            { transaction: t },
          );
        }
      }

      if (req.body?.supplier_id) {
        const now = new Date();
        const count = await Purchase_Order.count({
          where: {
            createdAt: {
              [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
          transaction: t,
        });
        const day = String(now.getDate()).padStart(2, "0");
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const hour = String(now.getHours()).padStart(2, "0");
        const minute = String(now.getMinutes()).padStart(2, "0");
        const formattedCount = String(count + 1).padStart(3, "0");

        const batchNo = `BN${day}${month}${hour}${minute}${formattedCount}`;

        const PurchaseOrder = await CreateNew(
          Purchase_Order,
          {
            batch_no: batchNo,
            p_o_s_id: IDS.PurchaseOrderStatus.newOrder,
            user_id: req.user.user_id,
            supplier_id: req.body?.supplier_id,
            total_quantity: req.body.quantity,
          },
          t,
        );

        const PurchaseOrderProduct = await CreateNew(
          Purchase_Order_Product,
          {
            user_id: req.user.user_id,
            p_o_id: PurchaseOrder.id,
            product_id: newProduct.id,
            quantity: req.body.quantity,
            description: req.body?.description,
          },
          t,
        );

        const PurchaseHistory = await CreateNew(
          Purchase_History,
          {
            p_o_id: PurchaseOrder.id,
            p_o_s_id: IDS.PurchaseOrderStatus.newOrder,
            comment: "Order Added By product create",
            user_id: req.user.user_id,
            supplier_id: IDS.UserId.Supplier,
            total_quantity: req.body.quantity,
          },
          t,
        );

        // const Receivingdata = await CreateNew(
        //   Receiving,
        //   {
        //     p_o_id: PurchaseOrder?.id,
        //     batch_no: batchNo,
        //     user_id: req.user.user_id,
        //     supplier_id: req.body?.supplier_id,
        //     quantity: req.body.quantity,
        //     invoice_no: req.body.invoice_no,
        //     order_no: req.body.order_no,
        //     // expiry_date: req.body.expiry_date,
        //     total_price: req.body?.mrp || 0,
        //   },
        //   t,
        // );

        // await CreateNew(
        //   Purchase_Receiving,
        //   {
        //     p_o_id: PurchaseOrder.id,
        //     receiving_id: Receivingdata.id,
        //     user_id: req.user.user_id,
        //   },
        //   t,
        // );
        // const receivingProduct = await CreateNew(
        //   Receiving_Product,
        //   {
        //     receiving_id: Receivingdata.id,
        //     user_id: req.user.user_id,
        //     p_o_p_id: PurchaseOrderProduct?.id,
        //     product_id: newProduct?.id,
        //     quantity: req.body.quantity,
        //     total_price: req.body?.mrp || 0,
        //     price: req.body?.mrp || 0,
        //     description: "Stock add by Product Add ",
        //   },
        //   t,
        // );

        // const productstock = await CreateNew(
        //   Product_Stock,
        //   {
        //     receiving_product_id: receivingProduct.id,
        //     product_id: newProduct?.id,
        //     general_stock: req.body.quantity,
        //     user_id: req.user.user_id,
        //     receiving_id: Receivingdata.id,
        //   },
        //   t,
        // );
        // const quantityloop = Number(req.body.quantity || 0);
        // for (let i = 0; i < quantityloop; i++) {
        //   const barcodeimage = await barcodeGenerate(null, t);
        //   let stockData = {
        //     product_id: newProduct?.id,
        //     barcode_no: barcodeimage.barcode_no,
        //     supplier_id: req.body?.supplier_id,
        //     stock_status_id: IDS.Stock_Status.Available,
        //     model: req.body?.model_no || null,
        //     barcode: barcodeimage?.barcode,
        //     product_stock_id: productstock?.id,
        //   };

        //   const stock = await CreateNew(Stocks, stockData, t);
        //   await CreateNew(
        //     Stock_History,
        //     {
        //       stock_id: stock?.id,
        //       name: "stock added",
        //     },
        //     t,
        //   );
        // }

        // await CreateNew(
        //   Purchase_History,
        //   {
        //     p_o_id: req.body.id,
        //     p_o_s_id: IDS.PurchaseOrderStatus.Ordered,
        //     comment: "Order Converted To Receiving",
        //     user_id: req.user.user_id,
        //     supplier_id: req.body?.supplier_id,
        //     total_quantity: req.body.quantity,
        //   },
        //   t,
        // );
      }

      await t.commit();
      return Base.sendResponse(res, HTTPS.CREATED, newProduct);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Product:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async update(req, res) {
    const t = await sequelize.transaction();
    const parseLensAddons = JSON.parse(req.body.lense_addons || "[]");

    const Count = await Product.count({});
    try {
      const { id } = req.params;

      const data = {
        name: req.body?.name?.trim(),
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
        manufacturer: req.body?.manufacturer?.trim(),
        description: req.body?.description?.trim(),
        p_category_id: req.body?.p_category_id || null,
        brand_id: req.body?.brand_id || null,
        gender_id: req.body?.gender_id || null,
        shape_id: req.body?.shape_id || null,
        color_id: req.body?.color_id || null,
        frame_type_id: req.body?.frame_type_id || null,
        face_width_id: req.body?.face_width_id || null,
        material_id: req.body?.material_id || null,
        made_in_id: req.body?.made_in_id || null,
        approval_status_id: IDS.ApprovalStatus.Approved,
        sort_order: Count + 1,
        model_no: req.body?.model_no,
        // image: req.files?.thumbnail
        //   ? await File_Uploade(req.files?.thumbnail, "/uploads/Product")
        //   : null,
        tax_type_id: req.body?.tax_type_id || null,
        water_content: req.body?.water_content?.trim(),
        diameter: req.body?.diameter?.trim(),
        base_curve: req.body?.base_curve?.trim(),
        modality: req.body?.modality?.trim(),
        dk_t: req.body?.dk_t?.trim(),
        index:
          req.body?.index && !isNaN(req.body.index)
            ? Number(req.body.index)
            : null,
        customer_view: req.body?.customer_view,
        lens_type_id: req.body?.lens_type_id || null,
        lens_color_id: req.body?.lens_color_id || null,
        lens_category_id: req.body?.lens_category_id || null,
        coating_id: req.body?.coating_id || null,
        bo_code: req.body?.bo_code?.trim(),
        coating_name: req.body?.coating_name?.trim(),
        size: req.body?.size?.trim(),
        total_measurements: req.body?.total_measurements?.trim(),
        customer_name: req.body?.customer_name,
        hsn_code: req.body?.hsn_code ?? "",
      };

      // Only update image if it's provided
      if (req.files && req.files.thumbnail) {
        data.image = await File_Uploade(
          req.files.thumbnail,
          "/uploads/Product",
        );
      }

      // Check if name exists for other product
      // const exists = await CheckExits(Product, { name: data?.name }, t);

      // console.log(exists?.id, "exists?.id exists?.id");

      // if (exists?.id != id && exists !== null) {
      //   await t.rollback();
      //   return Base.sendError(
      //     res,
      //     HTTPS.NOT_ACCEPTABLE,
      //     "Product name already in use",
      //   );
      // }

      // Update product data
      await UpdateData(Product, data, { id }, t);

      const newProduct = await CheckExits(Product, { id }, t);

      if (req.files && req.files.image) {
        const variantImages = req.files.image;
        const images = Array.isArray(variantImages)
          ? variantImages
          : variantImages
            ? [variantImages]
            : [];

        for (const image of images) {
          const imageUrl = await File_Uploade(image, "/uploads/Product");

          await Product_Images.create(
            {
              product_id: newProduct.id,
              image: imageUrl,
            },
            { transaction: t },
          );
        }
      }
      await Lense_Addons.destroy({
        where: { product_id: id },
        transaction: t,
      });
      for (let addon of parseLensAddons) {
        await Lense_Addons.create(
          {
            product_id: id,
            lense_addon_name: addon.lense_addon_name,
            lense_addon_price: addon.lense_addon_price,
            lense_addon_mrp: addon.lense_addon_mrp,
            status: true,
          },
          { transaction: t },
        );
      }

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Product updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Product:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a country by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Product, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Product not found");
      }

      await Product.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "Product Deleted Successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Product:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async deleteProductImage(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Product_Images, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Product not found");
      }

      await Product_Images.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Product Image Deleted Successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Product:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Product, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Product,
        { status: result.status ? false : true },
        { id },
        t,
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Product status updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Product status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async MultiStatusChange(req, res) {
    const t = await sequelize.transaction();
    try {
      const { selectedItems } = req.body;

      if (!selectedItems || selectedItems.length === 0) {
        return Base.sendError(res, HTTPS.BAD_REQUEST, "No items selected");
      }

      await Product.update(
        { customer_view: true },
        {
          where: {
            id: selectedItems,
          },
          transaction: t,
        },
      );

      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, "Products updated successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error updating Product:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async topPick(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Product, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Product,
        { is_replaceble: result.is_replaceble ? false : true },
        { id },
        t,
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Top Pick status updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Product status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async TopStatus(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Product, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Product,
        { top_status: result.top_status ? false : true },
        { id },
        t,
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Top Pick status updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Product status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async TrandingStatus(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Product, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Product,
        { tranding_status: result.tranding_status ? false : true },
        { id },
        t,
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Top Pick status updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Product status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async BarcodeStatus(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Product, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Product,
        { barcode_status: result.barcode_status ? false : true },
        { id },
        t,
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Top Pick status updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Product status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async CustomerStatus(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Product, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Product,
        { customer_view: result.customer_view ? false : true },
        { id },
        t,
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Top Pick status updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Product status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async productStatus(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { approval_status_id } = req?.body;

      const include = [
        {
          model: Store_Detail,
          include: [
            {
              model: Users,
            },
          ],
        },
      ];

      const product = await CheckExits(Product, { id: id }, t, include);

      if (!product) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Product not found");
      }

      await UpdateData(Product, { approval_status_id }, { id: id }, t);

      await t.commit();

      const statusMapping = {
        [IDS.ApprovalStatus.Approved]: "Approved",
        [IDS.ApprovalStatus.Rejected]: "Rejected",
        [IDS.ApprovalStatus.OnHold]: "On Hold",
        [IDS.ApprovalStatus.UnderReview]: "Under Review",
      };

      const product_status = statusMapping[approval_status_id] || "Pending";

      const mailOptions = {
        from: "ankur.jain@profcyma.in",
        to: product?.Store_Detail?.User?.email,
        subject: "Product Request",
      };

      if (product_status === "Approved") {
        mailOptions.html = `
                    <b>Thank you for Contributing!</b>
                    <p>Your request for product ${product?.name} has been Approved.</p>
                    <br>
                    <h3>We Wish You All The Best!</h3>
                    <br>
                    <br> Thanks and Regards
                    <br> Ankur Jain
                    <br> Backend Developer
                    <br> Profcyma
                    <br>
                    <img src="https://profcyma.com/assets/images/logo/Profcyma-logotwo.png" alt="Profcyma Logo" style="width: 200px; height: 100px;">
                `;
      } else {
        mailOptions.html = `
                    <b>Thank you for Showing Interest!</b>
                    <p>Your request for product ${product?.name} has been ${product_status}.</p>
                `;
      }

      sendMail(mailOptions);

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Product status updated successfully",
      );
    } catch (error) {
      // await t.rollback();
      console.error("Error updating Product status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async linkProducts(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Product, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Product not found");
      }

      if (req.body.linked_product_id) {
        const CategoryIds = Array.isArray(req.body.linked_product_id)
          ? req.body.linked_product_id
          : [req.body.linked_product_id];

        const categories = await CheckExits(
          Often_Ordered_With,
          { product_id: id },
          t,
        );

        if (categories) {
          await Often_Ordered_With.destroy({
            where: { product_id: id },
            transaction: t,
          });
        }

        for (const item of CategoryIds) {
          await CreateNew(
            Often_Ordered_With,
            { product_id: id, linked_product_id: item },
            t,
          );
        }
      } else {
        await Often_Ordered_With.destroy({
          where: { product_id: id },
          transaction: t,
        });
      }

      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, "Products linked successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error linking Products:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async BulkUpload(req, res) {
    const t = await sequelize.transaction();
    try {
      if (!req.files?.file) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          `Products Bulk Upload Required A File`,
        );
      }

      const filePath = await File_Uploade(
        req.files.file,
        "/bulkupload/product",
      );

      const absoluteFilePath = path.join(
        __dirname,
        "../../../../../../",
        filePath,
      );

      const workbook = xlsx.readFile(absoluteFilePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });

      const result = [];
      let count = await Product.count({ transaction: t });

      const final_result = {
        total: 0,
        added_count: 0,
        not_added_count: 0,
        added: [],
        not_added: [],
      };

      for (let r of rows) {
        let currentProduct = null;
        r = Object.values(r);

        let categoryCheck = await p_category.findOne({
          where: {
            id: req.body.p_category_id,
          },
        });

        let name = "";

        let modelNo = "";
        let barcode = "";
        let bocode = "";
        let price = 0;
        let cost_price = 0;
        let supplier;
        let quantity = 1;
        let missingFields;

        if (categoryCheck?.id == IDS.Category.Sunglasses) {
          supplier = await Supplier.findOne({
            where: {
              gst_no: r[17],
            },
          });
          if (!supplier) {
            supplier = await Supplier.create({
              name: r[16],
              gst_no: r[17],
            });
          }

          // if (r?.[17]) {
          //   const gstNo = r[17];

          //   const [supplierData] = await Supplier.findOrCreate({
          //     where: {
          //       gst_no: gstNo,
          //     },
          //     defaults: {
          //       name: r?.[16] || "Unknown Supplier",
          //       gst_no: gstNo,
          //     },
          //     transaction: t,
          //   });

          //   supplier = supplierData;
          // }

          missingFields = getMissingFields(r, COLUMN_INDEX_MAP_SUN, ["WLP"]);

          let brandCheck = null;
          let materialCheck = null;
          let frameTypeCheck = null;
          let genderCheck = null;
          let colorCheck = null;
          let lensColorCheck = null;
          let shapeCheck = null;

          let category = await p_category.findOne({
            where: {
              id: IDS.Category.Sunglasses,
            },
          });
          if (r?.[2]) {
            brandCheck = await Brand.findOne({ where: { name: r[2] } });
            if (!brandCheck) {
              brandCheck = await Brand.create({
                name: r[2],
                image: "/public/default_images/brand.png",
              });
              await Brand_Category.create({
                category_id: IDS.Category.Sunglasses,
                brand_id: brandCheck?.id,
                name: r?.[2],
              });
            }
          }

          if (r?.[5]) {
            materialCheck = await Material.findOne({ where: { name: r[5] } });
            if (!materialCheck) {
              materialCheck = await Material.create({
                name: r[5],
                category_id: IDS.Category.Sunglasses,
              });
            }
          }

          // FRAME-TYPE
          if (r?.[6]) {
            frameTypeCheck = await Frame_Type.findOne({
              where: { name: r[6] },
            });
            if (!frameTypeCheck) {
              frameTypeCheck = await Frame_Type.create({ name: r[6] });
            }
          }

          // GENDER
          if (r?.[7]) {
            genderCheck = await Gender.findOne({ where: { name: r[7] } });
            if (!genderCheck) {
              genderCheck = await Gender.create({ name: r[7] });
            }
          }

          // FRAME COLOR
          if (r?.[8]) {
            colorCheck = await Colour.findOne({ where: { name: r[8] } });
            if (!colorCheck) {
              colorCheck = await Colour.create({ name: r[8] });

              await Color_Category.create({
                category_id: IDS.Category.Sunglasses,
                color_id: colorCheck?.id,
              });
            }
          }

          // LENS COLOR
          if (r?.[9]) {
            lensColorCheck = await Colour.findOne({ where: { name: r[9] } });
            if (!lensColorCheck) {
              lensColorCheck = await Colour.create({ name: r[9] });
              const cc = await Color_Category.create({
                category_id: IDS.Category.Sunglasses,
                color_id: lensColorCheck?.id,
              });
            }
          }

          // SHAPE
          if (r?.[10]) {
            shapeCheck = await Shape.findOne({ where: { name: r[10] } });
            if (!shapeCheck) {
              shapeCheck = await Shape.create({ name: r[10] });
            }
          }

          // PRODUCT NAME FORMAT (Brand + Lens Color + Frame Color + Model No)
          name = [
            r?.[2],
            r?.[9], // lens color
            r?.[8], // frame color
            r?.[3], // model no
          ]
            .filter(Boolean)
            .join(" ");

          modelNo = r?.[3] || null;
          barcode = r?.[4] || null;
          cost_price = parseFloat(r?.[18]) || 0.0;

          const parsedMrp = parseFloat(r?.[14]) || 0;
          let baseAmount = 0;
          let taxAmount = 0;
          let discountAmount = 0;
          let sellingPrice = 0;
          const parsedDiscount = parseFloat(category?.discount_percentage) || 0;
          const parsedTax = parseFloat(category?.tax_percentage) || 0;

          if (parsedMrp > 0) {
            discountAmount = (parsedMrp * parsedDiscount) / 100;
            sellingPrice = parsedMrp - discountAmount;

            if (parsedTax > 0) {
              taxAmount = (sellingPrice * parsedTax) / 100;
              baseAmount = sellingPrice - taxAmount;
            }
          }
          price = sellingPrice || 0.0;
          currentProduct = {
            name,
            description: (r?.[15] || "").toString(),
            image: `/public/uploads/Product/${barcode}-1.jpg`,
            price: sellingPrice || 0.0,
            mrp: parseFloat(r?.[14]) || 0.0,
            discount: parsedDiscount || 0.0,
            discount_amount: discountAmount || 0.0,
            tax_percentage: parsedTax || 0.0,
            tax_amount: taxAmount || 0.0,
            base_amount: baseAmount || 0.0,
            p_category_id: req.body.p_category_id,
            brand_id: brandCheck?.id || null,
            gender_id: genderCheck?.id || null,
            shape_id: shapeCheck?.id || null,
            color_id: colorCheck?.id || null,
            lens_color_id: lensColorCheck?.id || null,
            frame_type_id: frameTypeCheck?.id || null,
            material_id: materialCheck?.id || null,
            size: r?.[11] || null,
            total_measurements: r?.[12] || null,
            model_no: modelNo,

            approval_status_id: IDS.ApprovalStatus.Approved,
            available_stock: 0,
            barcode_status: 1,
            hsn_code: r?.[13] ?? "",
            customer_view: false,
          };
          // const discount = parseFloat(r?.[15]) || 0;
          // const taxPercentage = parseFloat(r?.[18]) || 0;

          // if (discount > 100) {
          //   final_result.not_added.push({
          //     ...currentProduct,
          //     reason: `Discount cannot be greater than 100 (found ${discount})`,
          //   });
          //   final_result.not_added_count++;
          //   final_result.total++;
          //   continue;
          // }

          // if (taxPercentage > 100) {
          //   final_result.not_added.push({
          //     ...currentProduct,
          //     reason: `Tax Percentage cannot be greater than 100 (found ${taxPercentage})`,
          //   });
          //   final_result.not_added_count++;
          //   final_result.total++;
          //   continue;
          // }
        }

        if (categoryCheck?.id == IDS.Category.Eyeglasses) {
          missingFields = getMissingFields(r, COLUMN_INDEX_MAP_EYE, ["WLP"]);
          supplier = await Supplier.findOne({
            where: {
              gst_no: r[16],
            },
          });
          if (!supplier) {
            supplier = await Supplier.create({
              name: r[15],
              gst_no: r[16],
            });
          }

          //  if (r?.[16]) {
          //   const gstNo = r[16];

          //   const [supplierData] = await Supplier.findOrCreate({
          //     where: {
          //       gst_no: gstNo,
          //     },
          //     defaults: {
          //       name: r?.[15] || "Unknown Supplier",
          //       gst_no: gstNo,
          //     },
          //     transaction: t,
          //   });

          //   supplier = supplierData;
          // }
          let brandCheck = await Brand.findOne({
            where: {
              name: r?.[2],
            },
          });

          if (!brandCheck) {
            brandCheck = await Brand.create({
              name: r?.[2],
              image: "/public/default_images/brand.png",
            });

            await Brand_Category.create({
              category_id: IDS.Category.Eyeglasses,
              brand_id: brandCheck?.id,
              name: r?.[2],
            });
          }

          let materialCheck = await Material.findOne({
            where: {
              name: r?.[5],
            },
          });

          if (!materialCheck) {
            materialCheck = await Material.create({
              name: r?.[5],
              category_id: IDS.Category.Eyeglasses,
            });
          }

          let frameTypeCheck = await Frame_Type.findOne({
            where: {
              name: r?.[6],
            },
          });

          if (!frameTypeCheck) {
            frameTypeCheck = await Frame_Type.create({
              name: r?.[6],
            });
          }

          let genderCheck = await Gender.findOne({
            where: {
              name: r?.[7],
            },
          });

          if (!genderCheck) {
            genderCheck = await Gender.create({
              name: r?.[7],
            });
          }

          let colorCheck = await Colour.findOne({
            where: {
              name: r?.[8],
            },
          });

          if (!colorCheck) {
            colorCheck = await Colour.create({
              name: r?.[8],
            });

            const cc = await Color_Category.create({
              category_id: IDS.Category.Eyeglasses,
              color_id: colorCheck?.id,
            });
          }

          name = [r?.[2], r?.[9], r?.[8], r?.[3]].filter(Boolean).join(" ");

          let shapeCheck = await Shape.findOne({
            where: {
              name: r?.[9],
            },
          });

          if (!shapeCheck) {
            shapeCheck = await Shape.create({
              name: r?.[9],
            });
          }
          modelNo = r?.[3] || null;
          barcode = r?.[4] || null;
          console.log(
            supplier?.name,
            "->",
            supplier?.id,
            "->",
            name,
            "->",
            barcode,
            "name name",
          );
          cost_price = parseFloat(r?.[17]) || 0.0;
          let category = await p_category.findOne({
            where: {
              id: IDS.Category.Eyeglasses,
            },
          });
          const parsedMrp = parseFloat(r?.[13]) || 0;
          let baseAmount = 0;
          let taxAmount = 0;
          let discountAmount = 0;
          let sellingPrice = 0;
          const parsedDiscount = parseFloat(category?.discount_percentage) || 0;
          const parsedTax = parseFloat(category?.tax_percentage) || 0;

          if (parsedMrp > 0) {
            discountAmount = (parsedMrp * parsedDiscount) / 100;
            sellingPrice = parsedMrp - discountAmount;

            if (parsedTax > 0) {
              taxAmount = (sellingPrice * parsedTax) / 100;
              baseAmount = sellingPrice - taxAmount;
            }
          }
          price = sellingPrice || 0.0;
          currentProduct = {
            name: name,
            image: `/public/uploads/Product/${barcode}-1.jpg`.toString(),
            description: (r?.[14] || "").toString(),
            price: sellingPrice || 0.0,
            mrp: parseFloat(r?.[13]) || 0.0,
            discount: parsedDiscount || 0.0,
            discount_amount: discountAmount || 0.0,
            tax_percentage: parsedTax || 0.0,
            tax_amount: taxAmount || 0.0,
            base_amount: baseAmount || 0.0,
            p_category_id: req.body.p_category_id,
            brand_id: brandCheck?.id || null,
            gender_id: genderCheck?.id || null,
            shape_id: shapeCheck?.id || null,
            color_id: colorCheck?.id || null,
            frame_type_id: frameTypeCheck?.id || null,
            material_id: materialCheck?.id || null,
            size: r?.[10] || null,
            total_measurements: r?.[11] || null,
            model_no: modelNo,
            approval_status_id: IDS.ApprovalStatus.Approved,
            available_stock: 0,
            barcode_status: 1,
            hsn_code: r?.[12] ?? "",
            customer_view: false,
          };

          // const discount = parseFloat(r?.[14]) || 0;
          // const taxPercentage = parseFloat(r?.[17]) || 0;

          // if (discount > 100) {
          //   final_result.not_added.push({
          //     ...currentProduct,
          //     reason: `Discount cannot be greater than 100 (found ${discount})`,
          //   });
          //   final_result.not_added_count++;
          //   final_result.total++;
          //   continue;
          // }

          // if (taxPercentage > 100) {
          //   final_result.not_added.push({
          //     ...currentProduct,
          //     reason: `Tax Percentage cannot be greater than 100 (found ${taxPercentage})`,
          //   });
          //   final_result.not_added_count++;
          //   final_result.total++;
          //   continue;
          // }
        }

        if (categoryCheck?.id == IDS.Category.ContactLens) {
          missingFields = getMissingFields(r, CONTACT_LENS_COLUMN_INDEX_MAP);

          supplier = await Supplier.findOne({
            where: {
              gst_no: r[16],
            },
          });
          if (!supplier) {
            supplier = await Supplier.create({
              name: r[15],
              gst_no: r[16],
            });
          }
          let brandCheck = await Brand.findOne({
            where: {
              name: r?.[4],
              image: "/public/default_images/brand.png",
            },
          });

          if (!brandCheck) {
            brandCheck = await Brand.create({
              name: r?.[4],
              image: "/public/default_images/brand.png",
            });
            await Brand_Category.create({
              category_id: IDS.Category.ContactLens,
              brand_id: brandCheck?.id,
              name: r?.[2],
            });
          }

          let materialCheck = await Material.findOne({
            where: {
              name: r?.[6],
            },
          });

          if (!materialCheck) {
            materialCheck = await Material.create({
              name: r?.[6],
              category_id: IDS.Category.ContactLens,
            });
          }

          name = [r?.[4], r?.[5]].filter(Boolean).join(" ");
          bocode = r?.[1];

          let category = await p_category.findOne({
            where: {
              id: IDS.Category.ContactLens,
            },
          });
          const parsedMrp = parseFloat(r?.[14]) || 0;
          let baseAmount = 0;
          let taxAmount = 0;
          let discountAmount = 0;
          let sellingPrice = 0;
          const parsedDiscount = parseFloat(category?.discount_percentage) || 0;
          const parsedTax = parseFloat(category?.tax_percentage) || 0;

          if (parsedMrp > 0) {
            discountAmount = (parsedMrp * parsedDiscount) / 100;
            sellingPrice = parsedMrp - discountAmount;

            if (parsedTax > 0) {
              taxAmount = (sellingPrice * parsedTax) / 100;
              baseAmount = sellingPrice - taxAmount;
            }
          }
          price = sellingPrice || 0.0;
          cost_price = parseFloat(r?.[17]) || 0.0;
          currentProduct = {
            name: name,
            image: (`/public/uploads/Product/${bocode}-1.jpg` || "").toString(),
            description: (r?.[18] || "").toString(),
            size: (r?.[11] || "").toString(),
            price: sellingPrice,
            mrp: parseFloat(r?.[14]) || 0.0,
            discount: parsedDiscount || 0.0,
            discount_amount: discountAmount,
            tax_percentage: parsedTax || 0.0,
            tax_amount: taxAmount || 0.0,
            base_amount: baseAmount || 0.0,
            p_category_id: req.body.p_category_id,
            brand_id: brandCheck?.id || null,
            material_id: materialCheck?.id || null,
            bo_code: r?.[1] || null,
            modality: r?.[2] || null,
            dk_t: r?.[10] || null,
            water_content: r?.[7] || null,
            diameter: r?.[9] || null,
            base_curve: r?.[8] || null,
            approval_status_id: IDS.ApprovalStatus.Approved,
            available_stock: 0,
            barcode_status: 0,
            manufacturer: r?.[5],
            hsn_code: r?.[19] ?? "",
            customer_view: false,
          };
        }

        if (categoryCheck?.id == IDS.Category.Lenses) {
          missingFields = getMissingFields(r, LENS_COLUMN_INDEX_MAP);

          supplier = await Supplier.findOne({
            where: {
              gst_no: r[14],
            },
          });
          if (!supplier) {
            supplier = await Supplier.create({
              name: r[13],
              gst_no: r[14],
            });
          }
          let brandCheck = await Brand.findOne({
            where: {
              name: r?.[0],
            },
          });

          if (!brandCheck) {
            brandCheck = await Brand.create({
              name: r?.[0],
              image: "/public/default_images/brand.png",
            });
            await Brand_Category.create({
              category_id: IDS.Category.Lenses,
              brand_id: brandCheck?.id,
            });
          }
          let category = await p_category.findOne({
            where: {
              id: IDS.Category.Lenses,
            },
          });

          let LensTypeCheck = await LensType.findOne({
            where: {
              name: r?.[4],
            },
          });

          if (!LensTypeCheck) {
            LensTypeCheck = await LensType.create({
              name: r?.[4],
            });
          }
          let LensCategoryCheck = await LensCategory.findOne({
            where: {
              name: r?.[3],
            },
          });

          if (!LensCategoryCheck) {
            LensCategoryCheck = await LensCategory.create({
              name: r?.[3],
            });
          }

          let materialCheck = await Material.findOne({
            where: {
              name: r?.[6],
            },
          });

          if (!materialCheck) {
            materialCheck = await Material.create({
              name: r?.[6],
              category_id: IDS.Category.Lenses,
            });
          }

          let cotingCheck = await Coating.findOne({
            where: {
              name: r?.[9],
            },
          });

          if (!cotingCheck) {
            cotingCheck = await Coating.create({
              name: r?.[9],
              // category_id: IDS.Category.Lenses,
            });
          }

          let colorCheck = await Colour.findOne({
            where: {
              name: r?.[5],
            },
          });

          if (!colorCheck) {
            colorCheck = await Colour.create({
              name: r?.[5],
            });
            const cc = await Color_Category.create({
              category_id: IDS.Category.Lenses,
              color_id: colorCheck?.id,
            });
          }
          name = [r?.[8], r?.[2]].filter(Boolean).join(" ");

          const parsedMrp = parseFloat(r?.[10]) || 0;
          let baseAmount = 0;
          let taxAmount = 0;
          let discountAmount = 0;
          let sellingPrice = 0;
          const parsedDiscount = parseFloat(category?.discount_percentage) || 0;
          const parsedTax = parseFloat(category?.tax_percentage) || 0;

          if (parsedMrp > 0) {
            discountAmount = (parsedMrp * parsedDiscount) / 100;
            sellingPrice = parsedMrp - discountAmount;

            if (parsedTax > 0) {
              taxAmount = (sellingPrice * parsedTax) / 100;
              baseAmount = sellingPrice - taxAmount;
            }
          }
          bocode = r?.[2];
          price = sellingPrice || 0.0;
          cost_price = parseFloat(r?.[15]) || 0.0;

          currentProduct = {
            name: name,
            image: (`/public/uploads/Product/${bocode}-1.jpg` || "").toString(),
            description: (r?.[16] || "").toString(),
            price: sellingPrice || 0.0,
            mrp: parsedMrp || 0.0,
            discount: category?.discount_percentage || 0.0,
            discount_amount: discountAmount || 0.0,
            tax_percentage: category?.tax_percentage || 0.0,
            tax_amount: taxAmount || 0.0,
            base_amount: baseAmount || 0.0,
            material_id: materialCheck?.id || null,
            p_category_id: req.body.p_category_id,
            brand_id: brandCheck?.id || null,
            lens_type_id: LensTypeCheck?.id || null,
            lens_category_id: LensCategoryCheck?.id || null,
            lens_color_id: colorCheck?.id || null,
            bo_code: r?.[2] || null,
            // size: r?.[17] || null,
            index: r?.[7] || null,
            coating_id: cotingCheck.id,
            // modality: r?.[2] || null,
            // dk_t: r?.[10] || null,
            // water_content: r?.[7] || null,
            // diameter: r?.[9] || null,
            // base_curve: r?.[8] || null,
            approval_status_id: IDS.ApprovalStatus.Approved,
            available_stock: 0,
            barcode_status: 0,
            hsn_code: r?.[17] ?? "",
            customer_view: false,
          };
        }

        let exists;
        // if (currentProduct?.color_id) {
        //   exists = await CheckExits(
        //     Product,
        //     { name: currentProduct.name, color_id: currentProduct?.color_id },
        //     t
        //   );
        // } else {
        exists = await CheckExits(Product, { name: currentProduct.name }, t);
        // }

        // const missingFields = getMissingFields(r);

        if (missingFields.length > 0) {
          final_result.not_added.push({
            ...currentProduct,
            reason: `Missing required fields: ${missingFields.join(", ")}`,
          });
          final_result.not_added_count++;
          final_result.total++;
          continue;
        }

        let existsBarcode;
        if (exists) {
          let reason = "Product already exists";
          if (
            categoryCheck?.id == IDS.Category.Sunglasses ||
            categoryCheck?.id == IDS.Category.Eyeglasses
          ) {
            existsBarcode = await CheckExits(
              Stocks,
              { barcode_no: barcode, product_id: exists?.id },
              t,
            );
            if (!existsBarcode) {
              reason = "Product already exists but new barcode added";
            }
          }

          final_result.not_added.push({
            ...currentProduct,
            reason,
          });

          // final_result.not_added.push(currentProduct);
          final_result.not_added_count = ++final_result.not_added_count;
          final_result.total = ++final_result.total;
        }

        if (name && !exists) {
          result.push(currentProduct);
          exists = await CreateNew(Product, currentProduct, t);
          existsBarcode = await CheckExits(
            Stocks,
            { barcode_no: barcode, product_id: exists?.id },
            t,
          );

          for (let i = 1; i <= 2; i++) {
            await CreateNew(
              Product_Images,
              {
                product_id: exists?.id,
                image: `/public/uploads/Product/${
                  barcode || bocode
                }-${i}.jpg`.toString(),
              },
              t,
            );
          }

          final_result.added.push(currentProduct);
          final_result.added_count = ++final_result.added_count;
          final_result.total = ++final_result.total;

          if (
            categoryCheck?.id == IDS.Category.Lenses ||
            categoryCheck?.id == IDS.Category.ContactLens
          ) {
            if (bocode && exists) {
              const quantityloop = Number(quantity || 0);

              await UpdateData(
                Product,
                { available_stock: exists?.available_stock + quantity },
                { id: exists?.id },
                t,
              );

              const now = new Date();

              const day = String(now.getDate()).padStart(2, "0");
              const month = String(now.getMonth() + 1).padStart(2, "0");
              const hour = String(now.getHours()).padStart(2, "0");
              const minute = String(now.getMinutes()).padStart(2, "0");
              const formattedCount = String(count + 1).padStart(3, "0");

              const batchNo = `BN${day}${month}${hour}${minute}${formattedCount}`;

              const PurchaseOrder = await CreateNew(
                Purchase_Order,
                {
                  batch_no: batchNo,
                  p_o_s_id: IDS.PurchaseOrderStatus.Ordered,
                  user_id: req.user.user_id,
                  supplier_id: supplier?.id,
                  total_quantity: quantity,
                },
                t,
              );

              const PurchaseOrderProduct = await CreateNew(
                Purchase_Order_Product,
                {
                  user_id: req.user.user_id,
                  p_o_id: PurchaseOrder.id,
                  product_id: exists.id,
                  quantity: quantity,
                  description: "Stock add by bulk upload ",
                },
                t,
              );

              const Receivingdata = await CreateNew(
                Receiving,
                {
                  p_o_id: PurchaseOrder?.id,
                  batch_no: batchNo,
                  user_id: req.user.user_id,
                  supplier_id: supplier.id,
                  quantity: quantity,
                  invoice_no: r?.[23],
                  order_no: r?.[24],
                  // expiry_date: req.body.expiry_date,
                  total_price: cost_price || price,
                },
                t,
              );
              await CreateNew(
                Purchase_Receiving,
                {
                  p_o_id: PurchaseOrder.id,
                  receiving_id: Receivingdata.id,
                  user_id: req.user.user_id,
                },
                t,
              );
              const receivingProduct = await CreateNew(
                Receiving_Product,
                {
                  receiving_id: Receivingdata.id,
                  user_id: req.user.user_id,
                  p_o_p_id: PurchaseOrderProduct?.id,
                  product_id: exists?.id,
                  quantity: quantity,
                  total_price: cost_price || price,
                  price: cost_price || price,
                  description: "Stock add by bulk upload ",
                },
                t,
              );

              const productstock = await CreateNew(
                Product_Stock,
                {
                  receiving_product_id: receivingProduct.id,
                  product_id: exists?.id,
                  // variant_id: variant.variant_id,
                  general_stock: quantity,
                  // selling_price: variant.selling_price,
                  // subscription_stock: variant.subscription_stock,
                  user_id: req.user.user_id,
                  receiving_id: Receivingdata.id,
                },
                t,
              );

              for (let i = 0; i < quantityloop; i++) {
                const stockData = {
                  product_id: exists?.id,
                  supplier_id: supplier?.id,
                  stock_status_id: IDS.Stock_Status.Available,
                  product_stock_id: productstock?.id,
                };

                const stock = await CreateNew(Stocks, stockData, t);
                await CreateNew(
                  Stock_History,
                  {
                    stock_id: stock?.id,
                    name: "stock added",
                  },
                  t,
                );
              }

              const PurchaseHistory = await CreateNew(
                Purchase_History,
                {
                  p_o_id: req.body.id,
                  p_o_s_id: IDS.PurchaseOrderStatus.Ordered,
                  comment: "Order Converted To Receiving",
                  user_id: req.user.user_id,
                  supplier_id: supplier?.id,
                  total_quantity: quantity,
                },
                t,
              );
            }
          }
        }

        if (barcode && !existsBarcode) {
          await UpdateData(
            Product,
            { available_stock: exists?.available_stock + 1 },
            { id: exists?.id },
            t,
          );

          const now = new Date();

          const day = String(now.getDate()).padStart(2, "0");
          const month = String(now.getMonth() + 1).padStart(2, "0");
          const hour = String(now.getHours()).padStart(2, "0");
          const minute = String(now.getMinutes()).padStart(2, "0");
          const formattedCount = String(count + 1).padStart(3, "0");

          const batchNo = `BN${day}${month}${hour}${minute}${formattedCount}`;

          const PurchaseOrder = await CreateNew(
            Purchase_Order,
            {
              batch_no: batchNo,
              p_o_s_id: IDS.PurchaseOrderStatus.Ordered,
              user_id: req.user.user_id,
              supplier_id: supplier?.id,
              total_quantity: 1,
            },
            t,
          );

          const PurchaseOrderProduct = await CreateNew(
            Purchase_Order_Product,
            {
              user_id: req.user.user_id,
              p_o_id: PurchaseOrder.id,
              product_id: exists.id,
              quantity: 1,
              description: "Stock add by bulk upload ",
            },
            t,
          );

          const Receivingdata = await CreateNew(
            Receiving,
            {
              p_o_id: PurchaseOrder?.id,
              batch_no: batchNo,
              user_id: req.user.user_id,
              supplier_id: supplier.id,
              quantity: 1,
              invoice_no: r?.[23],
              order_no: r?.[24],
              // expiry_date: req.body.expiry_date,
              total_price: cost_price || price,
            },
            t,
          );

          await CreateNew(
            Purchase_Receiving,
            {
              p_o_id: PurchaseOrder.id,
              receiving_id: Receivingdata.id,
              user_id: req.user.user_id,
            },
            t,
          );

          const receivingProduct = await CreateNew(
            Receiving_Product,
            {
              receiving_id: Receivingdata.id,
              user_id: req.user.user_id,
              p_o_p_id: PurchaseOrderProduct?.id,
              product_id: exists?.id,
              quantity: 1,
              total_price: cost_price || price,
              price: cost_price || price,
              description: "Stock add by bulk upload ",
            },
            t,
          );

          const productstock = await CreateNew(
            Product_Stock,
            {
              receiving_product_id: receivingProduct.id,
              product_id: exists?.id,
              // variant_id: variant.variant_id,
              general_stock: 1,
              // selling_price: variant.selling_price,
              // subscription_stock: variant.subscription_stock,
              user_id: req.user.user_id,
              receiving_id: Receivingdata.id,
            },
            t,
          );
          const barcodeimage = await barcodeGenerate(barcode, t);
          let stockData = {
            product_id: exists?.id,
            barcode_no: barcode,
            supplier_id: supplier?.id,
            stock_status_id: IDS.Stock_Status.Available,
            model: modelNo || null,
            barcode: barcodeimage?.barcode,
            product_stock_id: productstock?.id,
          };

          const stock = await CreateNew(Stocks, stockData, t);

          await CreateNew(
            Stock_History,
            {
              stock_id: stock?.id,
              name: "stock added",
            },
            t,
          );

          await CreateNew(
            Purchase_History,
            {
              p_o_id: req.body.id,
              p_o_s_id: IDS.PurchaseOrderStatus.Ordered,
              comment: "Order Converted To Receiving",
              user_id: req.user.user_id,
              supplier_id: supplier?.id,
              total_quantity: 1,
            },
            t,
          );
          // }
        }
      }

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, final_result);
    } catch (error) {
      await t.rollback();
      console.error("BulkUpload Error:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async ZipUpload(req, res) {
    try {
      if (!req.files || !req.files.file) {
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Products Zip Upload Requires a File",
        );
      }

      const zipFile = req.files.file;
      console.log(zipFile, "zipFile zipFile");

      // Extract images directly without uploading the zip
      const outputDir = path.join(
        __dirname,
        "../../../../../../public/uploads/Product",
      );
      console.log(outputDir, "outputDir outputDir");

      const extractedPath = await unzipAndSaveFromBuffer(
        zipFile.data, // use file buffer
        zipFile.name,
        outputDir,
      );

      return Base.sendResponse(res, HTTPS.OK, {
        extractedPath,
        message: "Zip contents extracted successfully",
      });
    } catch (error) {
      console.error("ZipUpload Error:", error);
      return Base.sendError(
        res,
        HTTPS.INTERNAL_SERVER_ERROR,
        "Zip upload failed",
      );
    }
  }

  async Sample(req, res) {
    try {
      let { category_id } = req.body;

      let name = null;
      if (!category_id) {
        return Base.sendError(res, HTTPS.NOT_FOUND, "Category not found");
      }

      if (category_id == IDS.Category.Eyeglasses) {
        name = "Eyeglasses";
      }
      if (category_id == IDS.Category.Sunglasses) {
        name = "Sunglasses";
      }
      if (category_id == IDS.Category.Accessories) {
        name = "Accessories";
      }
      if (category_id == IDS.Category.ContactLens) {
        name = "ContactLens";
      }
      if (category_id == IDS.Category.Lenses) {
        name = "Lenses";
      }

      if (!name) {
        return Base.sendError(res, HTTPS.NOT_FOUND, "Category not found");
      }
      return await DownloadSample(req, res, name);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new ProductController();
