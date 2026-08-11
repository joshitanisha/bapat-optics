const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
} = require("../../../../../helper/common/utils/dbUtils");
const Base = require("../../../../../helper/exception_handling");
const IDS = require("../../../../../helper/fix_ids");
const {
  HTTPS,
} = require("../../../../../helper/https-status-codes/https-status-codes");
const {
  Product_Order,
  Product_Order_Detail,
  Store_Detail,
  Users,
  Payment_Type,
  Order_status,
  User_Address,
  Product,
  Restaurant_Service,
  Return_Order,
  Order_Add_On,
  Food_Add_On,
  p_category,
  p_sub_category,
  Order_History,
  Return_Reason,
  Return_Status,
  Order_Payment_Detail,
  sequelize,
  RefundOrders,
  Return_Order_Details,
  p_child_category,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
const moment = require("moment");
class ProductOrderController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const sortOrder = req.query.sortOrder || "DESC";
      const term = req.query.term || "";
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const per_page = req.query.per_page ? parseInt(req.query.per_page) : 10;

      const return_status_id = req.query?.return_status_id || null;
      const customer = req.query.customer || "";
      const where = { return_status_id: return_status_id };

      const productCategory = req.query.productCategory || "";

      const ProductDetails = {};

      if (productCategory) {
        ProductDetails.product_id = productCategory;
      }

      const whereClauseCustomer = {};

      if (customer) {
        whereClauseCustomer.name = { [Op.like]: `%${customer}%` };
      }
      const from = req.query.from || "";
      const to = req.query.to || "";
      if (from && to) {
        const fromDate = moment(from).startOf("day").toDate(); // 00:00:00
        const toDate = moment(to).endOf("day").toDate(); // 23:59:59
        where.createdAt = { [Op.between]: [fromDate, toDate] };
      } else if (from) {
        const fromDate = moment(from).startOf("day").toDate();
        where.createdAt = { [Op.gte]: fromDate };
      } else if (to) {
        const toDate = moment(to).endOf("day").toDate();
        where.createdAt = { [Op.lte]: toDate };
      }

      const include = [
        { model: Return_Reason },
        { model: Return_Status },
        { model: Users },
        {
          model: Return_Order_Details,
           paranoid:false,
          include: [
            {
              model: Product_Order_Detail,
              where: ProductDetails,
              include: [
                {
                  model: Product,
                  paranoid:false,
                  include: [
                    { model: p_category },
                   
                  ],
                },
              ],
            },
          ],
        },
        {
          model: Product_Order,
          include: [
            { model: Users, where: whereClauseCustomer },
            { model: Order_status },

            { model: User_Address , paranoid:false,},
            { model: Order_History },
            // { model: Users, as: "delivery_boy" },
          ],
        },
      ];

      const { count, rows: data } = await Return_Order.findAndCountAll({
        include: include,
        where: where,
        order: [["createdAt", sortOrder]],
        per_page: per_page,
        offset: (page - 1) * per_page,
        limit: per_page,
        distinct: true,
      });

      const total_pages = Math.ceil(count / per_page);

      // Send the response
      return Base.sendResponse(res, HTTPS.OK, {
        data: data,
        current_page: page,
        total_pages: total_pages,
        per_page: per_page,
        total: data?.length,
        search_name: term,
      });
    } catch (error) {
      console.error("Error fetching Orders:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async AcceptOrRejectOrder(req, res) {
    const t = await sequelize.transaction();
    try {
      const { type } = req.body;
      const { id } = req.params;

      if (type === "accept") {
        const update = await UpdateData(
          RefundOrders,
          {
            payment_status: 1,
          },
          { id: id },
          t
        );

        if (!update) {
          await t.rollback();
          return Base.sendError(
            res,
            HTTPS.NOT_ACCEPTABLE,
            "Refund Order Not Found"
          );
        }

        t.commit();

        return Base.sendResponse(
          res,
          HTTPS.ACCEPTED,
          "Refund Order accepeted successfully"
        );
      } else if (type === "reject") {
        const update = await UpdateData(
          RefundOrders,
          {
            payment_status: 0,
            message: req.body?.message,
          },
          { id: id },
          t
        );
        if (!update) {
          await t.rollback();
          return Base.sendError(
            res,
            HTTPS.NOT_ACCEPTABLE,
            "Refund Order Not Found"
          );
        }

        t.commit();

        return Base.sendResponse(
          res,
          HTTPS.ACCEPTED,
          "Refund Order rejected successfully"
        );
      }
    } catch (error) {
      await t.rollback();
      console.error("Error Accepting Order:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new ProductOrderController();
