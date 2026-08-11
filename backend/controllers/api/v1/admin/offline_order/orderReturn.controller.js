const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
  NotificationsManagment,
} = require("../../../../../helper/common/utils/dbUtils");
const Base = require("../../../../../helper/exception_handling");
const IDS = require("../../../../../helper/fix_ids");
const {
  HTTPS,
} = require("../../../../../helper/https-status-codes/https-status-codes");
const {
  Product_Order,
  Product_Order_Detail,
  Users,
  RefundOrders,
  Order_status,
  User_Address,
  Product,
  Return_Order,
  Stocks,
  Colour,
  p_category,
  p_sub_category,
  p_child_category,
  Order_History,
  Return_Reason,
  Return_Status,
  Order_Payment_Detail,
  sequelize,
  Notification,
  Payment_Method,
  Time_Slot,
  Users_Address_Details,
  Country,
  State,
  City,
  Pincode,
  Wallet,
  Area,
  Order_Cancellation,
  Cancel_Reason,
  Discount_Type,
  Offered_Product,
  Product_Variant,
  Product_Variant_Stock,
  Users_Refer,
  App_Setup,
  Receiving,
  Receiving_Product,
  Product_Images,
  Wallet_History,
  Prescriptions,
  Refund_Order_Details,
} = require("../../../../../models/index");
const { Op, where } = require("sequelize");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
const moment = require("moment");
const {
  AdminNotifications,
} = require("../../../../../helper/mobile_notifications");
const {
  AdminNotificationsDriver,
} = require("../../../../../helper/mobile_notifications_driver");
const {
  update_order,
  update_user,
} = require("../../../../../helper/order_notification");
const {
  findUniqueinvoicenumberorder,
} = require("../../../../../helper/order_function/function");
const { mailOrder, commonMail } = require("../../../../../helper/NodeMailer");
const { InvoiceGenerater } = require("../../../../../helper/invoice_generater");
const { sendWatsappMessage } = require("../../../../../helper/WhatsAppMessage");
class OrderCancelController {
  async getInvoiceNoOrderReturn(req, res) {
    const t = await sequelize.transaction();
    try {
      const user_id = req.params.id || null;
      const invoice_no = req.query.invoice_no.trim();
      let data = null;
      const options = [
        {
          model: Product_Order_Detail,
          where: { status: true },
          include: [
            {
              model: Product,
              paranoid: false,
              include: [{ model: p_category, paranoid: false }],
            },
            { model: Stocks },
            {
              model: Prescriptions,
              include: [
                {
                  model: Product,
                  as: "Lense",
                },
              ],
            },
          ],
        },
      ];

      data = await CheckExits(
        Product_Order,
        {
          order_status_id: {
            [Op.in]: [IDS?.order_status?.Delivered],
          },
          invoice_no: invoice_no,
          user_id,
        },
        t,
        options,
      );

      if (!data) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Order Not Found");
      }

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching User:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async getAllUserOrder(req, res) {
    const t = await sequelize.transaction();
    try {
      const user_id = req.params.id || null;

      let data = null;
      const options = [
        {
          model: Product_Order_Detail,
          where: { status: true },
          include: [
            { model: Product, include: [{ model: p_category }] },
            {
              model: Prescriptions,
              include: [
                {
                  model: Product,
                  as: "Lense",
                },
              ],
            },
          ],
        },
      ];

      data = await Product_Order.findAll({
        where: {
          order_status_id: {
            [Op.in]: [IDS?.order_status?.Delivered],
          },
          user_id,
        },
        include: options,
        transaction: t,
      });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching User:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async findUserCancelOrder(req, res) {
    const t = await sequelize.transaction();
    try {
      const contact_no = req.query.contact_no || "";

      const email = req.query.email || "";
      let data = null;

      // const include = [
      //   {
      //     model: Product_Order,
      //     where: {
      //       order_status_id: {
      //         [Op.in]: [
      //           IDS?.order_status?.Pending,
      //           IDS?.order_status?.Processing,
      //           IDS?.order_status?.PickupScheduled,
      //           IDS?.order_status?.Shipped,
      //         ],
      //       },
      //     },
      //     include: [{ model: Product_Order_Detail, where: { status: true } }],
      //   },
      // ];
      if (contact_no) {
        data = await CheckExits(Users, { contact_no: contact_no }, t);
      }
      if (email) {
        data = await CheckExits(Users, { email: email }, t);
      }
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error fetching User:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async ReturnOrder(req, res) {
    const t = await sequelize.transaction();
    try {
      const {
        user_id,
        order_id,
        order_details,
        refund_amount,
        selectedFields,
      } = req.body;

      if (!order_id || !order_details?.length) {
        return res
          .status(400)
          .json({ success: false, message: "Order ID and products required." });
      }

      // Fetch order with details
      const order = await Product_Order.findOne({
        where: { id: order_id },
        include: [
          {
            model: Product_Order_Detail,
            where: { status: true },
            include: [{ model: Prescriptions }],
          },
        ],
        transaction: t,
      });

      if (!order) {
        await t.rollback();
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }

      let total_selling_price = 0,
        total_amount = 0,
        total_tax = 0,
        total_addon_price = 0,
        total_coupon_discount = 0,
        total_offer_discount = 0,
        reward_discount = 0,
        delivery_charges = 0;

      const refundorder = await RefundOrders.create(
        {
          order_id: order_id,
          user_id: user_id,
          refund_amount: parseFloat(refund_amount || 0),
          description: `Refund for Return product ${order.invoice_no}`,
        },
        { transaction: t },
      );
      for (let prod of order_details) {
        if (prod.product_id) {
          const variant = await Product.findOne({
            where: { id: prod.product_id },
            transaction: t,
          });

          const lens = await Product.findOne({
            where: { id: prod.product_id },
            transaction: t,
          });
          if (variant) {
            await Product.update(
              {
                available_stock:
                  parseFloat(variant.available_stock || 0) +
                  parseFloat(prod.quantity || 0),
              },
              { where: { id: prod.product_id }, transaction: t },
            );
          }
        }

        if (prod?.stock_id) {
          await Stocks.update(
            {
              stock_status_id: IDS?.StockStatus?.Available,
            },
            { where: { id: prod?.stock_id }, transaction: t },
          );
        }

        if (prod.Prescription) {
          if (prod.Prescription?.lense_product_id) {
            const lens = await Product.findOne({
              where: { id: prod.Prescription?.lense_product_id },
              transaction: t,
            });

            if (lens) {
              await Product.update(
                {
                  available_stock:
                    parseFloat(lens.available_stock || 0) +
                    parseFloat(prod.quantity || 1),
                },
                { where: { id: lens.id }, transaction: t },
              );

              const stock = await Stocks.findOne({
                where: { product_id: lens?.id },
                transaction: t,
              });

              // If found, update only that stock
              if (stock) {
                await stock.update(
                  { stock_status_id: IDS?.StockStatus?.Available },
                  { transaction: t },
                );
              }
            }
          }

          // Find the stock you want to update first
        }

        // Update totals for order
        total_selling_price += parseFloat(prod.total_selling_price || 0);
        total_amount += parseFloat(prod.total_amount || 0);
        total_tax += parseFloat(prod.total_tax || 0);
        total_coupon_discount += parseFloat(prod.coupon_discount || 0);
        total_offer_discount += parseFloat(prod.total_offer_discount || 0);
        reward_discount += parseFloat(prod.reward_discount || 0);
        delivery_charges += parseFloat(prod.delivery_charges || 0);
        total_addon_price += parseFloat(prod.total_addon_price || 0);

        // Mark product as cancelled
        await Product_Order_Detail.update(
          { return_status: false },
          { where: { id: prod.id }, transaction: t },
        );

        await Refund_Order_Details.create(
          {
            refund_order_id: refundorder?.id,
            order_detail_id: prod.id,
            refund_amount: parseFloat(prod.total_amount || 0),
          },
          { transaction: t },
        );
      }

      const updateData = {
        total_selling_price:
          (parseFloat(order.total_selling_price) || 0) - total_selling_price,
        total_amount: (parseFloat(order.total_amount) || 0) - total_amount,
        total_coupon_discount:
          (parseFloat(order.total_coupon_discount) || 0) -
          total_coupon_discount,
        total_offer_discount:
          (parseFloat(order.total_offer_discount) || 0) - total_offer_discount,
        reward_discount:
          (parseFloat(order.reward_discount) || 0) - reward_discount,
      };
      if (selectedFields?.shipping) {
        updateData.delivery_charges =
          (parseFloat(order.delivery_charges) || 0) - delivery_charges;
      }

      if (selectedFields?.tax) {
        updateData.total_tax = (parseFloat(order.total_tax) || 0) - total_tax;
      }
      if (selectedFields?.addon) {
        updateData.total_addon_price =
          (parseFloat(order.total_addon_price) || 0) - total_addon_price;
      }
      if (order.Product_Order_Details.length != order_details.length) {
        // updateData.total_amount =
        //   total_selling_price +
        //   delivery_charges +
        //   total_addon_price +
        //   total_tax -
        //   (reward_discount + total_offer_discount + total_coupon_discount);
        await Product_Order.update(updateData, {
          where: { id: order_id },
          transaction: t,
        });
      }

      if (order.Product_Order_Details.length === order_details.length) {
        await UpdateData(
          Product_Order,
          { order_status_id: IDS.order_status.Returned },
          { id: order_id },
          t,
        );
      }

      const customer = await Users.findOne({
        where: { id: order.user_id },
        transaction: t,
      });
      const subject = "Your Order Return Has Been Initiated";

      const messagemail = `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <h2 style="color:#dc3545;">Order Return Initiated 🔄</h2>

    <p>Hi <b>${customer.name}</b>,</p>

    <p>
      We have successfully received your return request for the order mentioned below.
      Our team will process the return shortly.
    </p>

    <table style="border-collapse: collapse; width: 100%; margin-top: 15px;">
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;"><b>Order ID</b></td>
        <td style="border: 1px solid #ddd; padding: 8px;">${order.invoice_no}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;"><b>Refund Amount</b></td>
        <td style="border: 1px solid #ddd; padding: 8px;">₹${total_amount}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;"><b>Return Date</b></td>
        <td style="border: 1px solid #ddd; padding: 8px;">
          ${new Date().toLocaleDateString()}
        </td>
      </tr>
    </table>

    <p style="margin-top: 20px;">
      💳 The refund will be processed to your original payment method or wallet within 3–5 business days.
    </p>

    <p>
      If you have any questions regarding your return, feel free to contact our support team.
    </p>

    <br/>
    <p>Warm Regards,<br/>
    <b>Bapat Optics</b></p>
  </div>
`;

      const message = `
🔄 𝗬𝗼𝘂𝗿 𝗢𝗿𝗱𝗲𝗿 𝗥𝗲𝘁𝘂𝗿𝗻 𝗛𝗮𝘀 𝗕𝗲𝗲𝗻 𝗜𝗻𝗶𝘁𝗶𝗮𝘁𝗲𝗱 with Bapat Optics

Hey ${customer.name} 👋

We have successfully received your return request.
Our team will process your return shortly.

🧾 Return Details
🆔 Order ID: ${order.invoice_no}
💰 Refund Amount: ₹${total_amount}
📅 Return Date: ${new Date().toLocaleDateString()}

💳 Refund Update
Your refund will be processed to your original payment method or wallet within 3–5 business days.

Need Help?
📞 Contact our support team anytime for assistance.

💛 Warm Regards,
Bapat Optics
👓 Quality Vision, Trusted Care
`;
      sendWatsappMessage(customer, message);
      commonMail(customer?.email, subject, messagemail);

      await t.commit();
      return res.status(200).json({
        success: true,
        message: "Selected products cancelled successfully.",
      });
    } catch (error) {
      await t.rollback();
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

module.exports = new OrderCancelController();
