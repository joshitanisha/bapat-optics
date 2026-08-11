const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,

  BulkUploadCreate,
  DownloadSample,
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
  p_sub_category,
  p_category,
  Store_Detail,
  Product_Images,
  Approval_Status,
  Item_Type,
  p_child_category,
  Product_Variant,
  Often_Ordered_With,
  Country,
  Stock_Type,
  Pack_Type,
  Product_Farmer,
  Product_Pack_Type,
  Product_Delivery_Type,
  Delivery_Type,
  Product_Stock,
  Cart,
  Farmer,
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
  Stocks,
} = require("../../../../../../models/index");
const { Op } = require("sequelize");
const xlsx = require("xlsx");
const path = require("path");
const nodemailer = require("nodemailer");
const IDS = require("../../../../../../helper/fix_ids");
const { sendMail } = require("../../../../../../helper/NodeMailer");
const product = require("../../../../../../models/product");
const colour = require("../../../../../../models/colour");

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
class ProductController {
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const approval_status_id = req.query.approval_status_id || "";
      const p_category_id = req.query.p_category_id || "";
      const p_sub_category_id = req.query.p_sub_category_id || "";
      const p_child_category_id = req.query.p_child_category_id || "";
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

      if (p_sub_category_id) {
        whereClause.p_sub_category_id = p_sub_category_id;
      }

