const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
} = require("../../../../../helper/common/utils/dbUtils");
const bcrypt = require("bcryptjs");
const Base = require("../../../../../helper/exception_handling");
const {
  HTTPS,
} = require("../../../../../helper/https-status-codes/https-status-codes");
const {
  Product_Order,
  Store_Detail,
  Order_status,
  User_Address,
  Payment_Method,

  Order_Payment_Detail,
  Order_Rejection,
  Reject_Reason,
  Order_History,
  Return_Order,
  Return_Reason,
  Users,
  Product_Order_Detail,
  p_category,
  Product,
  Restaurant_Service,
  p_sub_category,
  Order_Add_On,
  Food_Add_On,
  sequelize,
  Delivery_Boy_Detail,
  Vendors_Delivery_Boy,
  Return_Status,
  Replace_Order,
  RefundOrders,
  Time_Slot,
  Order_Otp,
  Payment_Collect,
  Payment_Collect_Details,
  ReplaceOrderStatus,
  Wallet_History,
  Notification,
  Product_Variant,
  Users_Address_Details,
  Area,
  Pincode,
  City,
  State,
  Country,
  Wallet,
  Return_Order_Details,
} = require("../../../../../models/index");
const { Op, where } = require("sequelize");
const IDS = require("../../../../../helper/fix_ids");
const { sendMail } = require("../../../../../helper/NodeMailer");
const moment = require("moment");
const {
  AdminNotifications,
} = require("../../../../../helper/mobile_notifications");
const { update_order } = require("../../../../../helper/order_notification");
const { transaction } = require("../../mobile/wallet/wallet.controller");
const request = require("request");

class OrderDetailController {
  //  async GetAllDeliveryBoysOrders(req, res) {
  //   try {
  //     const {
  //       term = "",
  //       page = 1,
  //       per_page = 10,
  //       store_id = "",
  //       from_date = "",
  //       to_date = "",
  //       order_status_id = "",
  //       invoice_no = "",
  //       return_status_id = "",
  //       replace_order_status_id = "",
  //     } = req.query;

  //     const userId = req.user?.user_id;

  //     const where = {};
  //     const where_search = {};
  //     const return_where = {};

  //     if (invoice_no) {
  //       where[Op.or] = [{ invoice_no: { [Op.like]: `%${invoice_no}%` } }];
  //       where_search[Op.or] = [
  //         { invoice_no: { [Op.like]: `%${invoice_no}%` } },
  //       ];
  //     }

  //     if (userId) {
  //       where.delivery_boy_id = userId;
  //       return_where.delivery_boy_id = userId;
  //     }

  //     let orderStatusList = [];
  //     if (order_status_id) {
  //       orderStatusList = Array.isArray(order_status_id)
  //         ? order_status_id
  //         : [order_status_id];

  //       if (orderStatusList.length) {
  //         where.order_status_id = {
  //           [Op.in]: orderStatusList.map(Number),
  //         };
  //       }
  //     }

  //     // Normalize return_status_id
  //     let returnStatusList = [];
  //     if (return_status_id) {
  //       returnStatusList = Array.isArray(return_status_id)
  //         ? return_status_id
  //         : [return_status_id];

  //       if (returnStatusList.length) {
  //         return_where.return_status_id = {
  //           [Op.in]: returnStatusList.map(Number),
  //         };
  //       }
  //     }

  //     const dateFilter = {};

  //     if (from_date && to_date) {
  //       dateFilter.deliveredAt = {
  //         [Op.gte]: moment.utc(from_date, "DD-MM-YYYY").startOf("day").toDate(),
  //         [Op.lte]: moment.utc(to_date, "DD-MM-YYYY").endOf("day").toDate(),
  //       };
  //     } else if (from_date) {
  //       dateFilter.deliveredAt = {
  //         [Op.gte]: moment.utc(from_date, "DD-MM-YYYY").startOf("day").toDate(),
  //       };
  //     } else if (to_date) {
  //       dateFilter.deliveredAt = {
  //         [Op.lte]: moment.utc(to_date, "DD-MM-YYYY").endOf("day").toDate(),
  //       };
  //     }

  //     const include = [
  //       { model: Users },
  //       { model: Users, as: "delivery_boy" },

  //       {
  //         model: Product_Order_Detail,
  //         include: [
  //           {
  //             model: Product,
  //             include: [{ model: p_category }, { model: p_sub_category }],
  //           },
  //         ],
  //       },

  //       { model: Order_status },
  //       { model: Order_History, where: dateFilter },
  //       { model: User_Address },
  //       {
  //         model: Order_Payment_Detail,
  //         include: [{ model: Payment_Method }],
  //       },
  //       {
  //         model: Order_Rejection,
  //         include: [{ model: Reject_Reason }],
  //       },
  //       {
  //         model: Return_Order,
  //         where:return_where,

  //         include: [
  //           {
  //             model: Return_Order_Details,
  //             include: [
  //               {
  //                 model: Product_Order_Detail,
  //                 include: [
  //                   {
  //                     model: Product,
  //                     include: [
  //                       { model: p_category },
  //                       { model: p_sub_category },
  //                     ],
  //                   },
  //                 ],
  //               },
  //             ],
  //           },
  //           { model: Return_Status },
  //         ],
  //         required: false,
  //       },
  //     ];

  //     const includeReturn = [
  //       ...include,
  //       {
  //         model: Return_Order,
  //         include: [{ model: Return_Status }],
  //         required: true,
  //         where: return_where,
  //       },
  //     ];

  //     const { count, rows: data } = await Product_Order.findAndCountAll({
  //       include,
  //       where,
  //       offset: (page - 1) * per_page,
  //       limit: per_page,
  //       distinct: true,
  //       order: [["createdAt", "DESC"]],
  //     });

  //     let return_data = [];
  //     let return_count = 0;
  //     if (
  //       returnStatusList &&
  //       Array.isArray(returnStatusList) &&
  //       returnStatusList?.length
  //     ) {
  //       const { count, rows } = await Product_Order.findAndCountAll({
  //         include: includeReturn,
  //         where: where_search,
  //         offset: (page - 1) * per_page,
  //         limit: per_page,
  //         distinct: true,
  //         order: [["createdAt", "DESC"]],
  //       });
  //       return_data = rows;
  //       return_count = count;
  //     }

  //     const total_pages = Math.ceil((count + return_count) / per_page);

  //     const result = [...data, ...return_data].sort(
  //       (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  //     );

  //     return Base.sendResponse(res, HTTPS.OK, {
  //       data: result,
  //       current_page: Number(page),
  //       total_pages,
  //       per_page,
  //       total: count + return_count,
  //       search_name: term,

  //     });
  //   } catch (error) {
  //     console.error("Error fetching orders for delivery boy:", error);
  //     return Base.sendError(
  //       res,
  //       HTTPS.INTERNAL_SERVER_ERROR,
  //       "An error occurred while fetching orders."
  //     );
  //   }
  // }

