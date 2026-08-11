const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");
const { HTTPS } = require("./https-status-codes/https-status-codes");
const Base = require("./exception_handling");
const { ContactType } = require("./fix_ids");
const {
  Subscription,
  Product,
  Product_Variant_Stock,
  Notification,
  App_Setup,
  Receiving_Product,Receiving,
  sequelize,
} = require(".././models/index");
const IDS = require("./fix_ids");
const Mail = require("nodemailer/lib/mailer");
const { mail } = require("./NodeMailer");

const validateSubscriptions = async () => {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const data = await Subscription.findAll({
      where: {
        expiry_date: {
          [Op.lt]: today,
        },
      },
    });

    const data1 = await Subscription.findAll({
      where: {
        start_date: {
          [Op.eq]: today,
        },
      },
    });

    if (data.length > 0) {
      for (let item of data) {
        await Subscription.update(
          { status: false },
          { where: { id: item.id } }
        );
      }
    }
    if (data1.length > 0) {
      for (let item of data1) {
        await Subscription.update({ status: true }, { where: { id: item.id } });
      }
    }
  } catch (error) {
    console.error("Error while validating subscriptions:", error);
  }
};

const dayjs = require("dayjs");

const ProductExpiryDateAlert = async () => {
  try {
    const today = dayjs().startOf("day");

    const appsetup = await App_Setup.findOne();

    const products = await Product.findAll({
      where: {
        expity_date_days: { [Op.ne]: null },
      },
      include: [
        {
          model: Receiving_Product,
          include:[{model:Receiving}],
          required: true,
           where: {
        expiry_date: { [Op.ne]: null },
      },
        },
      ],
    });

  

    const expiringData = [];

    for (const product of products) {
      const { expity_date_days, name } = product;
      

      for (const stock of product.Receiving_Products) {
        const expiryDate = dayjs(stock.expiry_date);
        
        const daysLeft = expiryDate.diff(today, "day");

        if (daysLeft <= expity_date_days) {
          expiringData.push({
            product: name,
            batch: stock.Receiving?.batch_no,
            expiry: expiryDate.format("YYYY-MM-DD"),
            daysLeft,
          });
        }
      }
    }

    if (expiringData.length > 0) {
      let message = "The following product batches are near expiry:\n\n";

      for (const item of expiringData) {
        message += `Product: ${item.product}, Batch: ${item.batch}, Expiry: ${item.expiry}, Days Left: ${item.daysLeft}\n`;
      }

      console.log(message, "message message");

      await mail(appsetup.email, "Product Expiry Alert", message);
    }
  } catch (error) {
    console.error("Error sending expiry alert:", error);
  }
};

const OrderCapture = async () => {
  try {
    console.log("llllllllllll");

    const orders = await Product_Order.findAll({
      where: {
        payment_status_check: false,
        razorpay_order_id: {
          [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: "" }],
        },
      },
      order: [["id", "DESC"]],
    });

    for (const order of orders) {
      console.log(order.razorpay_order_id, "order.razorpay_order_id");
      const payments = await razorpay.orders.fetchPayments(
        order.razorpay_order_id
      );
      console.log(payments, "payment data");
      const payment = payments.items[0];

      if (!payments.items || payments.items.length === 0) continue;

      if (
        payment.status === "refunded" ||
        payment.status === "partially_refunded"
      ) {
        await Product_Order.update(
          {
            status: 1,
            order_status_id: IDS.order_status?.Cancelled,
          },
          {
            where: { id: order?.id },
          }
        );

        continue;
      }

      if (payment.status === "captured") {
        if (order.status !== 1) {
          await Product_Order.update(
            {
              status: 1,
              order_status_id: IDS.order_status?.Pending,
            },
            {
              where: { id: order?.id },
            }
          );

          await Order_Payment_Detail.update(
            {
              payment_id: payment.id,
            },
            {
              where: { order_id: order?.id },
            }
          );
        }
      }

      await Product_Order.update(
        {
          payment_status_check: 1,
        },
        {
          where: { id: order?.id },
        }
      );
    }
  } catch (error) {
    console.error("Error payment:", error);
  }
};

module.exports = { validateSubscriptions, ProductExpiryDateAlert,OrderCapture };