      if (p_child_category_id) {
        whereClause.p_child_category_id = p_child_category_id;
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
          // { model: p_sub_category },
          // { model: p_child_category },
          // { model: Unit, required: false },
          { model: Brand, required: false },
          { model: Approval_Status },
          // {
          //   model: Often_Ordered_With,
          //   include: [{ model: Product, as: "linked_product" }],
          // },
          { model: Country },
          { model: Product_Order_Detail },
          // { model: Pack_Type },
          // { model: Stock_Type },
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
      const p_sub_category_id = req.query.p_sub_category_id || "";
      const p_child_category_id = req.query.p_child_category_id || "";
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

      if (p_sub_category_id) {
        whereClause.p_sub_category_id = p_sub_category_id;
      }

      if (p_child_category_id) {
        whereClause.p_child_category_id = p_child_category_id;
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
        // { model: p_sub_category },
        { model: Product_Variant },
        // { model: p_child_category },
        { model: Unit, required: false },
        { model: Brand, required: false },
        { model: Approval_Status },
        {
          model: Often_Ordered_With,
          include: [{ model: Product, as: "linked_product" }],
        },
        { model: Country },
        { model: Product_Order_Detail },
        { model: Pack_Type },
        { model: Stock_Type },
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
        "product_sell_List.xlsx"
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
        p_sub_category_id = "",
        p_child_category_id = "",
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
      // if (p_category_id) whereClause.p_category_id = p_category_id;
      // if (p_sub_category_id) whereClause.p_sub_category_id = p_sub_category_id;
      if (p_child_category_id)
        whereClause.p_child_category_id = p_child_category_id;
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
          (a, b) => a.unitKg - b.unitKg
        );

        const productTotalKg = sortedVariants.reduce(
          (sum, vb) => sum + vb.totalKg,
          0
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
        "product_sell_List.xlsx"
      );
      await wb.xlsx.writeFile(filePath);

      res.download(filePath, "product_Order_summary.xlsx", (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error downloading file.");
        }
        fs.unlink(
          filePath,
          (uErr) => uErr && console.error("Temp file delete failed:", uErr)
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
    try {
      const include = [
        {
          model: p_category,
        },
        {
          model: LensCategory,
        },
        {
          model: LensType,
        },
        {
          model: Brand,
          required: false,
        },
        {
          model: Material,
          required: false,
        },

        {
          model: Approval_Status,
        },
        {
          model: Product_Variant,
          include: [{ model: Colour }, { model: Product_Images }],
        },

        {
          model: Country,
        },

       
      ];
      const result = await CheckExits(
        Product,
        { id: req.params.id },
        t,
        include
      );

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Product not found");
      }

      const data = {
        name: result?.name,
        image: result?.image,
        price: result?.price,
        mrp: result?.mrp,
        general_stock: result?.Product_Stock?.general_stock,
        subscription_stock: result?.Product_Stock?.subscription_stock,
        manufacturer: result?.manufacturer,
        description: result?.description,
        item_code: result?.item_code,
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
        tax_percentage: result?.tax_percentage,
        createdAt: result?.createdAt,
        farmer_status: result?.farmer_status,
        
        sort_order: result?.sort_order,
        bo_code: result?.bo_code,
        index: result?.index,
        coating_name: result?.coating_name,
        cyl: result?.cyl,
        resultant_power: result?.resultant_power,
        approval_status_id: {
          value: result?.approval_status_id,
          name: "approval_status_id",
          label: result?.Approval_Status?.name,
        },
        p_category_id: {
          value: result?.p_category_id,
          name: "p_category_id",
          label: result?.p_category?.name,
        },
        lens_category_id: {
          value: result?.lens_category_id,
          name: "lens_category_id",
          label: result?.LensCategory?.name,
        },
        lens_type_id: {
          value: result?.lens_type_id,
          name: "lens_type_id",
          label: result?.LensType?.name,
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
        material_id: {
          value: result?.material_id,
          name: "material_id",
          label: result?.Material?.name,
        },

        tax_type_id: {
          value: result?.tax_type_id,
          name: "tax_type_id",
          label: result?.Tax_Type?.name,
        },

        variants: result?.Product_Variants?.map((item) => ({
          id: item?.id,
          name: item?.name,
          price: item?.price,
          mrp: item?.mrp,
          description: item?.description,
          general_stock: item?.general_stock,
          color_id: {
            value: item?.color_id,
            name: "color_id",
            label: item?.Colour?.name,
            code: item?.Colour?.first_color,
          },

          variant_images:
            item?.Product_Images?.map((img) => ({
              id: img?.id ?? null,
              image: img?.image ?? "",
            })) ?? [],
        })),
      };

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Product:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new country
  async create(req, res) {
    const t = await sequelize.transaction();
    const Count = await Product.count({});
    try {
      const data = {
        name: req.body?.name?.trim(),
        price: req.body?.price?.trim(),
        mrp: req.body?.mrp?.trim(),
        manufacturer: req.body?.manufacturer?.trim(),
        description: req.body?.description?.trim(),
        tax_percentage: req?.body?.tax_percentage,
        p_category_id: 1,
        lens_type_id: req.body?.lens_type_id,
        lens_category_id: req.body?.lens_category_id,
        brand_id: req.body?.brand_id,
        material_id: req.body?.material_id,
        approval_status_id: IDS.ApprovalStatus.Approved,
        sort_order: Count + 1,
        image: req.files?.image
          ? await File_Uploade(req.files?.image, "/uploads/Product")
          : null,
        tax_type_id: req.body?.tax_type_id,
        bo_code: req.body?.bo_code,
        index: req.body?.index,
        coating_name: req.body?.coating_name,
        cyl: req.body?.cyl,
        resultant_power: req.body?.resultant_power,
      };

      const exists = await CheckExits(Product, { name: data?.name }, t);
      if (exists) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Product already exists"
        );
      }

      const newProduct = await CreateNew(Product, data, t);

      if (req?.body?.variants) {
        const variants = JSON.parse(req?.body?.variants);

        for (let index = 0; index < variants.length; index++) {
          const variant = variants[index];
          const barcode = await findUniqueBarcode();
          const modelno = await findUniqueModel();
          const dataToProductVariants = {
            mrp: variant.mrp?.trim(),
            price: variant.price?.trim(),
            product_id: newProduct?.id,
            color_id: variant?.color_id,
            name: variant?.name,
            barcode: barcode,
            model_no: modelno,
          };

          const createdVariant = await CreateNew(
            Product_Variant,
            dataToProductVariants,
            t
          );

          const variantImages = req.files[`images${index}`];
          const images = Array.isArray(variantImages)
            ? variantImages
            : variantImages
            ? [variantImages]
            : [];

          for (const image of images) {
            const imageUrl = await File_Uploade(image, "/uploads/Product");

            await Product_Images.create(
              {
                variant_id: createdVariant.id,
                product_id: newProduct.id,
                image: imageUrl,
              },
              { transaction: t }
            );
          }
        }
      }

      await t.commit();
      return Base.sendResponse(res, HTTPS.CREATED, newProduct);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Product:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a country by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        name: req.body?.name?.trim(),
        price: req.body?.price?.trim(),
        mrp: req.body?.mrp?.trim(),
        manufacturer: req.body?.manufacturer?.trim(),
        description: req.body?.description?.trim(),
        tax_percentage: req?.body?.tax_percentage,
        p_category_id: req.body?.p_category_id,
        brand_id: req.body?.brand_id,
        material_id: req.body?.material_id,
        approval_status_id: IDS.ApprovalStatus.Approved,
        tax_type_id: req.body?.tax_type_id,
        bo_code: req.body?.bo_code,
        index: req.body?.index,
        coating_name: req.body?.coating_name,
        cyl: req.body?.cyl,
        resultant_power: req.body?.resultant_power,
        lens_type_id: req.body?.lens_type_id,
        lens_category_id: req.body?.lens_category_id,
      };

      // Only update image if it's provided
      if (req.files && req.files.image) {
        data.image = await File_Uploade(req.files.image, "/uploads/Product");
      }

      // Check if name exists for other product
      const exists = await CheckExits(Product, { name: data?.name }, t);
      if (exists?.id != id && exists !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Product name already in use"
        );
      }

      // Swap sort order if needed
      const existingSortProduct = await Product.findOne({
        where: { sort_order: req.body.sort_order },
        transaction: t,
      });

      const currentProduct = await Product.findOne({
        where: { id },
        transaction: t,
      });

      if (
        Number(existingSortProduct?.sort_order) === Number(req.body.sort_order)
      ) {
        await Product.update(
          { sort_order: currentProduct?.sort_order },
          {
            where: { id: existingSortProduct?.id },
            transaction: t,
          }
        );
      }

      // Update product data
      await UpdateData(Product, data, { id }, t);

      const newItem = await CheckExits(Product, { id }, t);

      // Variant Handling
      if (req?.body?.variants) {
        const variants = JSON.parse(req.body.variants);

        const incomingVariantIds = variants
          .filter((variant) => variant.id)
          .map((variant) => variant.id);

        await Product_Variant.destroy({
          where: {
            product_id: newItem?.id,
            id: { [Op.notIn]: incomingVariantIds },
          },
          transaction: t,
        });

        for (let index = 0; index < variants.length; index++) {
          const variant = variants[index];

          const variantData = {
            mrp: variant.mrp?.trim(),
            price: variant.price?.trim(),
            product_id: newItem?.id,
            color_id: variant?.color_id,
            name: variant?.name,
            general_stock: variant?.general_stock,
          };

          let variantInstance;

          if (variant?.id) {
            await Product_Variant.update(variantData, {
              where: { id: variant.id },
              transaction: t,
            });

            variantInstance = await Product_Variant.findByPk(variant.id, {
              transaction: t,
            });
          } else {
            const barcode = await findUniqueBarcode();
            const modelno = await findUniqueModel();
            variantData.model_no = modelno;
            variantData.barcode = barcode;
            variantInstance = await CreateNew(Product_Variant, variantData, t);
          }

          if (req.files?.[`images${index}`]) {
            const images = Array.isArray(req.files?.[`images${index}`])
              ? req.files[`images${index}`]
              : req.files?.[`images${index}`]
              ? [req.files[`images${index}`]]
              : [];

            for (const image of images) {
              const imageUrl = await File_Uploade(image, "/uploads/Product");
              await Product_Images.create(
                {
                  variant_id: variantInstance.id,
                  product_id: newItem.id,
                  image: imageUrl,
                },
                { transaction: t }
              );
            }
          }
        }
      }

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Product updated successfully"
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
        "Product Image Deleted Successfully"
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
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Product status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Product status:", error);
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
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Top Pick status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Product status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async seasonableStatus(req, res) {
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
        { seasonable_status: result.seasonable_status ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Top Pick status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Product status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async PopularStatus(req, res) {
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
        { popular_status: result.popular_status ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Top Pick status updated successfully"
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
        "Product status updated successfully"
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
          t
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
            t
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
          `Products Bulk Upload Required A File`
        );
      }

      const filePath = await File_Uploade(
        req.files.file,
        "/bulkupload/product"
      );

      const absoluteFilePath = path.join(
        __dirname,
        "../../../../../../",
        filePath
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

      for (const r of rows) {
        let currentProduct = null;
        let currentVariant = null;

        if (r.name) {
          currentProduct = {
            name: (r.name || "").toString(),
            image: (`/public/uploads/Product/${r.image}` || "").toString(),
            manufacturer: (r.manufacturer || "").toString(),
            description: (r.description || "").toString(),
            tax_percentage: r.tax_percentage || 0,
            approval_status_id: IDS.ApprovalStatus.Approved,
            sort_order: ++count,
            variants: [],
          };

          const exists = await CheckExits(
            Product,
            { name: currentProduct.name },
            t
          );
          if (exists) {
            final_result.not_added.push(currentProduct);
            final_result.not_added_count = ++final_result.not_added_count;
            final_result.total = ++final_result.total;
            continue;
          }

          const [gender] = await BulkUploadCreate(
            Gender,
            { name: (r.gender || "").toString().trim() },
            t
          );
          const [shape] = await BulkUploadCreate(
            Shape,
            { name: (r.shape || "").toString().trim() },
            t
          );
          const [material] = await BulkUploadCreate(
            Material,
            { name: (r.material || "").toString().trim() },
            t
          );
          const [frameType] = await BulkUploadCreate(
            Frame_Type,
            { name: (r.frame_type || "").toString().trim() },
            t
          );
          const [faceWidth] = await BulkUploadCreate(
            Face_Width,
            { name: (r.face_width || "").toString().trim() },
            t
          );
          const [pcategory] = await BulkUploadCreate(
            p_category,
            { name: (r.p_category || "").toString().trim() },
            t
          );
          const [brand] = await BulkUploadCreate(
            Brand,
            { name: (r.brand || "").toString().trim() },
            t
          );
          const [madeIn] = await BulkUploadCreate(
            Country,
            { name: (r.made_in || "").toString().trim() },
            t
          );

          Object.assign(currentProduct, {
            gender_id: gender?.id,
            shape_id: shape?.id,
            material_id: material?.id,
            frame_type_id: frameType?.id,
            face_width_id: faceWidth?.id,
            p_category_id: pcategory?.id,
            brand_id: brand?.id,
            made_in_id: madeIn?.id,
          });

          result.push(currentProduct);
        }

        if (r.v_name && result.length) {
          currentVariant = {
            name: (r.v_name || "").toString(),
            price: (r.price || "").toString(),
            mrp: (r.mrp || "").toString(),
            size: (r.size || "").toString(),
            general_stock: Number(r.general_stock || 0),
            images: [],
            items: [],
          };

          const [color] = await BulkUploadCreate(
            Colour,
            {
              name: (r.color || "").toString().trim(),
              first_color: (r.color_code || "").toString().trim(),
            },
            t
          );

          currentVariant.color_id = color?.id;
          result[result.length - 1].variants.push(currentVariant);
        }

        if (r.images && result.length) {
          const imgs = r.images
            .toString()
            .split(",")
            .map((img) => img.trim())
            .filter(Boolean);
          const lastVariant = result[result.length - 1].variants.slice(-1)[0];
          if (lastVariant) lastVariant.images.push(...imgs);
        }

        if ((r.barcode || r.model) && result.length) {
          const lastVariant = result[result.length - 1].variants.slice(-1)[0];
          if (lastVariant) {
            lastVariant.items.push({
              barcode: (r.barcode || "").toString(),
              barcode_image: (r.barcode_image || "").toString(),
              model: (r.model || "").toString(),
            });
          }
        }
      }

      for (const product of result) {
        const newProduct = await CreateNew(Product, product, t);

        for (const variant of product.variants) {
          variant.product_id = newProduct.id;
          const createdVariant = await CreateNew(Product_Variant, variant, t);

          for (const image of variant?.images) {
            await Product_Images.create(
              {
                variant_id: createdVariant.id,
                product_id: newProduct.id,
                image: `/public/uploads/Product/${image}`,
              },
              { transaction: t }
            );
          }

          for (const item of variant?.items) {
            await Stocks.create(
              {
                variant_id: createdVariant.id,
                product_id: newProduct.id,
                barcode_no: item.barcode_no,
                model: item.model,
                barcode: `/public/uploads/Product/${item.barcode_image}`,
                stock_status_id: IDS.Stock_Status.Available,
              },
              { transaction: t }
            );
          }
        }

        final_result.added.push(product);
        final_result.added_count = ++final_result.added_count;
        final_result.total = ++final_result.total;
      }

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, final_result);
    } catch (error) {
      await t.rollback();
      console.error("BulkUpload Error:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async Sample(req, res) {
    try {
      return await DownloadSample(req, res, "Bapat Products2");
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new ProductController();
