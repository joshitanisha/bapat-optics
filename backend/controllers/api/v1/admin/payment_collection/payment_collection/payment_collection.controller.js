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
  Purchase_History,
  Product_Stock,
  Subscription,
  Product,
  Subscription_Product_Details,
  Subscription_Delivery_Details,
  Subscription_Week_Details,
  Time_Slot,
  Users,Payment_Collect_Details,Payment_Collect,
  sequelize,
} = require("../../../../../../models/index");
const { Op } = require("sequelize");
const product = require("../../../../../../models/product");
const IDS = require("../../../../../../helper/fix_ids");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
const moment = require("moment");
const purchase_order = require("../../../../../../models/purchase_order");
class PlanController {
  // Fetch all Data
  async findAll(req, res) {
    try {
      const term = req.query.term?.trim() || "";
      const page = parseInt(req.query.page) || 1;
      const per_page = parseInt(req.query.per_page) || 10;

      const customer = req.query.customer || "";

      const from = req.query.from || "";
      const to = req.query.to || "";
      let start_time = req.query.start_time || "";
      let end_time = req.query.end_time || "";

      // Normalize time
      const parseToTime = (value, fallback) => {
        const date = new Date(`1970-01-01T${value}`);
        return isNaN(date.getTime()) ? fallback : moment(date).format("HH:mm");
      };

      start_time = parseToTime(start_time, "00:00");
      end_time = parseToTime(end_time, "23:59");

      // Build main where clause
      const where = {};

      // if (searchOrderStatus) {
      //   // where.order_status_id = searchOrderStatus;
      // }

      const whereClauseProduct = {};

      if (term) {
        whereClauseProduct.name = { [Op.like]: `%${term}%` };
      }
      const whereClauseCustomer = {};

      if (customer) {
        whereClauseCustomer.name = { [Op.like]: `%${customer}%` };
      }
      // Build time slot filter
      const timeSlotWhere = {};
      if (from && to) {
        const fromDate = moment(from).startOf("day").toDate(); // 00:00:00
        const toDate = moment(to).endOf("day").toDate(); // 23:59:59
        where.date = { [Op.between]: [fromDate, toDate] };
      } else if (from) {
        const fromDate = moment(from).startOf("day").toDate();
        where.date = { [Op.gte]: fromDate };
      } else if (to) {
        const toDate = moment(to).endOf("day").toDate();
        where.date = { [Op.lte]: toDate };
      }

      if (start_time && end_time) {
        timeSlotWhere.from = { [Op.gte]: start_time };
        timeSlotWhere.to = { [Op.lte]: end_time };
      }
      // const options = {
      //   include: [
      //     { model: Product },

      //     { model: Subscription },
      //     { model: Subscription_Week_Details },
      //     {
      //       model: Subscription_Delivery_Details,
      //       include: [{ model: Time_Slot }],
      //     },
      //   ],
      //   where: whereClause,
      //   order: [["createdAt", "DESC"]],
      // };

      const { count, rows: data } =
        await Payment_Collect_Details.findAndCountAll({
          include: [
            { model: Payment_Collect ,where:whereClauseProduct},

          
          ],
          // where: whereClause,
          order: [["createdAt", "DESC"]],
          offset: (page - 1) * per_page,
          limit: per_page,
          distinct: true,
        });

      // const totalSellingValue = data.reduce((sum, order) => {
      //   return sum + (Number(order.total_amount) || 0);
      // }, 0);
      const totalWeight = data.reduce((sum, order) => {
        return sum + (Number(order.quantity) || 0);
      }, 0);

      // const averageSellingValue = count > 0 ? totalSellingValue / count : 0;
      const total_pages = Math.ceil(count / per_page);

      return Base.sendResponse(res, HTTPS.OK, {
        data,
        current_page: page,
        total_pages,
        per_page,
        total: count,
        search_name: term,

        total_weight: parseFloat(totalWeight || 0).toFixed(2),
      });
      // await Paginate(Subscription_Product_Details, options, req, res, Op);
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
          model: Purchase_Order_Product,
          include: [{ model: Product }],
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
        quantitys: result.Purchase_Order_Products?.map((val) => ({
          id: val.id,
          quantity: val.quantity,
          product_id: {
            value: val.product_id,
            name: "product_id",
            label: val.Product?.name || "",
          },
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
        t
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
          t
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
        t
      );

      await t.commit();
      return Base.sendResponse(res, HTTPS.CREATED, PurchaseOrder);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Plan:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a country by ID
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
        t
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
          },
          t
        );
      }
      const PurchaseHistory = await CreateNew(
        Purchase_History,
        {
          p_o_id: id,
          p_o_s_id: IDS.PurchaseOrderStatus.newOrder,
          comment: "Updated Added",
          user_id: req.user.user_id,
          supplier_id: IDS.UserId.Supplier,
          total_quantity: req.body.total_quantity,
        },
        t
      );

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Plan updated successfully"
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
        t
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
          t
        );
      }
      const ReceivingHistory = await CreateNew(
        Purchase_Receiving,
        {
          p_o_id: req.body.id,
          receiving_id: Receivingdata?.id,

          user_id: req.user.user_id,
        },
        t
      );
      const PurchaseOrder = await UpdateData(
        Purchase_Order,
        {
          p_o_s_id: IDS.PurchaseOrderStatus.Ordered,
        },
        { id: req.params.id },
        t
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
        t
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
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Plan status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Plan status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async getDownloadExcelSubscriptionOrderList(req, res) {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Subscription Order List");

      const term = req.query.term || "";
      const fromDate = req.query.from
        ? new Date(req.query.from.trim()).setHours(0, 0, 0, 0)
        : null;
      const toDate = req.query.to
        ? new Date(req.query.to.trim()).setHours(23, 59, 59, 999)
        : null;

      let whereClause = {};

      if (fromDate && toDate) {
        whereClause.createdAt = { [Op.between]: [fromDate, toDate] };
      } else if (fromDate) {
        whereClause.createdAt = { [Op.gte]: fromDate };
      } else if (toDate) {
        whereClause.createdAt = { [Op.lte]: toDate };
      }

      const subscriptionRecords = await Subscription_Product_Details.findAll({
        where: whereClause,
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Product,
            where: term ? { name: { [Op.like]: `%${term}%` } } : undefined,
          },
          {
            model: Subscription,
          },
          {
            model: Subscription_Week_Details,
          },
          {
            model: Subscription_Delivery_Details,
          },
        ],
      });

      worksheet.addRow([
        "Sr No",
        "Plan Name",
        "Product Name",
        "Quantity",
        "Serving Size",
        "Calories",
        "Created Date",
      ]);

      let DataArray = [];
      console.log(DataArray, "DataArrayDataArray");

      subscriptionRecords.forEach((data) => {
        const result = {
          plan_name: data?.Subscription?.plan_name || "-",
          product_name: data?.Product?.name || "-",
          quantity: data?.quantity || "-",
          serving_size: data?.serving_size || "-",
          calories: data?.calories || "-",
          created_date: data?.createdAt
            ? new Date(data.createdAt).toISOString().split("T")[0]
            : "-",
        };

        DataArray.push(result);
      });

      DataArray.forEach((record, index) => {
        worksheet.addRow([
          index + 1,
          record.plan_name,
          record.product_name,
          record.quantity,
          record.serving_size,
          record.calories,
          record.created_date,
        ]);
      });

      const filePath = path.join(__dirname, "Subscription_Order_List.xlsx");
      await workbook.xlsx.writeFile(filePath);

      res.download(filePath, "Subscription_Order_List.xlsx", (err) => {
        if (err) {
          console.log(err);
          res
            .status(500)
            .send("An error occurred while generating the Excel file.");
        }

        fs.unlinkSync(filePath);
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("An error occurred while generating the Excel file.");
    }
  }
}

module.exports = new PlanController();
