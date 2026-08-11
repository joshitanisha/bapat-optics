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
const { HTTPS } = require("../../../../../helper/https-status-codes/https-status-codes");
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

  p_category,
  p_sub_category,
  Order_History,
  Return_Reason,
  Return_Status,
  Order_Payment_Detail,
  sequelize,
  RefundOrders,
  ReplaceOrderStatus,
  Replace_Order,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
const moment = require("moment");
class Replace_OrderController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const sortOrder = req.query.sortOrder || "DESC";
      const term = req.query.term || "";
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const per_page = req.query.per_page ? parseInt(req.query.per_page) : 10;

      const replace_order_status_id =
        req.query?.replace_order_status_id || null;

      const where = { replace_order_status_id: replace_order_status_id };

      const include = [
        { model: Users },
        {
          model: Product_Order,
          include: [
          
            { model: Users },
            { model: Order_status },
          
        
            { model: User_Address },
            { model: Order_History },
            { model: Users, as: "delivery_boy" },
            {
              model: Product_Order_Detail,
              include: [
                {
                  model: Product,
                  include: [{ model: p_category }, 
                    // { model: p_sub_category }
                  ],
                },
                
              ],
            },
          ],
        },
        { model: Users },
        { model: ReplaceOrderStatus },
      ];

      const { count, rows: data } = await Replace_Order.findAndCountAll({
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

  async AssignDeliveryBoy(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { delivery_boy_id } = req.body;

      console.log(delivery_boy_id);

      const exists = await CheckExits(Replace_Order, { order_id: id }, t);

      if (!exists) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Order Not Found");
      }

      const update = await UpdateData(
        Replace_Order,
        {
          delivery_boy_id: delivery_boy_id,
        },
        { id: exists?.id },
        t
      );

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Delivery boy asigned successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Order:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new Replace_OrderController();