  async GetAllDeliveryBoysOrders(req, res) {
    try {
      const {
        term = "",
        page = 1,
        per_page = 10,
        store_id = "",
        from_date = "",
        to_date = "",
        order_status_id = "",
        invoice_no = "",
        return_status_id = "",
        replace_order_status_id = "",
      } = req.query;

      const userId = req.user?.user_id;
      console.log(req.user?.user_id, "req.user?.user_id req.user?.user_id");

      const where = {};
      const where_search = {};
      const return_where = {};

      if (invoice_no) {
        where[Op.or] = [{ invoice_no: { [Op.like]: `%${invoice_no}%` } }];
        where_search[Op.or] = [
          { invoice_no: { [Op.like]: `%${invoice_no}%` } },
        ];
      }

      if (userId) {
        where.delivery_boy_id = userId;
        return_where.delivery_boy_id = userId;
      }

      let orderStatusList = [];
      if (order_status_id) {
        orderStatusList = Array.isArray(order_status_id)
          ? order_status_id
          : [order_status_id];

        if (orderStatusList.length) {
          where.order_status_id = {
            [Op.in]: orderStatusList.map(Number),
          };
        }
      }

      let returnStatusList = [];
      if (return_status_id) {
        returnStatusList = Array.isArray(return_status_id)
          ? return_status_id
          : [return_status_id];

        if (returnStatusList.length) {
          return_where.return_status_id = {
            [Op.in]: returnStatusList.map(Number),
          };
        }
      }

      const dateFilter = {};
      if (from_date && to_date) {
        dateFilter.deliveredAt = {
          [Op.gte]: moment.utc(from_date, "DD-MM-YYYY").startOf("day").toDate(),
          [Op.lte]: moment.utc(to_date, "DD-MM-YYYY").endOf("day").toDate(),
        };
      } else if (from_date) {
        dateFilter.deliveredAt = {
          [Op.gte]: moment.utc(from_date, "DD-MM-YYYY").startOf("day").toDate(),
        };
      } else if (to_date) {
        dateFilter.deliveredAt = {
          [Op.lte]: moment.utc(to_date, "DD-MM-YYYY").endOf("day").toDate(),
        };
      }

      const include = [
        { model: Users },
        { model: Users, as: "delivery_boy" },
        {
          model: Product_Order_Detail,
          where:{status:true},
          include: [
            {
              model: Product,
              include: [{ model: p_category }, { model: p_sub_category }],
            },
          ],
        },
        { model: Order_status },
        { model: Order_History, where: dateFilter },
        { model: User_Address },
        {
          model: Order_Payment_Detail,
          include: [{ model: Payment_Method }],
        },
        {
          model: Order_Rejection,
          include: [{ model: Reject_Reason }],
        },
           
      ];

    
      const includeReturn = [
        { model: Users },
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
        { model: Order_status },
        { model: Order_History, where: dateFilter },
        { model: User_Address },
        {
          model: Order_Payment_Detail,
          include: [{ model: Payment_Method }],
        },
        
        {
          model: Return_Order,
          required: true,
          where: return_where,
          include: [
            { model: Users },
            {
              model: Return_Order_Details,
              required: true,
              include: [
                {
                  model: Product_Order_Detail,
                  include: [
                    {
                      model: Product,
                      include: [
                        { model: p_category },
                        { model: p_sub_category },
                      ],
                    },
                  ],
                },
              ],
            },
            { model: Return_Status },
          ],
        },
      ];

      const { count, rows: orderData } = await Product_Order.findAndCountAll({
        include,
        where,
        offset: (page - 1) * per_page,
        limit: per_page,
        distinct: true,
        order: [["createdAt", "DESC"]],
      });

      const { countreturn, rows: returnData } =
        await Product_Order.findAndCountAll({
          include: includeReturn,
          offset: (page - 1) * per_page,
          limit: per_page,
          // distinct: true,
          order: [["createdAt", "DESC"]],
        });

      console.log(returnData, "returnData returnData");

      const result = [...orderData, ...returnData];

      const final_result = [];

      for (const order of result) {
      
        let total_mrp = 0;
        let total_selling_price = 0;
        let total_tax = 0;
        let total_amount = 0;
        let total_coupon_discount = 0;
        let total_offer_discount = 0;
        let total_refer_discount = 0;
    

        if (Array.isArray(order?.Product_Order_Details)) {
          order.Product_Order_Details.forEach((item) => {
            const mrp = parseFloat(item.total_mrp || 0);
            const selling = parseFloat(item.total_selling_price || 0);
            const offer_discount = parseFloat(item.offer_discount || 0);
            const coupon_discount = parseFloat(item.coupon_discount || 0);
            const refer_discount = parseFloat(item.refer_discount || 0);
            const total = parseFloat(item.total_amount || 0);
            const tax = parseFloat(item.total_tax || 0);

            total_mrp += mrp;
            total_selling_price += selling;
            total_offer_discount += offer_discount;
            total_coupon_discount += coupon_discount;
            total_refer_discount += refer_discount;
            total_tax += tax;
            total_amount += total;
          });
        }
        const customOrder = JSON.parse(JSON.stringify(order));
        customOrder.total_mrp = total_mrp.toFixed(2);
        customOrder.total_selling_price = total_selling_price.toFixed(2);
        customOrder.total_tax = total_tax.toFixed(2);
        customOrder.total_amount = total_amount.toFixed(2);
        customOrder.total_coupon_discount = total_coupon_discount.toFixed(2);
        customOrder.total_offer_discount = total_offer_discount.toFixed(2);
        customOrder.total_refer_discount = total_refer_discount.toFixed(2);

        final_result.push(customOrder);
       
      }

   

      return Base.sendResponse(res, HTTPS.OK, {
        data: final_result,
        current_page: Number(page),
        total_pages: Math.ceil(result.length / per_page),
        per_page,
        total: result.length,
        search_name: term,
      });
    } catch (error) {
      console.error("Error fetching orders for delivery boy:", error);
      return Base.sendError(
        res,
        HTTPS.INTERNAL_SERVER_ERROR,
        "An error occurred while fetching orders."
      );
    }
  }

  async GetSingleOrder(req, res) {
  try {
    const include = [
      { model: Users },
      { model: Order_Otp },
      {
        model: Product_Order_Detail,
        where: { status: true },
        include: [
          {
            model: Product,
            include: [
              { model: p_category },
              // { model: p_sub_category },
            ],
          },
        ],
      },
      { model: Order_status },
      { model: Order_History },
      { model: Time_Slot },
      {
        model: User_Address,
        include: {
          model: Users_Address_Details,
          include: [
            { model: Country },
            { model: State },
            { model: City },
            { model: Pincode },
            { model: Area },
          ],
        },
      },
      {
        model: Order_Payment_Detail,
        include: [{ model: Payment_Method }],
      },
      {
        model: Order_Rejection,
        include: [{ model: Reject_Reason }],
      },
      {
        model: Return_Order,
        include: [
          {
            model: Return_Order_Details,
            include: [
              {
                model: Product_Order_Detail,
                include: [
                  {
                    model: Product,
                    include: [
                      { model: p_category },
                      { model: p_sub_category },
                    ],
                  },
                ],
              },
            ],
          },
          { model: Return_Status },
        ],
      },
    ];

    const result = await Product_Order.findOne({
      include,
      where: {
        id: req?.params?.id,
      },
      order: [["createdAt", "DESC"]],
    });

    if (!result) {
      return Base.sendResponse(
        res,
        HTTPS.NOT_FOUND,
        null,
        "No orders found for this delivery boy."
      );
    }

    // Clone Sequelize object safely
    const order = JSON.parse(JSON.stringify(result));

    // Totals calculation
    let total_mrp = 0;
    let total_selling_price = 0;
    let total_offer_discount = 0;
    let total_coupon_discount = 0;
    let total_refer_discount = 0;
    let total_tax = 0;
    let total_amount = 0;

    if (Array.isArray(order?.Product_Order_Details)) {
      order.Product_Order_Details.forEach((item) => {
        total_mrp += parseFloat(item.total_mrp || 0);
        total_selling_price += parseFloat(item.total_selling_price || 0);
        total_offer_discount += parseFloat(item.offer_discount || 0);
        total_coupon_discount += parseFloat(item.coupon_discount || 0);
        total_refer_discount += parseFloat(item.refer_discount || 0);
        total_tax += parseFloat(item.total_tax || 0);
        total_amount += parseFloat(item.total_amount || 0);
      });
    }

    // Attach calculated fields to the order object
    order.total_mrp = total_mrp.toFixed(2);
    order.total_selling_price = total_selling_price.toFixed(2);
    order.total_offer_discount = total_offer_discount.toFixed(2);
    order.total_coupon_discount = total_coupon_discount.toFixed(2);
    order.total_refer_discount = total_refer_discount.toFixed(2);
    order.total_tax = total_tax.toFixed(2);
    order.total_amount = total_amount.toFixed(2);

    return Base.sendResponse(res, HTTPS.OK, order);
  } catch (error) {
    console.error("Error fetching single order:", error);
    return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
  }
}


