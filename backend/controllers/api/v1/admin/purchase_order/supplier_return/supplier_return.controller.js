const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
  NotificationsManagment,
  barcodeGenerate,
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
  Purchase_History,
  Product_Stock,
  Product,
  Supplier,
  Product_Variant_Stock,
  Product_Variant,
  Stocks,
  p_category,
  Brand,
  Shape,
  Replace_status,
  Stock_History,
  Supplier_Return_Details,
  sequelize,
} = require("../../../../../../models/index");
const { Op } = require("sequelize");
const product = require("../../../../../../models/product");
const IDS = require("../../../../../../helper/fix_ids");
const moment = require("moment");
const purchase_order = require("../../../../../../models/purchase_order");
const { commonMail } = require("../../../../../../helper/NodeMailer");
const supplier_return_details = require("../../../../../../models/supplier_return_details");

const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
class PlanController {
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      let whereClause = {
        // [Op.or]: [
        //   {
        //     [Op.and]: [{ batch_no: { [Op.like]: `%${name}%` } }],
        //   },
        // ],
      };

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

      const options = {
        include: [
          { model: Product, paranoid: false },
          {
            model: Stocks,
            paranoid: false,
            include: [{ model: Stock_History }],
          },
          {
            model: Supplier,
            paranoid: false,
          },

          {
            model: Replace_status,
            paranoid: false,
          },
        ],
        where: whereClause,
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Supplier_Return_Details, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Plans:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const include = [
        {
          model: Purchase_Order_Product,
          include: [{ model: Product, paranoid: false }],
        },

        {
          model: Supplier,
          paranoid: false,
        },
      ];

      const result = await Purchase_Order.findOne({
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
        supplier_id: {
          value: result.supplier_id,
          name: "supplier_id",
          label: result.Supplier?.name || "",
        },
        quantitys: result.Purchase_Order_Products?.map((val) => ({
          id: val.id,
          quantity: val.quantity,
          description: val.description,
          product_id: {
            value: val.product_id,
            name: "product_id",
            label: val.Product?.name || "",
          },
          barcode_status: val.Product?.barcode_status,
          price: val.Product?.price || "",
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

  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const parsequantitys = JSON.parse(req.body.quantitys || "[]");

      for (let val of parsequantitys) {
        const stockAvailable = await Stocks.findOne({
          include: [{ model: Product_Stock, include: [{ model: Receiving }] }],
          where: {
            product_id: val.product_id,
            stock_status_id: IDS?.StockStatus?.Available,
          },
          transaction: t,
        });

        await CreateNew(
          Supplier_Return_Details,
          {
            supplier_id: val.supplier_id,
            product_id: val.product_id,
            stock_id: val.stock_id || stockAvailable?.id,
            replace_status_id: IDS?.ReplaceStatus?.Requested,
            description: val.description,
          },
          t,
        );

        await CreateNew(
          Stock_History,
          {
            stock_id: val.stock_id || stockAvailable?.id,

            name: "Product Return supplier",
          },
          t,
        );

        await UpdateData(
          Stocks,
          {
            stock_status_id: IDS?.StockStatus?.Damaged,
          },
          { id: val.stock_id || stockAvailable?.id },
          t,
        );

        const supplier = await Supplier.findOne({
          where: { id: val.supplier_id },
          transaction: t,
        });

        if (!supplier?.email) {
          return Base.sendError(
            res,
            HTTPS.NOT_FOUND,
            `Please add the email ID of ${supplier?.name}.`,
          );
        }

        const stock = await Stocks.findOne({
          where: { id: val.stock_id || stockAvailable?.id },
          transaction: t,
        });

        const product = await Product.findOne({
          where: { id: val.product_id },
          transaction: t,
        });

        const emailBody = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
    
    <!-- Header -->
    <div style="background-color: #f44336; color: white; padding: 16px; text-align: center;">
      <h2 style="margin: 0;">Product Return Request</h2>
    </div>
    
    <!-- Body -->
    <div style="padding: 20px; color: #333;">
      <p>Dear ${supplier?.name || "Supplier"},</p>

      <p>We would like to inform you that the following product of <b>Barcode #${
        stock?.barcode_no
      }</b> needs to be returned.</p>
      
     <p style="margin-top: 20px;">Product Name:</p>
      <p style="background-color: #f9f9f9; padding: 12px; border-radius: 6px; border: 1px solid #ddd;">
        ${
          product?.name ||
          "The product was found defective or not as per specifications."
        }
      </p>

         <p style="margin-top: 20px;">Purchase Price:</p>
      <p style="background-color: #f9f9f9; padding: 12px; border-radius: 6px; border: 1px solid #ddd;">
        ${
          stockAvailable?.Product_Stock?.Receiving?.total_price ||
          "The product was found defective or not as per specifications."
        }
      </p>
       <p style="margin-top: 20px;">Invoice No:</p>
      <p style="background-color: #f9f9f9; padding: 12px; border-radius: 6px; border: 1px solid #ddd;">
        ${stockAvailable?.Product_Stock?.Receiving?.invoice_no || "-"}
      </p>
       <p style="margin-top: 20px;">Order No:</p>
      <p style="background-color: #f9f9f9; padding: 12px; border-radius: 6px; border: 1px solid #ddd;">
        ${stockAvailable?.Product_Stock?.Receiving?.order_no || "-"}
      </p>


      <p style="margin-top: 20px;">Description:</p>
      <p style="background-color: #f9f9f9; padding: 12px; border-radius: 6px; border: 1px solid #ddd;">
        ${
          val.description ||
          "The product was found defective or not as per specifications."
        }
      </p>

      <p style="margin-top: 20px;">Kindly arrange for pickup or replacement at the earliest convenience.</p>

      <p>Thank you for your prompt attention to this matter.</p>

      <p>Best Regards,<br>
      <b>Bapat Optics</b></p>
    </div>

  </div>
`;

        if (supplier?.email) {
          await commonMail(
            supplier?.email,
            `Product Return Request - PO#${stock?.barcode_no}`,
            emailBody,
          );
        }
      }

      await t.commit();
      return Base.sendResponse(res, HTTPS.CREATED);
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
        Purchase_Order,
        {
          total_quantity: req.body.total_quantity,
        },
        { id: id },
        t,
      );

      await Purchase_Order_Product.destroy({
        where: {
          p_o_id: id,
        },
        transaction: t,
      });

      for (let val of parsequantitys) {
        await CreateNew(
          Purchase_Order_Product,
          {
            user_id: req.user.user_id,
            p_o_id: id,
            product_id: val.product_id,
            quantity: val.quantity,
            description: val.description,
          },
          t,
        );
      }
      const PurchaseHistory = await CreateNew(
        Purchase_History,
        {
          p_o_id: id,
          p_o_s_id: IDS.PurchaseOrderStatus.newOrder,
          comment: "Updated Added",
          user_id: req.user.user_id,
          supplier_id: req.body.supplier_id,
          total_quantity: req.body.total_quantity,
        },
        t,
      );

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
  async ReplaceStatus(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { replace_status_id } = req.body;

      const result = await CheckExits(Supplier_Return_Details, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      if (Number(replace_status_id) === Number(IDS.ReplaceStatus.NotReplaced)) {
        await CreateNew(
          Stock_History,
          {
            stock_id: result?.stock_id,

            name: "stock Not Replaced",
          },
          t,
        );
      } else if (
        Number(replace_status_id) === Number(IDS.ReplaceStatus.CNIssued)
      ) {
        await CreateNew(
          Stock_History,
          {
            stock_id: result?.stock_id,
            name: "stock CN Issued",
          },
          t,
        );
      } else {
        await UpdateData(
          Stocks,
          {
            stock_status_id: IDS.StockStatus?.Available,
          },
          { id: result?.stock_id },
          t,
        );
        await CreateNew(
          Stock_History,
          {
            stock_id: result?.stock_id,

            name: "stock Replaced",
          },
          t,
        );
      }

      await UpdateData(
        Supplier_Return_Details,
        {
          replace_status_id: replace_status_id,
        },
        { id },
        t,
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Replace status updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Wallet status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async getDownloadExcelOrderList(req, res) {
    try {
      const name = req.query.term?.trim() || "";

      let whereClause = {
        [Op.or]: [
          {
            [Op.and]: [{ batch_no: { [Op.like]: `%${name}%` } }],
          },
        ],
      };

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

      // Build include with return status filter
      const include = [
        { model: Product, paranoid: false },
        { model: Stocks, include: [{ model: Stock_History }] },
        {
          model: Supplier,
          paranoid: false,
        },

        {
          model: Replace_status,
          paranoid: false,
        },
      ];

      const orders = await Supplier_Return_Details.findAll({
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
        "Model No",
        "Barcode No",
        "Bocode",
        "Product Name",
        "Supplier Name",
        "Description",
        "Replace Status",
        "Date",
      ]);

      // Populate rows
      let rowIndex = 1;

      orders.forEach((order) => {
        worksheet.addRow([
          rowIndex++,
          order?.Stock?.model || "-",
          order?.Stock?.barcode_no || "-",
          order?.Product?.bo_code || "-",
          order?.Product?.name || "-",
          order?.Supplier?.name || "-",
          order?.description,
          order?.Replace_status?.name,
          order?.createdAt?.toISOString().split("T")[0] || "-",
        ]);
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
