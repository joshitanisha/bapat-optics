const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Base = require("../../../../../helper/exception_handling");
const {
  HTTPS,
} = require("../../../../../helper/https-status-codes/https-status-codes");
const {
  Product,
  Product_Order,
  Order_History,
  Payment_Type,
  Order_Payment_Detail,
  Rating_Reviews,
  Store_Detail,
  Appointment,
  Appointment_Details,
  Doctor_Details,
  Wallet,
  Subscription,
  Users,Admin_Notifiction,
  sequelize,
} = require("../../../../../models/index");
const IDS = require("../../../../../helper/fix_ids");
const { VerifyAnyOtp } = require("../../../../../helper/common/utils/dbUtils");
const { Op, fn, col } = require("sequelize");
const moment = require("moment");

class DashboardController {
  async getallDashboardCounts(req, res) {
    try {
      const startOfDay = moment().startOf("day").toDate();
      const endOfDay = moment().endOf("day").toDate();

      const Pending = await Product_Order.count({
        where: {
          order_status_id: IDS.order_status.Pending,
          updatedAt: {
            [Op.gte]: startOfDay,
            [Op.lte]: endOfDay,
          },
        },
      });

      const Processing = await Product_Order.count({
        where: {
          order_status_id: IDS.order_status.Processing,
          updatedAt: {
            [Op.gte]: startOfDay,
            [Op.lte]: endOfDay,
          },
        },
      });

      const PickupScheduled = await Product_Order.count({
        include: [
          {
            model: Order_History,
          },
        ],
        where: {
          order_status_id: IDS.order_status.PickupScheduled,
          updatedAt: {
            [Op.gte]: startOfDay,
            [Op.lte]: endOfDay,
          },
        },
      });

      const Shipped = await Product_Order.count({
        include: [
          {
            model: Order_History,
          },
        ],
        where: {
          order_status_id: IDS.order_status.Shipped,
          updatedAt: {
            [Op.gte]: startOfDay,
            [Op.lte]: endOfDay,
          },
        },
      });

      const Delivered = await Product_Order.count({
        include: [
          {
            model: Order_History,
          },
        ],
        where: {
          order_status_id: IDS.order_status.Delivered,
          updatedAt: {
            [Op.gte]: startOfDay,
            [Op.lte]: endOfDay,
          },
        },
      });

      const Cancelled = await Product_Order.count({
        include: [
          {
            model: Order_History,
          },
        ],
        where: {
          order_status_id: IDS.order_status.Cancelled,
          updatedAt: {
            [Op.gte]: startOfDay,
            [Op.lte]: endOfDay,
          },
        },
      });

      const Returned = await Product_Order.count({
        include: [
          {
            model: Order_History,
          },
        ],
        where: {
          order_status_id: IDS.order_status.Returned,
          updatedAt: {
            [Op.gte]: startOfDay,
            [Op.lte]: endOfDay,
          },
        },
      });

      const Rejected = await Product_Order.count({
        include: [
          {
            model: Order_History,
          },
        ],
        where: {
          order_status_id: IDS.order_status.Rejected,
          updatedAt: {
            [Op.gte]: startOfDay,
            [Op.lte]: endOfDay,
          },
        },
      });

      const Refunded = await Product_Order.count({
        include: [
          {
            model: Order_History,
          },
        ],
        where: {
          order_status_id: IDS.order_status.Refunded,
          updatedAt: {
            [Op.gte]: startOfDay,
            [Op.lte]: endOfDay,
          },
        },
      });

      const total_products = await Product.count({
        where: {
          status: true,
        },
      });

      const total_Orders = await Product_Order.count({
        where: {
          status: true,
          createdAt: {
            [Op.gte]: startOfDay,
            [Op.lte]: endOfDay,
          },
        },
      });

      const todays_selling = await Product_Order.count({
        where: {
          order_status_id: IDS.order_status.PickupScheduled,
          createdAt: {
            [Op.gte]: startOfDay,
            [Op.lte]: endOfDay,
          },
        },
      });

      // const low_stock = await Product.count({
      //   where: {
      //     status: true,
      //     stock: { [Op.lte]: 50 },
      //   },
      // });

      const total_reviews = await Rating_Reviews.count({
        include: [
          {
            model: Product,
          },
        ],
      });

      const todays_delivered = await Product_Order.findAll({
        where: {
          order_status_id: IDS.order_status.Delivered,
          createdAt: {
            [Op.gte]: startOfDay,
            [Op.lte]: endOfDay,
          },
        },
      });

      const TotalOrderPrice = await Product_Order.count({
        include: [
          {
            model: Order_History,
            // where: {
            //   order_status_id: IDS.order_status.Delivered,
            // },
          },
        ],
        where: {
          order_status_id: IDS.order_status.PickupScheduled,
        },
      });

      const TotalCustomer = await Users.count({
        where: { role_id: IDS.RoleId.Customer },
      });

      // const TotalActiveSubscription = await Subscription.count({
      //   include:[{model:Users,required:true}],
      //   where: { status: true },
      // });

      const todays_total = todays_delivered
        .reduce(
          (total, order) => total + parseFloat(order.total_amount || 0),
          0,
        )
        .toFixed(2);

      const TotalNotification = await Admin_Notifiction.count({
        where: { seen_status: false },
      });

      const data = {
        Pending_orders: Pending,
        Processing_orders: Processing,
        PickupScheduled_orders: PickupScheduled,
        Shipped_orders: Shipped,
        Delivered_orders: Delivered,
        Cancelled_orders: Cancelled,
        Rejected_orders: Rejected,
        Returned_orders: Returned,
        Refunded_orders: Refunded,
        total_Orders:
          Pending +
          Processing +
          PickupScheduled +
          Shipped +
          Delivered +
          Cancelled +
          Rejected,
        total_products: total_products,
        todays_selling: todays_selling,
        // low_stock: low_stock,
        todays_total: todays_total,
        total_reviews: total_reviews,
        TotalOrderPrice: TotalOrderPrice,
        TotalCustomer: TotalCustomer,
        TotalNotification:TotalNotification
        // TotalSubscription: TotalSubscription,
        // TotalActiveSubscription: TotalActiveSubscription,
        // TotaldoctorSubscription: TotaldoctorSubscription,
      };

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Dashboard Details:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async getSaleChartData(req, res) {
    try {
      const sevenDaysAgo = moment()
        .subtract(30, "days")
        .startOf("day")
        .toDate();

      const data = await Product_Order.findAll({
        attributes: [
          [fn("DATE", col("updatedAt")), "date"],
          [fn("COUNT", col("id")), "order_count"],
        ],
        where: {
          updatedAt: { [Op.gte]: sevenDaysAgo },
          // ...(req?.user?.role_id === IDS.RoleId?.Vendor
          //   ? { store_id: req?.user?.store_id }
          //   : {}),
        },
        group: [fn("DATE", col("updatedAt"))],
        order: [[fn("DATE", col("updatedAt")), "ASC"]],
      });

      const total = await Product_Order.count({
        where: {
          updatedAt: { [Op.gte]: sevenDaysAgo },
          // ...(req?.user?.role_id === IDS.RoleId?.Vendor
          //   ? { store_id: req?.user?.store_id }
          //   : {}),
        },
      });

      return Base.sendResponse(res, HTTPS.OK, { data, total: total });
    } catch (error) {
      console.error("Error in Dashboard Sale Chart Data:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async GetAllPaymentMethodAmounts(req, res) {
    const t = await sequelize.transaction();
    try {
      const store_id = req?.user?.store_id || "";
      const from_date = new Date(req?.query?.from_date);
      const to_date = new Date(req?.query?.to_date);

      let startOfDay = moment.utc(from_date).startOf("day").toDate();
      let endOfDay = moment.utc(to_date).endOf("day").toDate();

      // Get total amount for Card payments
      const cardAmount = await Product_Order.findAll({
        include: [
          {
            model: Order_Payment_Detail,
            include: [
              {
                model: Payment_Type,
              },
            ],
            where: { payment_type_id: IDS.PaymentMethods.Card },
          },
          {
            model: Order_History,
            where: {
              deliveredAt: {
                [Op.gte]: startOfDay,
                [Op.lte]: endOfDay,
              },
            },
          },
        ],
        where: { store_id },
      });

      // Get total amount for Cash payments
      const cashAmount = await Product_Order.findAll({
        include: [
          {
            model: Order_Payment_Detail,
            include: [
              {
                model: Payment_Type,
              },
            ],
            where: { payment_type_id: IDS.PaymentMethods.Cash },
          },
          {
            model: Order_History,
            where: {
              deliveredAt: {
                [Op.gte]: startOfDay,
                [Op.lte]: endOfDay,
              },
            },
          },
        ],
        where: {
          store_id,
        },
      });

      // Get total amount for QR payments
      const qrAmount = await Product_Order.findAll({
        include: [
          {
            model: Order_Payment_Detail,
            include: [
              {
                model: Payment_Type,
              },
            ],
            where: { payment_type_id: IDS.PaymentMethods.QR },
          },
          {
            model: Order_History,
            where: {
              deliveredAt: {
                [Op.gte]: startOfDay,
                [Op.lte]: endOfDay,
              },
            },
          },
        ],
        where: { store_id },
      });

      // Calculate total amounts
      const totalCardAmount = cardAmount
        .reduce(
          (total, order) => total + parseFloat(order.total_amount || 0),
          0,
        )
        .toFixed(2);
      const totalCashAmount = cashAmount
        .reduce(
          (total, order) => total + parseFloat(order.total_amount || 0),
          0,
        )
        .toFixed(2);
      const totalQrAmount = qrAmount
        .reduce(
          (total, order) => total + parseFloat(order.total_amount || 0),
          0,
        )
        .toFixed(2);
      const totalAmount =
        parseFloat(totalCardAmount) +
        parseFloat(totalCashAmount) +
        parseFloat(totalQrAmount);

      // Return the calculated totals in the response
      const data = {
        Card: totalCardAmount,
        Cash: totalCashAmount,
        QR: totalQrAmount,
        total: totalAmount.toFixed(2),
      };

      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching orders for delivery boy:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async GetAllPaymentReport(req, res) {
    const t = await sequelize.transaction();
    try {
      const store_id = req?.user?.store_id || "";
      const from_date = new Date(req?.query?.from_date);
      const to_date = new Date(req?.query?.to_date);

      // Helper function to get payment data for a specific day
      const getPaymentDataForDay = async (date, paymentMethodId) => {
        let startOfDay = moment.utc(date).startOf("day").toDate();
        let endOfDay = moment.utc(date).endOf("day").toDate();

        return await Product_Order.findAll({
          include: [
            {
              model: Order_Payment_Detail,
              include: [
                {
                  model: Payment_Type,
                },
              ],
              where: { payment_type_id: paymentMethodId },
            },
            {
              model: Order_History,
              where: {
                deliveredAt: {
                  [Op.gte]: startOfDay,
                  [Op.lte]: endOfDay,
                },
              },
            },
          ],
          where: { store_id },
        });
      };

      // Prepare the dates array
      const dateArray = [];
      let currentDate = moment.utc(from_date).startOf("day");
      const endDate = moment.utc(to_date).endOf("day");

      while (currentDate <= endDate) {
        dateArray.push(currentDate.clone().toDate()); // Add the current date to the array
        currentDate.add(1, "day"); // Move to the next day
      }

      // Prepare an array to hold the results
      let result = [];

      // Loop through the dates and calculate the totals for each date
      for (let date of dateArray) {
        const formattedDate = moment(date).format("YYYY-MM-DD"); // Format the date as 'YYYY-MM-DD'

        // Get amounts for Card, Cash, and QR for the current date
        const cardAmount = await getPaymentDataForDay(
          date,
          IDS.PaymentMethods.Card,
        );
        const cashAmount = await getPaymentDataForDay(
          date,
          IDS.PaymentMethods.Cash,
        );
        const qrAmount = await getPaymentDataForDay(
          date,
          IDS.PaymentMethods.QR,
        );

        // Calculate totals for the current date
        const totalCardAmount = cardAmount
          .reduce(
            (total, order) => total + parseFloat(order.total_amount || 0),
            0,
          )
          .toFixed(2);
        const totalCashAmount = cashAmount
          .reduce(
            (total, order) => total + parseFloat(order.total_amount || 0),
            0,
          )
          .toFixed(2);
        const totalQrAmount = qrAmount
          .reduce(
            (total, order) => total + parseFloat(order.total_amount || 0),
            0,
          )
          .toFixed(2);

        const totalAmount = (
          parseFloat(totalCardAmount) +
          parseFloat(totalCashAmount) +
          parseFloat(totalQrAmount)
        ).toFixed(2);

        // Store the result for the current date as an object in the array
        result.push({
          date: formattedDate,
          cash: totalCashAmount,
          card: totalCardAmount,
          qr: totalQrAmount,
          total: totalAmount,
        });
      }

      await t.commit();

      // Return the response in the desired array format
      return res.status(200).json({
        success: true,
        data: result, // Now `result` is an array where each element is a date's payment data
      });
    } catch (error) {
      await t.rollback();
      console.error("Error fetching payment reports:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getallDoctorWallet(req, res) {
    const t = await sequelize.transaction();
    try {
      const wallet = await Wallet.findOne({
        where: { user_id: req?.user?.user_id },
        transaction: t,
      });

      const doctor = await Doctor_Details.findOne({
        where: { user_id: req?.user?.user_id },
        transaction: t,
      });

      // const appointment = await Appointment_Details.findAll({
      //   include:[{model:Users,required:true}],
      //   where: { doctor_id: req?.user?.user_id },
      //   transaction: t,
      // });

      await t.commit();

      const result = {
        wallet,
        // appointment,
        doctor,
      };

      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Wallet:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new DashboardController();
