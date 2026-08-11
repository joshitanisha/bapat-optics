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
  Supplier_Product,
  Product_Stock,
  Product,
  Supplier,
  sequelize,
} = require("../../../../../../models/index");
const { Op } = require("sequelize");
const product = require("../../../../../../models/product");
const IDS = require("../../../../../../helper/fix_ids");
const moment = require("moment");
const purchase_order = require("../../../../../../models/purchase_order");
class PlanController {
  // Fetch all Data
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";

      // Build where clause with name search
      const whereClause = {};
      if (name) {
        whereClause.name = { [Op.like]: `%${name}%` };
      }

      const options = {
        where: whereClause,
        order: [["createdAt", "DESC"]],
      };

      await Paginate(Supplier, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Suppliers:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const result = await Supplier.findOne({
        where: { id: req.params.id },
        // include: [
        //   {
        //     model: Supplier_Product,
        //     include: [{ model: Product }],
        //   },
        // ],
        transaction: t,
      });

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Supplier not found");
      }

      await t.commit(); // ✅ Commit only after successful find
      return Base.sendResponse(res, HTTPS.OK, result); // ❗ Fix: you were returning `data`, which is undefined
    } catch (error) {
      if (!t.finished) {
        await t.rollback(); // ✅ Rollback only if transaction is still active
      }
      console.error("Error fetching supplier:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new country
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const {
        pincode_id,
        bank_details,
        address,
        shope_name,
        contact,
        email,
        name,
        gst_no,
      } = req.body;

      const PurchaseOrder = await CreateNew(
        Supplier,
        {
          pincode_id: pincode_id,
          bank_details: bank_details,
          address: address,
          shope_name: shope_name,
          contact: contact,
          email: email,
          name: name,
          status: true,
          gst_no,
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
      const {
        pincode_id,
        bank_details,
        address,
        shope_name,
        contact,
        email,
        name,

        gst_no,
      } = req.body;
      const PurchaseOrder = await UpdateData(
        Supplier,
        {
          pincode_id: pincode_id,
          bank_details: bank_details,
          address: address,
          shope_name: shope_name,
          contact: contact,
          email: email,
          name: name,

          gst_no,
        },
        { id: id },
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
        Supplier,
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
      const result = await CheckExits(Supplier, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Plan not found");
      }
      // await Supplier_Product.destroy({
      //   where: { p_o_id: id },
      //   transaction: t,
      // });
      await Supplier.destroy({ where: { id }, transaction: t });

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

      const result = await CheckExits(Supplier, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Supplier,
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
}

module.exports = new PlanController();