  async AcceptOrder(req, res) {
    const t = await sequelize.transaction();
    try {
      const order = await Product_Order.findOne({
        where: {
          id: req?.params?.id,
        },
        transaction: t,
      });

      if (!order) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, {}, "No orders found .");
      }

      await UpdateData(
        Product_Order,
        { order_status_id: IDS.order_status.PickupScheduled },
        { id: req?.params?.id },
        t
      );
      await UpdateData(
        Order_History,
        {
          delivery_boy_assigned: moment
            .utc()
            .add(5, "hours")
            .add(30, "minutes")
            .toDate(),
        },
        { order_id: req?.params?.id },
        t
      );

      const newCreated = await CreateNew(
        Notification,
        {
          order_id: req?.params?.id,
          user_id: order.user_id,
          message: "A delivery boy accept your order.",
        },
        t
      );

      const user = await CheckExits(Users, { id: order?.user_id }, t);
      await AdminNotifications(user?.device_key, newCreated);
      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, null, "Order Accepted");
    } catch (error) {
      await t.rollback();
      console.error("Error fetching orders for delivery boy:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async PickOrder(req, res) {
    const t = await sequelize.transaction();

    try {
      const order = await Product_Order.findOne({
        where: {
          id: req?.params?.id,
        },
        transaction: t,
      });

      if (!order) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, {}, "No orders found .");
      }

      await UpdateData(
        Product_Order,
        { order_status_id: IDS.order_status.Shipped },
        { id: req?.params?.id },
        t
      );
      await UpdateData(
        Order_History,
        {
          out_for_delivery: moment
            .utc()
            .add(5, "hours")
            .add(30, "minutes")
            .toDate(),
        },
        { order_id: req?.params?.id },
        t
      );

      const newCreated = await CreateNew(
        Notification,
        {
          order_id: req?.params?.id,
          user_id: order.user_id,
          message: "A delivery boy pickup your order.",
        },
        t
      );

      await update_order(Number(req?.params?.id), order.user_id);

      const user = await CheckExits(Users, { id: order?.user_id }, t);
      await AdminNotifications(user?.device_key, newCreated);
      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, null, "Order Picked");
    } catch (error) {
      await t.rollback();
      console.error("Error fetching orders for delivery boy:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async DeliverOrder(req, res) {
    const t = await sequelize.transaction();
    try {
      const order = await Product_Order.findOne({
        include: [{ model: Product_Order_Detail }],
        where: {
          id: req?.params?.id,
        },
        transaction: t,
      });

      if (!order) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, {}, "No orders found .");
      }

      const data = {
        payment_method_id: req?.body?.payment_method_id,
        amount: order?.total_amount,
        message: req?.body?.message,
      };

      if (req?.files && req?.files?.payment_proof) {
        data.payment_proof = await File_Uploade(
          req.files?.payment_proof,
          "/uploads/oders"
        );
      }

      if (req?.files && req?.files?.other_image) {
        data.other_image = await File_Uploade(
          req.files?.other_image,
          "/uploads/oders"
        );
      }

      await UpdateData(
        Order_Payment_Detail,
        data,
        { order_id: req?.params?.id },
        t
      );

      await UpdateData(
        Product_Order,
        { order_status_id: IDS.order_status.Delivered },
        { id: req?.params?.id },
        t
      );
      await UpdateData(
        Order_History,
        {
          deliveredAt: moment.utc().add(5, "hours").add(30, "minutes").toDate(),
        },
        { order_id: req?.params?.id },
        t
      );

      const products =
        typeof req.body.products === "string"
          ? JSON.parse(req.body.products)
          : req.body.products || [];

      const paymentCollect = await CreateNew(
        Payment_Collect,
        {
          order_id: order.id,
          total_amount: order.total_amount,
          delivery_boy_id: req.user.user_id,
          user_id: order?.user_id,
          total_kg: order.total_kg,
          payment_method_id: req?.body?.payment_method_id,
          total_kg: order.total_amount,
          no_of_item: order.no_of_item,
          collected_at: new Date(),
        },
        t
      );

      let totalReceived = 0;

      for (let item of order.Product_Order_Details) {
        const matched = products.find((p) => p.product_id === item.product_id);

        const receiveAmount =
          matched?.collection_status_id === 1 ? item.total_amount : 0;

        totalReceived += parseFloat(receiveAmount);

        const user = await Wallet.findOne({
          where: {
            user_id: order?.user_id,
          },
          transaction: t,
        });

        if (matched?.collection_status_id === 2) {
          await UpdateData(
            Wallet,
            {
              amount: parseFloat(user.amount) + parseFloat(item.total_amount),
            },
            { user_id: order?.user_id },
            t
          );

          const walletHistory = {
            wallet_id: user?.id,
            transaction_type: "credit",
            amount: parseFloat(item.total_amount),
            description: "Order cancelled",
          };
          await CreateNew(Wallet_History, walletHistory, t);
          const existingStock = await Product_Variant.findOne({
            where: { id: item.variant_id },
            transaction: t,
          });

          const newGeneralStock =
            Number(existingStock?.general_stock) + Number(item?.quantity);
          const product = await Product.findOne({
            where: { id: item.product_id },
            transaction: t,
          });

          const ProductStock = await UpdateData(
            Product_Variant,
            {
              general_stock: newGeneralStock,
            },
            { id: item.variant_id },
            t
          );
        }

        await CreateNew(
          Payment_Collect_Details,
          {
            order_details_id: item.id,
            payment_collect_id: paymentCollect.id,
            collection_status_id: matched?.collection_status_id || null,
            product_id: item.product_id,
            variant_id: item.variant_id,
            quantity: item.quantity,
            total_amount: item.total_amount,
            total_kg: item.total_kg,
            receive_payment: receiveAmount,
          },
          t
        );
      }

      await UpdateData(
        Payment_Collect,
        { receive_payment: totalReceived },
        { id: paymentCollect.id },
        t
      );

      const deliveryboy = await Wallet.findOne({
        where: {
          user_id: req.user.user_id,
        },
        transaction: t,
      });

      // if (
      //   req?.body?.payment_method_id === IDS?.PaymentMethods?.Cash ||
      //   req?.body?.payment_method_id === IDS?.PaymentMethods?.Card ||
      //   req?.body?.payment_method_id === IDS?.PaymentMethods?.QR
      // ) {
      await UpdateData(
        Wallet,
        {
          amount: parseFloat(deliveryboy.amount) + parseFloat(totalReceived),
        },
        { user_id: req.user.user_id },
        t
      );

      const walletHistory = {
        wallet_id: deliveryboy?.id,
        transaction_type: "credit",
        amount: parseFloat(totalReceived),
        description: "payment collect",
      };

      await CreateNew(Wallet_History, walletHistory, t);

      // }

      const newCreated = await CreateNew(
        Notification,
        {
          order_id: req?.params?.id,
          user_id: order.user_id,
          message: "Order delivered successfully.",
        },
        t
      );
      await update_order(Number(req?.params?.id), order.user_id);
      const user = await CheckExits(Users, { id: order?.user_id }, t);
      await AdminNotifications(user?.device_key, newCreated);

      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, data, "Order Deliverd");
    } catch (error) {
      console.error("Error fetching orders for delivery boy:", error);
      await t.rollback();
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async RejectOrder(req, res) {
    const t = await sequelize.transaction();
    try {
      const order = await Product_Order.findOne({
        where: {
          id: req?.params?.id,
        },
        transaction: t,
      });

      if (!order) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, {}, "No orders found .");
      }

      const data = {
        order_id: req?.params?.id,
        reject_reason_id: req?.body?.reject_reason_id,
        message: req?.body?.message,
      };

      const result = await CreateNew(Order_Rejection, data, t);

      await UpdateData(
        Product_Order,
        { order_status_id: IDS.order_status.Rejected },
        { id: req?.params?.id },
        t
      );
      // await UpdateData(Order_History, { deliveredAt: moment.utc().add(5, 'hours').add(30, 'minutes').toDate() }, { order_id: req?.params?.id }, t);
      const newCreated = await CreateNew(
        Notification,
        {
          order_id: req?.params?.id,
          user_id: order.user_id,
          message: "Your Order rejected",
        },
        t
      );
      const user = await CheckExits(Users, { id: order?.user_id }, t);

      if (
        Number(order.payment_method_id) === Number(IDS.PaymentMethods.Online) ||
        Number(order.payment_method_id === IDS.PaymentMethods.Card)
      ) {
        const walletamount = await Wallet.findOne({
          where: {
            user_id: order.user_id,
          },
          transaction: t,
        });

        await UpdateData(
          Wallet,
          {
            amount:
              parseFloat(walletamount?.amount) +
              parseFloat(order?.total_amount),
          },
          { user_id: order.user_id },
          t
        );

        const walletHistory = {
          wallet_id: walletamount?.id,
          transaction_type: "credit",
          amount: parseFloat(order?.total_amount),
          description: "Order cancelled",
        };
        await CreateNew(Wallet_History, walletHistory, t);
      }

      await update_order(Number(req?.params?.id), order.user_id);

      await AdminNotifications(user?.device_key, newCreated);
      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, result, "Order Rejected");
    } catch (error) {
      await t.rollback();
      console.error("Error fetching orders for delivery boy:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Dashboard

  // async GetAllDashboard(req, res) {
  //   try {
  //     const dayStart = moment(new Date()).startOf("day").toDate();
  //     const dayEnd = moment(new Date()).endOf("day").toDate();

  //     let newOrder = await Product_Order.count({
  //       where: {
  //         delivery_boy_id: req?.user?.user_id,
  //         order_status_id: {
  //           [Op.in]: [
  //             IDS.order_status.Processing,
  //             IDS.order_status.Shipped,
  //             IDS.order_status.PickupScheduled,
  //           ], // your desired statuses
  //         },
  //       },
  //     });

  //     const completedOrder = await Product_Order.count({
  //       where: {
  //         delivery_boy_id: req?.user?.user_id,
  //         order_status_id: IDS.order_status.Delivered,
  //       },
  //     });

  //     const rejectedOrder = await Product_Order.count({
  //       where: {
  //         delivery_boy_id: req?.user?.user_id,
  //         order_status_id: IDS.order_status.Rejected,
  //       },
  //     });

  //     let todays_Order = await Product_Order.count({
  //       include: [
  //         {
  //           model: Order_History,
  //           required: true,
  //           where: {
  //             delivery_boy_assigned: {
  //               [Op.gte]: dayStart,
  //               [Op.lte]: dayEnd,
  //             },
  //           },
  //         },
  //       ],
  //       where: {
  //         delivery_boy_id: req?.user?.user_id,
  //       },
  //     });

  // let total_today = await Order_Payment_Detail.sum("amount", {
  //   include: [
  //     {
  //       model: Product_Order,
  //       attributes: [],
  //       where: { order_status_id: IDS.order_status.Delivered },
  //       required: true,
  //     },
  //   ],
  //   where: {
  //     delivery_boy_id: req?.user?.user_id,
  //     updatedAt: {
  //       [Op.gte]: dayStart,
  //       [Op.lte]: dayEnd,
  //     },
  //   },
  // });

  //     const PaymentDoneOrder = await Product_Order.count({
  //       where: {
  //         delivery_boy_id: req?.user?.user_id,
  //         order_status_id: IDS.order_status.Delivered,
  //         deliveryboy_payment_status: true,
  //       },
  //     });

  //     const PaymentNotDoneOrder = await Product_Order.count({
  //       where: {
  //         delivery_boy_id: req?.user?.user_id,
  //         order_status_id: IDS.order_status.Delivered,
  //         deliveryboy_payment_status: false,
  //       },
  //     });

  //     const data = {
  //       newOrder: newOrder || 0,
  //       completedOrder: completedOrder || 0,
  //       rejectedOrder: rejectedOrder || 0,
  //       todays_Order: todays_Order || 0,
  //       pending_Order: PaymentNotDoneOrder || 0,
  //       receiving_Order: PaymentDoneOrder || 0,
  //       // shipping_Order: shipping_Order || 0,
  //       // returnOrder: returnOrder || 0,
  //       // replaceOrder: replace_count || 0,
  //       total_today: total_today || 0,
  //     };

  //     return Base.sendResponse(res, HTTPS.OK, data);
  //   } catch (error) {
  //     console.error("Error:", error);
  //     return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
  //   }
  // }

  async GetAllDashboard(req, res) {
    try {
      const dayStart = moment.utc().startOf("day").toDate();

      const dayEnd = moment.utc().endOf("day").toDate();

      let newOrder = await Product_Order.count({
        where: {
          delivery_boy_id: req?.user?.user_id,
          order_status_id: IDS.order_status.Processing,
        },
      });

      {
        const count = await Return_Order.count({
          where: {
            delivery_boy_id: req?.user?.user_id,
            return_status_id: IDS.return_status.ReturnRequested,
          },
        });
        newOrder += count;
      }

      let shipping_Order = await Product_Order.count({
        where: {
          delivery_boy_id: req?.user?.user_id,
          order_status_id: {
            [Op.in]: [
              IDS.order_status.PickupScheduled,
              IDS.order_status.Shipped,
            ],
          },
        },
      });

      {
        const count = await Return_Order.count({
          where: {
            delivery_boy_id: req?.user?.user_id,
            return_status_id: {
              [Op.in]: [
                IDS.return_status.PickupScheduled,
                // IDS.return_status.ItemPicked,
              ],
            },
          },
        });
        shipping_Order += count;
      }

      // Replace
      {
        const count = await Replace_Order.count({
          where: {
            delivery_boy_id: req?.user?.user_id,
            replace_order_status_id: {
              [Op.in]: [
                IDS.replace_order_status.StoreItmePickupScheduled,
                IDS.replace_order_status.StoreItemPicked,
                IDS.replace_order_status.CustomerItemReplaced,
              ],
            },
          },
        });
        shipping_Order += count;
      }

      let completedOrder = await Product_Order.count({
        where: {
          delivery_boy_id: req?.user?.user_id,
          order_status_id: IDS.order_status.Delivered,
        },
      });

      // {
      //   const count = await Return_Order.count({
      //     where: {
      //       delivery_boy_id: req?.user?.user_id,
      //       return_status_id: {
      //         [Op.in]: [
      //           IDS.return_status.Returned,
      //           // IDS.return_status.ItemPicked,
      //         ],
      //       },
      //     },
      //   });
      //   completedOrder += count;
      // }

      const rejectedOrder = await Product_Order.count({
        where: {
          delivery_boy_id: req?.user?.user_id,
          order_status_id: IDS.order_status.Rejected,
        },
      });

      const returnOrder = await Return_Order.count({
        where: {
          delivery_boy_id: req?.user?.user_id,
          return_status_id: IDS.return_status.Returned,
        },
      });

      // Replace

      const replace_count = await Replace_Order.count({
        where: {
          delivery_boy_id: req?.user?.user_id,
          replace_order_status_id:
            IDS.replace_order_status.StoreReplaceItemDelivered,
        },
      });

      let todays_Order = await Product_Order.count({
        include: [
          {
            model: Order_History,
            required: true,
            where: {
              deliveredAt: {
                [Op.gte]: dayStart,
                [Op.lte]: dayEnd,
              },
            },
          },
        ],
        where: {
          delivery_boy_id: req?.user?.user_id,
        },
      });

      {
        const count = await Return_Order.count({
          where: {
            delivery_boy_id: req?.user?.user_id,
            createdAt: {
              [Op.gte]: dayStart,
              [Op.lte]: dayEnd,
            },
          },
        });
        todays_Order += count;
      }

      let total_today = await Order_Payment_Detail.sum("amount", {
        include: [
          {
            model: Product_Order,
            attributes: [],
            where: { order_status_id: IDS.order_status.Delivered },
            required: true,
          },
        ],
        where: {
          delivery_boy_id: req?.user?.user_id,
          updatedAt: {
            [Op.gte]: dayStart,
            [Op.lte]: dayEnd,
          },
        },
      });

      {
        // const amount = await Order_Payment_Detail.sum("amount", {
        //   where: {
        //     delivery_boy_id: req?.user?.user_id,
        //     createdAt: {
        //       [Op.gte]: dayStart,
        //       [Op.lte]: dayEnd,
        //     },
        //   },
        // });
        // total_today -= amount;
      }

      const data = {
        newOrder: newOrder || 0,
        completedOrder: completedOrder || 0,
        rejectedOrder: rejectedOrder || 0,
        todays_Order: todays_Order || 0,
        shipping_Order: shipping_Order || 0,
        returnOrder: returnOrder || 0,
        replaceOrder: replace_count || 0,
        total_today: total_today || 0,
      };

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
  //

  //Total Amounts
  async GetTotalAmounts(req, res) {
    try {
      // const store_id = Number(req?.query?.store_id) || 0;
      const from_date = req?.query?.from_date || "";
      const to_date = req?.query?.to_date || "";
      const page = Number(req?.query?.page) || 1;
      const per_page = Number(req?.query?.per_page) || 10;

      const where = { delivery_boy_id: req?.user?.user_id };

      const wheredate = { order_status_id: IDS.order_status.Delivered };
      if (from_date && to_date) {
        const dayStart = moment(from_date, "DD-MM-YYYY")
          .startOf("day")
          .toDate();
        const dayEnd = moment(to_date, "DD-MM-YYYY").endOf("day").toDate();
        where.updatedAt = {
          [Op.gte]: dayStart,
          [Op.lte]: dayEnd,
        };
      } else if (from_date) {
        const dayStart = moment(from_date, "DD-MM-YYYY")
          .startOf("day")
          .toDate();
        where.updatedAt = {
          [Op.gte]: dayStart,
        };
      } else if (to_date) {
        const dayEnd = moment(to_date, "DD-MM-YYYY").endOf("day").toDate();
        where.updatedAt = {
          [Op.lte]: dayEnd,
        };
      }

      let card_amount = await Order_Payment_Detail.sum("amount", {
        include: [
          {
            model: Product_Order,

            attributes: [],
            where: wheredate,

            // where: { order_status_id: IDS.order_status.Delivered },
          },
        ],

        where: {
          Payment_Method_id: IDS.PaymentMethods.Card,
          ...where,
        },
      });

      {
        const amount = await Return_Order.sum("amount", {
          where: {
            Payment_Method_id: IDS.PaymentMethods.Card,
            ...where,
          },
        });
        card_amount -= amount;
      }

      let cash_amount = await Order_Payment_Detail.sum("amount", {
        include: [
          {
            model: Product_Order,
            attributes: [],
            where: wheredate,

            // where: { order_status_id: IDS.order_status.Delivered },
          },
        ],

        where: {
          Payment_Method_id: IDS.PaymentMethods.Cash,
          ...where,
        },
      });

      {
        const amount = await Return_Order.sum("amount", {
          where: {
            Payment_Method_id: IDS.PaymentMethods.Cash,
            ...where,
          },
        });
        cash_amount -= amount;
      }

      let qr_amount = await Order_Payment_Detail.sum("amount", {
        include: [
          {
            model: Product_Order,
            attributes: [],
            where: wheredate,

            // where: { order_status_id: IDS.order_status.Delivered },
          },
        ],

        where: {
          Payment_Method_id: IDS.PaymentMethods.QR,
          ...where,
        },
      });
      let wallet = await Order_Payment_Detail.sum("amount", {
        include: [
          {
            model: Product_Order,
            attributes: [],
            where: wheredate,

            // where: { order_status_id: IDS.order_status.Delivered },
          },
        ],

        where: {
          Payment_Method_id: IDS.PaymentMethods.Wallet,
          ...where,
        },
      });
      let online = await Order_Payment_Detail.sum("amount", {
        include: [
          {
            model: Product_Order,
            attributes: [],
            where: wheredate,

            // where: { order_status_id: IDS.order_status.Delivered },
          },
        ],

        where: {
          Payment_Method_id: IDS.PaymentMethods.Online,
          ...where,
        },
      });

      {
        const amount = await Return_Order.sum("amount", {
          where: {
            Payment_Method_id: IDS.PaymentMethods.QR,
            ...where,
          },
        });

        qr_amount -= amount;
      }

      const { count, rows: orders } =
        await Order_Payment_Detail.findAndCountAll({
          include: [
            {
              model: Product_Order,
              where: wheredate,
              include: [{ model: Users }],
            },
            {
              model: Payment_Method,
              required: true,
            },
          ],
          where: {
            ...where,
          },
          offset: (page - 1) * per_page,
          limit: per_page,
          order: [["createdAt", "DESC"]],
        });

      let return_data = [];
      let return_count = 0;
      {
        const { count, rows } = await Return_Order.findAndCountAll({
          include: [
            {
              model: Product_Order,

              include: [{ model: Users }],
            },
            {
              model: Payment_Method,
              required: true,
            },
          ],
          where: {
            return_status_id: IDS.return_status.Returned,
            ...where,
          },
          offset: (page - 1) * per_page,
          limit: per_page,
          order: [["createdAt", "DESC"]],
        });
        return_data = rows;
        return_count = count;
      }
      const total_pages = Math.ceil((count + return_count) / per_page);

      const total = card_amount + cash_amount + qr_amount + online + wallet;

      // const result = [...orders, ...return_data];
      const result = [...orders, ...return_data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      const data = {
        Card: card_amount || 0,
        Cash: cash_amount || 0,
        QR: qr_amount || 0,
        Online: online || 0,
        Wallet: wallet || 0,
        total: Number(total.toFixed(2)),
        page,
        per_page,
        count: count + return_count,
        total_pages,
        orders: result,
      };

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error fetching orders for delivery boy:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // async GetTotalAmounts(req, res) {
  //   try {
  // // const store_id = Number(req?.query?.store_id) || 0;
  // const from_date = req?.query?.from_date || "";
  // const to_date = req?.query?.to_date || "";
  // const page = Number(req?.query?.page) || 1;
  // const per_page = Number(req?.query?.per_page) || 10;

  // const where = { delivery_boy_id: req?.user?.user_id };

  // const wheredate = { order_status_id: IDS.order_status.Delivered };
  // if (from_date && to_date) {
  //   const dayStart = moment(from_date, "DD-MM-YYYY")
  //     .startOf("day")
  //     .toDate();
  //   const dayEnd = moment(to_date, "DD-MM-YYYY").endOf("day").toDate();
  //   wheredate.updatedAt = {
  //     [Op.gte]: dayStart,
  //     [Op.lte]: dayEnd,
  //   };
  // } else if (from_date) {
  //   const dayStart = moment(from_date, "DD-MM-YYYY")
  //     .startOf("day")
  //     .toDate();
  //   wheredate.updatedAt = {
  //     [Op.gte]: dayStart,
  //   };
  // } else if (to_date) {
  //   const dayEnd = moment(to_date, "DD-MM-YYYY").endOf("day").toDate();
  //   wheredate.updatedAt = {
  //     [Op.lte]: dayEnd,
  //   };
  // }

  //     console.log(wheredate, "wheredate wheredate");

  //     let card_amount = await Order_Payment_Detail.sum("amount", {
  //       include: [
  //         {
  //           model: Product_Order,
  //           attributes: [],
  //           where: wheredate,

  //           // where: { order_status_id: IDS.order_status.Delivered },
  //         },
  //       ],
  //       where: {
  //         payment_method_id: IDS.PaymentMethods.Card,
  //         ...where,
  //       },
  //     });

  //     let cash_amount = await Order_Payment_Detail.sum("amount", {
  //       include: [
  //         {
  //           model: Product_Order,
  //           attributes: [],
  //           where: wheredate,

  //           // where: { order_status_id: IDS.order_status.Delivered },
  //         },
  //       ],
  //       where: {
  //         payment_method_id: IDS.PaymentMethods.Cash,
  //         ...where,
  //       },
  //     });

  //     let qr_amount = await Order_Payment_Detail.sum("amount", {
  //       include: [
  //         {
  //           model: Product_Order,
  //           attributes: [],
  //           where: wheredate,

  //           // where: { order_status_id: IDS.order_status.Delivered },
  //         },
  //       ],
  //       where: {
  //         payment_method_id: IDS.PaymentMethods.QR,
  //         ...where,
  //       },
  //     });

  // let wallet = await Order_Payment_Detail.sum("amount", {
  //   include: [
  //     {
  //       model: Product_Order,
  //       attributes: [],
  //       where: wheredate,

  //       // where: { order_status_id: IDS.order_status.Delivered },
  //     },
  //   ],
  //   where: {
  //     payment_method_id: IDS.PaymentMethods.Wallet,
  //     ...where,
  //   },
  // });

  // let online = await Order_Payment_Detail.sum("amount", {
  //   include: [
  //     {
  //       model: Product_Order,
  //       attributes: [],
  //       where: wheredate,

  //       // where: { order_status_id: IDS.order_status.Delivered },
  //     },
  //   ],
  //   where: {
  //     payment_method_id: IDS.PaymentMethods.Online,
  //     ...where,
  //   },
  // });

  //     const { count, rows: orders } =
  //       await Order_Payment_Detail.findAndCountAll({
  //         include: [
  //           {
  //             model: Product_Order,
  //             required: true,
  //             where: wheredate,

  //             // where: { order_status_id: IDS.order_status.Delivered },

  //             include: [{ model: Users }, { model: Order_status }],
  //           },
  //           {
  //             model: Payment_Method,
  //             required: true,
  //           },
  //         ],
  //         where: {
  //           ...where,
  //         },
  //         distinct: true,
  //         offset: (page - 1) * per_page,
  //         limit: per_page,
  //         order: [["createdAt", "DESC"]],
  //       });
  //     // let return_data = [];
  //     let return_count = 0;

  //     const total_pages = Math.ceil(count / per_page);

  //     const total = card_amount + cash_amount + qr_amount + wallet + online;

  //     const result = [...orders].sort(
  //       (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  //     );

  // const data = {
  //   Card: card_amount || 0,
  //   Wallet: wallet || 0,
  //   Cash: cash_amount || 0,
  //   QR: qr_amount || 0,
  //   Online: online || 0,
  //   total: Number(total.toFixed(2)),
  //   page,
  //   per_page,
  //   count: count,
  //   total_pages,
  //   orders: result,
  // };

  //     return Base.sendResponse(res, HTTPS.OK, data);
  //   } catch (error) {
  //     console.error("Error fetching orders for delivery boy:", error);
  //     return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
  //   }
  // }

  // Shop By Total
  async GetAllTotal(req, res) {
    try {
      const user_id = req?.user?.user_id || "";
      const from_date = req?.query?.from_date;
      const to_date = req?.query?.to_date;

      const FindAllStores = await Users.findAll({
        where: {
          id: user_id,
        },
      });

      const where = {};

      if (from_date && to_date) {
        // createdAt
        // deliveredAt
        const dayStart = moment(from_date, "DD-MM-YYYY")
          .startOf("day")
          .toDate();
        const dayEnd = moment(to_date, "DD-MM-YYYY").endOf("day").toDate();
        where.deliveredAt = {
          [Op.gte]: dayStart,
          [Op.lte]: dayEnd,
        };
      } else if (from_date) {
        const dayStart = moment(from_date, "DD-MM-YYYY")
          .startOf("day")
          .toDate();
        where.deliveredAt = {
          [Op.gte]: dayStart,
        };
      } else if (to_date) {
        const dayEnd = moment(to_date, "DD-MM-YYYY").endOf("day").toDate();
        where.deliveredAt = {
          [Op.lte]: dayEnd,
        };
      }

      const temp = [];
      for (const store of FindAllStores) {
        val.cash =
          (await Order_Payment_Detail.sum("amount", {
            include: [
              {
                model: Product_Order,

                include: [
                  {
                    model: Order_History,
                    where: where,
                  },
                ],
              },
            ],
            where: {
              Payment_Method_id: IDS.PaymentMethods.Cash,
              delivery_boy_id: user_id,
              // ...where,
            },
          })) || 0;

        val.card =
          (await Order_Payment_Detail.sum("amount", {
            include: [
              {
                model: Product_Order,

                include: [
                  {
                    model: Order_History,
                    where: where,
                  },
                ],
              },
            ],
            where: {
              Payment_Method_id: IDS.PaymentMethods.Card,
              delivery_boy_id: user_id,
              // ...where,
            },
          })) || 0;

        val.qr =
          (await Order_Payment_Detail.sum("amount", {
            include: [
              {
                model: Product_Order,

                include: [
                  {
                    model: Order_History,
                    where: where,
                  },
                ],
              },
            ],
            where: {
              Payment_Method_id: IDS.PaymentMethods.QR,
              delivery_boy_id: user_id,
              // ...where,
            },
          })) || 0;

        val.total = val.card + val.cash + val.qr;

        temp.push(val);
      }

      // Return the response in the desired format
      return res.status(200).json({
        success: true,
        data: temp, // Now `result` is an array with totals for each store, grouped by payment method
      });
    } catch (error) {
      console.error("Error fetching payment reports:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  //

  async SingleReturnOrder(req, res) {
    try {
      const include = [
        {
          model: Return_Order_Details,
          include: [
            {
              model: Product_Order_Detail,
              include: [
                {
                  model: Product,
                },
                {
                  model: Product_Variant,
                },
              ],
            },
          ],
        },
        {
          model: Product_Order,
          include: [
            {
              model: Users,
            },

            {
              model: User_Address,
            },
            {
              model: Users,
              as: "delivery_boy",
            },

            {
              model: Order_History,
            },
            {
              model: Time_Slot,
            },
            {
              model: Order_status,
            },
            {
              model: Payment_Method,
            },

            {
              model: Order_Otp,
            },
          ],
        },
        // {
        //     model: Return_Order_Status,
        //   },
      ];
      const result = await Return_Order.findOne({
        include: include,
        where: {
          id: req?.params?.id,
        },
        order: [["createdAt", "DESC"]],
      });

      if (!result || result.length === 0) {
        return Base.sendResponse(
          res,
          HTTPS.NOT_FOUND,
          result,
          "No orders found for this delivery boy."
        );
      }

      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      console.error("Error fetching orders for delivery boy:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async GetAllDeliveryBoysReturnOrders(req, res) {
    const t = await sequelize.transaction();
    try {
      const return_status_id = req.query.return_status_id || "";

      let whereClause = { delivery_boy_id: req?.user?.user_id };
      if (return_status_id) {
        whereClause.return_status_id = return_status_id;
      }

      const options = {
        include: [
          {
            model: Return_Order_Details,
            include: [
              {
                model: Product_Order_Detail,
                include: [
                  {
                    model: Product,
                  },
                  {
                    model: Product_Variant,
                  },
                ],
              },
            ],
          },
          {
            model: Product_Order,
            include: [
              {
                model: Users,
              },

              {
                model: User_Address,
              },
              {
                model: Users,
                as: "delivery_boy",
              },

              {
                model: Order_History,
              },
              {
                model: Time_Slot,
              },
              {
                model: Order_status,
              },
              {
                model: Payment_Method,
              },

              {
                model: Order_Otp,
              },
            ],
          },
        ],

        where: whereClause,
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Return_Order, options, req, res, Op);
    } catch (error) {
      await t.rollback();
      console.error(
        "Error fetching orders for delivery boy return:",
        error.message
      );
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  //  Return Order Flow
  async AcceptReturnOrder(req, res) {
    const t = await sequelize.transaction();
    try {
      const order = await Product_Order.findOne({
        where: {
          id: req?.params?.id,
        },
        transaction: t,
      });

      if (!order) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, {}, "No orders found.");
      }

      await UpdateData(
        Return_Order,
        { return_status_id: IDS.return_status.PickupScheduled },
        { order_id: order?.id },
        t
      );

      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, {}, "Order Accepted");
    } catch (error) {
      await t.rollback();
      console.error("Error fetching orders for delivery boy:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async PickReturnOrder(req, res) {
    const t = await sequelize.transaction();
    try {
      const order = await Product_Order.findOne({
        where: {
          id: req?.params?.id,
        },
        transaction: t,
      });

      if (!order) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, {}, "No orders found .");
      }

      await UpdateData(
        Return_Order,
        { return_status_id: IDS.return_status.ItemPicked },
        { order_id: order?.id },
        t
      );

      const find = await Return_Order.findOne({
        where: {
          order_id: order?.id,
        },
        transaction: t,
      });

      const data = {
        order_id: order?.id,
        user_id: order?.user_id,
        return_order_id: find?.id,
        refund_amount: order?.total_amount,
        c_remark: req.body?.c_remark,
      };

      if (req?.files && req.files?.c_scanner) {
        data.c_scanner = await File_Uploade(
          req.files?.c_scanner,
          "/uploads/c_scanner"
        );
      }

      const check = await RefundOrders.findOne({
        where: {
          return_order_id: find?.id,
        },
        transaction: t,
      });

      if (check) {
        await UpdateData(RefundOrders, data, { id: check?.id }, t);
      } else {
        await CreateNew(RefundOrders, data, t);
      }

      await UpdateData(
        Order_History,
        {
          itemPickedAt: moment
            .utc()
            .add(5, "hours")
            .add(30, "minutes")
            .toDate(),
        },
        { order_id: req?.params?.id },
        t
      );

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, {}, "Order Picked");
    } catch (error) {
      console.error("Error :", error);
      await t.rollback();
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async DeliverBoyPayment(req, res) {
    const t = await sequelize.transaction();
    try {
      const {
        term = "",
        page = 1,
        per_page = 10,

        from_date = "",
        to_date = "",
        order_status_id = "",
        invoice_no = "",
        return_status_id = "",
      } = req.query;

      const payment_status = req.query.payment_status || true;
      // const order = await Product_Order.findOne({
      //   where: {
      // delivery_boy_id: req?.user?.user_id,
      // order_status_id: IDS.order_status.Delivered,
      // deliveryboy_payment_status:payment_status
      //   },
      //   transaction: t,
      // });

      const dateFilter = {};

      if (from_date && to_date) {
        dateFilter.deliveredAt = {
          [Op.gte]: moment(from_date, "DD-MM-YYYY").startOf("day").toDate(),
          [Op.lte]: moment(to_date, "DD-MM-YYYY").endOf("day").toDate(),
        };
      } else if (from_date) {
        dateFilter.deliveredAt = {
          [Op.gte]: moment(from_date, "DD-MM-YYYY").startOf("day").toDate(),
        };
      } else if (to_date) {
        dateFilter.deliveredAt = {
          [Op.lte]: moment(to_date, "DD-MM-YYYY").endOf("day").toDate(),
        };
      }

      const whereClause = {
        delivery_boy_id: req?.user?.user_id,
        order_status_id: IDS.order_status.Delivered,
        deliveryboy_payment_status: payment_status,
      };

      const include = [
        { model: Users },
        { model: Users, as: "delivery_boy" },

        {
          model: Product_Order_Detail,
          distinct: true,
          include: [
            {
              model: Product,
              include: [{ model: p_category }, { model: p_sub_category }],
            },
          ],
        },

        { model: Order_status },
        { model: Time_Slot },
        { model: Order_History, where: dateFilter },
        { model: User_Address },
        {
          model: Order_Payment_Detail,
          include: [{ model: Payment_Method }],
        },
      ];

      const { count, rows: data } = await Product_Order.findAndCountAll({
        include,

        where: whereClause,
        transaction: t,
        distinct: true,
        offset: (page - 1) * per_page,
        limit: per_page,
        distinct: true,
        order: [["createdAt", "DESC"]],
      });

      const total_pages = Math.ceil(count / per_page);
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, {
        data: data,
        current_page: Number(page),
        total_pages,
        per_page,
        total: count,
      });
    } catch (error) {
      console.error("Error fetching orders for delivery boy:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async DeliverReturnOrder(req, res) {
    const t = await sequelize.transaction();
    try {
      const order = await Product_Order.findOne({
        where: {
          id: req?.params?.id,
        },
        transaction: t,
      });

      if (!order) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, {}, "No orders found .");
      }

      const data = {
        // order_id: req?.params?.id,
        // delivery_boy_id: req?.user?.user_id,
        // Payment_Method_id: req?.body?.Payment_Method_id,
        // message: req?.body?.message,
        amount: order.total_amount,
        return_status_id: IDS.return_status.Returned,
      };

      if (req?.files && req?.files?.payment_proof) {
        data.payment_proof = await File_Uploade(
          req.files?.payment_proof,
          "/uploads/oders"
        );
      }

      if (req?.files && req?.files?.other_image) {
        data.other_image = await File_Uploade(
          req.files?.other_image,
          "/uploads/oders"
        );
      }

      const result = await UpdateData(
        Return_Order,
        data,
        { order_id: req?.params?.id },
        t
      );

      // await UpdateData(
      //   Product_Order,
      //   { status: false },
      //   { id: req?.params?.id },
      //   t
      // );

      await UpdateData(
        Order_History,
        {
          returnedAt: moment.utc().add(5, "hours").add(30, "minutes").toDate(),
        },
        { order_id: req?.params?.id },
        t
      );

      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, data, "Order Return Deliverd");
    } catch (error) {
      console.error("Error fetching orders for delivery boy:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async RejectedReturnOrder(req, res) {
    const t = await sequelize.transaction();
    try {
      const order = await Product_Order.findOne({
        where: {
          id: req?.params?.id,
        },
        transaction: t,
      });

      if (!order) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, {}, "No orders found .");
      }

      const data = {
        // order_id: req?.params?.id,
        // delivery_boy_id: req?.user?.user_id,
        // Payment_Method_id: req?.body?.Payment_Method_id,
        message: req?.body?.message,
        return_status_id: IDS.return_status.ReturnRejected,
        // amount: order.total_amount,
      };

      if (req?.files && req?.files?.payment_proof) {
        data.payment_proof = await File_Uploade(
          req.files?.payment_proof,
          "/uploads/oders"
        );
      }

      if (req?.files && req?.files?.other_image) {
        data.other_image = await File_Uploade(
          req.files?.other_image,
          "/uploads/oders"
        );
      }

      const result = await UpdateData(
        Return_Order,
        data,
        { order_id: req?.params?.id },
        t
      );

      await UpdateData(
        Order_History,
        {
          returnedAt: moment.utc().add(5, "hours").add(30, "minutes").toDate(),
        },
        { order_id: req?.params?.id },
        t
      );

      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, data, "Order Rejected");
    } catch (error) {
      console.error("Error fetching orders for delivery boy:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  //  Replace Order Flow
  async AcceptReplaceOrder(req, res) {
    const t = await sequelize.transaction();
    try {
      const order = await Product_Order.findOne({
        where: {
          id: req?.params?.id,
        },
        transaction: t,
      });

      if (!order) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, {}, "No orders found.");
      }

      await UpdateData(
        Replace_Order,
        {
          replace_order_status_id:
            IDS.replace_order_status.StoreItmePickupScheduled,
        },
        { order_id: req?.params?.id },
        t
      );

      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, {}, "Order Accepted");
    } catch (error) {
      await t.rollback();
      console.error("Error fetching orders for delivery boy:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async StoreItmePickupScheduledReplaceOrder(req, res) {
    const t = await sequelize.transaction();
    try {
      const order = await Product_Order.findOne({
        where: {
          id: req?.params?.id,
        },
        transaction: t,
      });

      if (!order) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, {}, "No orders found.");
      }

      await UpdateData(
        Replace_Order,
        {
          replace_order_status_id: IDS.replace_order_status.StoreItemPicked,
        },
        { order_id: req?.params?.id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        {},
        "Order Store Itme Pickup Scheduled Replace Order "
      );
    } catch (error) {
      await t.rollback();
      console.error("Error fetching orders for delivery boy:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async StoreItemPickedOrder(req, res) {
    const t = await sequelize.transaction();
    try {
      const order = await Product_Order.findOne({
        where: {
          id: req?.params?.id,
        },
        transaction: t,
      });

      if (!order) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, {}, "No orders found.");
      }

      await UpdateData(
        Replace_Order,
        {
          replace_order_status_id:
            IDS.replace_order_status.CustomerItemReplaced,
        },
        { order_id: req?.params?.id },
        t
      );

      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, {}, "Order Store Item Picked");
    } catch (error) {
      await t.rollback();
      console.error("Error fetching orders for delivery boy:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async CustomerItemReplacedOrder(req, res) {
    const t = await sequelize.transaction();
    try {
      const order = await Product_Order.findOne({
        where: {
          id: req?.params?.id,
        },
        transaction: t,
      });

      if (!order) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, {}, "No orders found.");
      }

      await UpdateData(
        Replace_Order,
        {
          replace_order_status_id:
            IDS.replace_order_status.StoreReplaceItemDelivered,
        },
        { order_id: order?.id },
        t
      );

      await UpdateData(
        Product_Order,
        {
          order_status_id: IDS.order_status.Replaced,
        },
        { id: order?.id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        {},
        "Order Customer Item Replaced Order"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error fetching orders for delivery boy:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async ReplaceItemRejectedReplaceOrder(req, res) {
    const t = await sequelize.transaction();
    try {
      const order = await Product_Order.findOne({
        where: {
          id: req?.params?.id,
        },
        transaction: t,
      });

      if (!order) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, {}, "No orders found.");
      }

      await UpdateData(
        Replace_Order,
        {
          replace_order_status_id: IDS.replace_order_status.ReplaceItemRejected,
        },
        { order_id: req?.params?.id },
        t
      );

      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, {}, "Order ReplaceItemRejected");
    } catch (error) {
      await t.rollback();
      console.error("Error fetching orders for delivery boy:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new OrderDetailController();
