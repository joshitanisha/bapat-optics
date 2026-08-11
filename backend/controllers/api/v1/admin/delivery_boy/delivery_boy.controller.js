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
const { sendMail } = require("../../../../../helper/NodeMailer");
const {
  Users,
  Delivery_Boy_Detail,
  Country,
  State,
  City,
  Pincode,
  Approval_Status,
  Gender,
  Product_Order,
  Payment_Method,
  Order_status,
  User_Address,
  Payment_Type,
  Store_Detail,
  Payment_Collect_Details,
  Payment_Collect,
  Collect_Status,
  Product,
  Order_Payment_Detail,
  Wallet,
  sequelize,
  Kyc_Document,
  Bank_Detail,
  Deliveryboy_Rating,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
const moment = require("moment");
const collect_status = require("../../../../../models/collect_status");
class DeliveryBoyController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const country_id = req.query.country_id || "";
      const state_id = req.query.state_id || "";
      const city_id = req.query.city_id || "";
      const pincode_id = req.query.pincode_id || "";
      const approval_status_id = req.query.approval_status_id || "";
      const whereClause = {
        [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
        role_id: IDS.RoleId.DeliveryBoy,
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
      let whereClauseDeliveryBoy = {};
      if (approval_status_id) {
        whereClauseDeliveryBoy.approval_status_id = approval_status_id;
      }

      const options = {
        include: [
          { model: Delivery_Boy_Detail, where: whereClauseDeliveryBoy },
          {
            model: Payment_Collect,
            required: false,
            where: { payment_receive_status: false },
            include: [{ model: Payment_Collect_Details }],
          },
        ],
        where: whereClause,
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Users, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Users:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async findAllDeliveryBoyRating(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const country_id = req.query.country_id || "";
      const state_id = req.query.state_id || "";
      const city_id = req.query.city_id || "";
      const pincode_id = req.query.pincode_id || "";
      const approval_status_id = req.query.approval_status_id || "";

      const searchRating = req.query.searchRating || "";

      const whereClause = {
        ...(searchRating ? { ratings: searchRating } : {}),
        // [Op.or]: [{ tital: { [Op.like]: `%${name}%` } }],
        // role_id: IDS.RoleId.DeliveryBoy,
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
      let whereClauseDeliveryBoy = {};
      if (approval_status_id) {
        whereClauseDeliveryBoy.approval_status_id = approval_status_id;
      }

      const options = {
        include: [
          { model: Users, as: "customer" },
          {
            model: Users,
            as: "delivery_boy",
          },
        ],
        where: whereClause,
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Deliveryboy_Rating, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Users:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

   async deleteDeliveryboyRating(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Deliveryboy_Rating, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Rating & Reviews not found");
      }

      await Deliveryboy_Rating.destroy({ where: { id }, transaction: t, });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "Rating & Reviews Deleted Successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Rating & Reviews:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const include = [
        {
          model: Delivery_Boy_Detail,
          include: [
            {
              model: Country,
            },
            {
              model: State,
            },
            {
              model: City,
            },
            {
              model: Pincode,
            },
            {
              model: Approval_Status,
            },
          ],
        },
        {
          model: Gender,
        },
        {
          model: Product_Order,
          as: "delivery_boy_orders",
          include: [
            // {
            //   model: Store_Detail,
            // },
            {
              model: Order_status,
            },
            {
              model: User_Address,
            },
            // {
            //   model: Payment_Type,
            // },
            {
              model: Payment_Method,
            },
          ],
        },

        {
          model: Kyc_Document,
        },

        {
          model: Bank_Detail,
        },
      ];
      const result = await CheckExits(Users, { id: req.params.id }, t, include);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found");
      }

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching User:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async GetAllDeliveryBoysOrders(req, res) {
    const t = await sequelize.transaction();
    try {
      const order_status_id = req?.query?.order_status_id || "";

      // // Prepare for date filter if the `date` is provided
      // let dateFilter = {};
      // if (date) {
      //   const dayStart = moment(date).startOf("day").toDate(); // Start of the day
      //   const dayEnd = moment(date).endOf("day").toDate(); // End of the day
      //   dateFilter = {
      //     createdAt: {
      //       [Op.gte]: dayStart,
      //       [Op.lte]: dayEnd,
      //     },
      //   };
      // }

      let whereClause = { delivery_boy_id: req?.params?.id };

      if (order_status_id) {
        whereClause.order_status_id = order_status_id;
        whereClause.deliveryboy_payment_status = false;
      }

      const whereClauseDate = {};

      const fromDate = req.query.from ? new Date(req.query.from.trim()) : null;
      const toDate = req.query.to ? new Date(req.query.to.trim()) : null;
      let startCheckDate;

      if (toDate) {
        startCheckDate = new Date(toDate);
        startCheckDate.setDate(startCheckDate.getDate() + 1);
        startCheckDate.setHours(0, 0, 0, 0);
      }

      if (fromDate && toDate) {
        whereClauseDate.updatedAt = {
          [Op.between]: [fromDate.toISOString(), startCheckDate.toISOString()],
        };
      } else if (fromDate) {
        whereClauseDate.updatedAt = {
          [Op.gte]: fromDate.toISOString(),
        };
      } else if (toDate) {
        whereClauseDate.updatedAt = {
          [Op.lte]: startCheckDate.toISOString(),
        };
      }

      const include = [
        {
          model: Order_status,
        },
        {
          model: User_Address,
        },

        {
          model: Payment_Method,
        },

        {
          model: Order_Payment_Detail,
          where: whereClauseDate,
        },
      ];

      const result = await Product_Order.findAll({
        include: include,
        where: whereClause,
        order: [["createdAt", "DESC"]],
      });

      // if (!result || result.length === 0) {
      //   await t.rollback();
      //   return Base.sendResponse(
      //     res,
      //     HTTPS.NOT_FOUND,
      //     result,
      //     "No orders found for this delivery boy."
      //   );
      // }

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching orders for delivery boy:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async postDeliveryBoysPayment(req, res) {
    const t = await sequelize.transaction();
    try {
      let whereClause = {
        delivery_boy_id: req?.params?.id,
        order_status_id: 5,
      };

      const fromDate = req.body.from ? new Date(req.body.from.trim()) : null;
      const toDate = req.body.to ? new Date(req.body.to.trim()) : null;
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

      const include = [
        {
          model: Order_status,
        },
        {
          model: User_Address,
        },

        {
          model: Payment_Method,
        },
      ];

      const result = await Product_Order.findAll({
        include: include,
        where: whereClause,
        order: [["createdAt", "DESC"]],
      });

      for (const order of result) {
        await Product_Order.update(
          {
            deliveryboy_payment_status: true,
            // deliveryboy_payment: Number(req.body.payment) / result.length,
          },
          {
            where: { id: order.id },
            transaction: t,
          }
        );
      }

      await UpdateData(
        Delivery_Boy_Detail,
        { payment: req.body.payment },
        { user_id: req?.params?.id },
        t
      );

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching orders for delivery boy:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async GetAllDeliveryBoyPayment(req, res) {
    const t = await sequelize.transaction();
    try {
      const date = req?.query?.date || "";

      // // Prepare for date filter if the `date` is provided
      let dateFilter = {};
      if (date) {
        const dayStart = moment(date).startOf("day").toDate(); // Start of the day
        const dayEnd = moment(date).endOf("day").toDate(); // End of the day
        dateFilter = {
          createdAt: {
            [Op.gte]: dayStart,
            [Op.lte]: dayEnd,
          },
        };
      }
      let whereClause = { delivery_boy_id: req?.params?.id };
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

      const include = [
        {
          model: Payment_Collect,
          include: [{ model: Product_Order }, { model: Payment_Method }],

          where: {
            payment_receive_status: false,
            delivery_boy_id: req?.params?.id,
          },
          // include: [{ model: Product }, { model: Collect_Status }],
        },
        { model: Product },
        { model: Collect_Status },
      ];

      const result = await Payment_Collect_Details.findAll({
        include: include,

        order: [["createdAt", "DESC"]],
      });

      // if (!result || result.length === 0) {
      //   await t.rollback();
      //   return Base.sendResponse(
      //     res,
      //     HTTPS.NOT_FOUND,
      //     result,
      //     "No orders found for this delivery boy."
      //   );
      // }

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching orders for delivery boy:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async GetAllPaymentMethodAmounts(req, res) {
    const t = await sequelize.transaction();
    try {
      const from_date = req?.query?.from || "";
      const to_date = req?.query?.to || "";
      const page = Number(req?.query?.page) || 1;
      const per_page = Number(req?.query?.per_page) || 10;

      const where = { delivery_boy_id: req?.params?.id };

      if (from_date && to_date) {
        const dayStart = moment(from_date, "YYYY-MM-DD")
          .startOf("day")
          .toDate();
        const dayEnd = moment(to_date, "YYYY-MM-DD").endOf("day").toDate();
        where.updatedAt = {
          [Op.gte]: dayStart,
          [Op.lte]: dayEnd,
        };
      } else if (from_date) {
        const dayStart = moment(from_date, "YYYY-MM-DD")
          .startOf("day")
          .toDate();
        where.updatedAt = {
          [Op.gte]: dayStart,
        };
      } else if (to_date) {
        const dayEnd = moment(to_date, "YYYY-MM-DD").endOf("day").toDate();
        where.updatedAt = {
          [Op.lte]: dayEnd,
        };
      }

      let card_amount = await Order_Payment_Detail.sum("amount", {
        include: [
          {
            model: Product_Order,
            attributes: [],
            where: { order_status_id: IDS.order_status.Delivered },
          },
        ],
        where: {
          payment_method_id: IDS.PaymentMethods.Card,
          ...where,
        },
      });

      let cash_amount = await Order_Payment_Detail.sum("amount", {
        include: [
          {
            model: Product_Order,
            attributes: [],
            where: { order_status_id: IDS.order_status.Delivered },
          },
        ],
        where: {
          payment_method_id: IDS.PaymentMethods.Cash,
          ...where,
        },
      });

      let qr_amount = await Order_Payment_Detail.sum("amount", {
        include: [
          {
            model: Product_Order,
            attributes: [],
            where: { order_status_id: IDS.order_status.Delivered },
          },
        ],
        where: {
          payment_method_id: IDS.PaymentMethods.QR,
          ...where,
        },
      });

      let wallet = await Order_Payment_Detail.sum("amount", {
        include: [
          {
            model: Product_Order,
            attributes: [],
            where: { order_status_id: IDS.order_status.Delivered },
          },
        ],
        where: {
          payment_method_id: IDS.PaymentMethods.Wallet,
          ...where,
        },
      });

      let online = await Order_Payment_Detail.sum("amount", {
        include: [
          {
            model: Product_Order,
            attributes: [],
            where: { order_status_id: IDS.order_status.Delivered },
          },
        ],
        where: {
          payment_method_id: IDS.PaymentMethods.Online,
          ...where,
        },
      });

      // Return the calculated totals in the response
      const data = {
        Card: card_amount,
        Cash: cash_amount,
        QR: qr_amount,
        Online: online,
        Wallet: wallet,
      };

      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching orders for delivery boy:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // async GetAllPaymentMethodAmounts(req, res) {
  //   const t = await sequelize.transaction();
  //   try {
  //     const store_id = req?.query?.store_id || "";
  //     const date = req?.query?.date || "";

  //     let dateFilter = {};
  //     // if (date) {
  //     //   const dayStart = moment(date).startOf("day").toDate(); // Start of the day
  //     //   const dayEnd = moment(date).endOf("day").toDate(); // End of the day
  //     //   dateFilter = {
  //     //     createdAt: {
  //     //       [Op.gte]: dayStart,
  //     //       [Op.lte]: dayEnd,
  //     //     },
  //     //   };
  //     // }

  //     const fromDate = req.body.from ? new Date(req.query.from.trim()) : null;
  //     const toDate = req.query.to ? new Date(req.query.to.trim()) : null;
  //     let startCheckDate;

  //     if (toDate) {
  //       startCheckDate = new Date(toDate);
  //       startCheckDate.setDate(startCheckDate.getDate() + 1);
  //       startCheckDate.setHours(0, 0, 0, 0);
  //     }

  //     if (fromDate && toDate) {
  //       dateFilter.updatedAt = {
  //         [Op.between]: [fromDate.toISOString(), startCheckDate.toISOString()],
  //       };
  //     } else if (fromDate) {
  //       dateFilter.updatedAt = {
  //         [Op.gte]: fromDate.toISOString(),
  //       };
  //     } else if (toDate) {
  //       dateFilter.updatedAt = {
  //         [Op.lte]: startCheckDate.toISOString(),
  //       };
  //     }

  //     // Get total amount for Card payments
  //     const cardAmount = await Product_Order.findAll({
  //       include: [{ model: Payment_Method }],
  //       where: {
  //         delivery_boy_id: req?.params?.id,
  //         payment_method_id: IDS.PaymentMethods.Card,

  //         ...dateFilter,
  //       },
  //     });
  //     const onlineAmount = await Product_Order.findAll({
  //       include: [{ model: Payment_Method }],
  //       where: {
  //         delivery_boy_id: req?.params?.id,
  //         payment_method_id: IDS.PaymentMethods.Online,

  //         ...dateFilter,
  //       },
  //     });
  //     const walletAmount = await Product_Order.findAll({
  //       include: [{ model: Payment_Method }],
  //       where: {
  //         delivery_boy_id: req?.params?.id,
  //         payment_method_id: IDS.PaymentMethods.Wallet,

  //         ...dateFilter,
  //       },
  //     });

  //     // Get total amount for Cash payments
  //     const cashAmount = await Product_Order.findAll({
  //       include: [{ model: Payment_Method }],
  //       where: {
  //         delivery_boy_id: req?.params?.id,
  //         payment_method_id: IDS.PaymentMethods.Cash,

  //         ...dateFilter,
  //       },
  //     });

  //     // Get total amount for QR payments
  //     const qrAmount = await Product_Order.findAll({
  //       include: [{ model: Payment_Method }],
  //       where: {
  //         delivery_boy_id: req?.params?.id,
  //         payment_method_id: IDS.PaymentMethods.QR,

  //         ...dateFilter,
  //       },
  //     });

  //     // Calculate total amounts
  //     const totalCardAmount = cardAmount
  //       .reduce(
  //         (total, order) => total + parseFloat(order.total_amount || 0),
  //         0
  //       )
  //       .toFixed(2);
  //     const totalCashAmount = cashAmount
  //       .reduce(
  //         (total, order) => total + parseFloat(order.total_amount || 0),
  //         0
  //       )
  //       .toFixed(2);
  //     const totalQrAmount = qrAmount
  //       .reduce(
  //         (total, order) => total + parseFloat(order.total_amount || 0),
  //         0
  //       )
  //       .toFixed(2);

  //     const totalOnlineAmount = onlineAmount
  //       .reduce(
  //         (total, order) => total + parseFloat(order.total_amount || 0),
  //         0
  //       )
  //       .toFixed(2);

  //     const totalWalletAmount = walletAmount
  //       .reduce(
  //         (total, order) => total + parseFloat(order.total_amount || 0),
  //         0
  //       )
  //       .toFixed(2);

  //     // Return the calculated totals in the response
  //     const data = {
  //       Card: totalCardAmount,
  //       Cash: totalCashAmount,
  //       QR: totalQrAmount,
  //       Online: totalOnlineAmount,
  //       Wallet: totalWalletAmount,
  //     };

  //     await t.commit();

  //     return Base.sendResponse(res, HTTPS.OK, data);
  //   } catch (error) {
  //     await t.rollback();
  //     console.error("Error fetching orders for delivery boy:", error);
  //     return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
  //   }
  // }

  // Delete a country by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Users, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found");
      }

      await Users.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "User Deleted Successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting User:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Users, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found");
      }

      await UpdateData(
        Users,
        { status: result.status ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "User status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating User status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async PaymentCollect(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { amount } = req.body;
      const { approval_status_id } = req?.body;

      const deliveryWallet = await CheckExits(Wallet, { user_id: id }, t);
      const delivery_boy = await CheckExits(Users, { id: id }, t);

      if (!delivery_boy) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Delivery Boy not found");
      }

      await UpdateData(
        Wallet,
        { amount: parseFloat(deliveryWallet.amount) - parseFloat(amount) },
        { user_id: id },
        t
      );

      await UpdateData(
        Payment_Collect,
        { payment_receive_status: true },
        { delivery_boy_id: req?.params?.id },
        t
      );

      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, "payment updated successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error updating Category status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async ApprovalStatus(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { approval_status_id } = req?.body;

      const delivery_boy = await CheckExits(
        Delivery_Boy_Detail,
        { user_id: id },
        t
      );
      const user = await CheckExits(Users, { id: id }, t);

      if (!delivery_boy) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Delivery Boy not found");
      }

      // await UpdateData(Users, { status: result.status ? false : true }, { id }, t);
      await UpdateData(
        Delivery_Boy_Detail,
        { approval_status_id: approval_status_id },
        { user_id: id },
        t
      );
      await UpdateData(Users, { status: true }, { id: id }, t);

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
        to: user?.email,
        subject: "Delivery Boy Request",
      };

      if (product_status === "Approved") {
        mailOptions.html = `
            <b>Thank you for Showing Intrest !</b>
                <p> Your request has been ${product_status} with E-mail ${user?.email}</p>
              
                <br> Use Your Email ID and Password You Create at the Time of Registration Request 
                <br>
                <h3>We Wish You All The Best !</h3>
                <br>
                <br> Thanks and Regard 
                <br> Grocido
                
                <br>   
                <img src="https://profcyma.com/assets/images/logo/Profcyma-logotwo.png" alt="Profcyma Logo" style="width: 200px; height: 100px;">
        `;
      } else {
        mailOptions.html = `
          <b>Thank you for Showing Intrest!</b>
                <p> Your request has been ${product_status} with E-mail ${user?.email}</p> 
        `;
      }

      sendMail(mailOptions);

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Store status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Category status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new DeliveryBoyController();
