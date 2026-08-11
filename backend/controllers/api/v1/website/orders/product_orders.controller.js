const { logger } = require("sequelize/lib/utils/logger");
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
const { InvoiceGenerater } = require("../../../../../helper/invoice_generater");

const Razorpay = require("razorpay");
const { customOtpGen } = require("otp-gen-agent");
const {
  Users,
  Product,
  Store_Detail,
  Order_status,
  Payment_Type,
  User_Address,
  Cart,
  Product_Variant,
  Order_Cancellation,
  Users_Address_Details,
  Return_Order_Details,
  Pincode,
  Order_History,
  Order_Add_On,
  Food_Add_On,
  Product_Order,
  Product_Order_Detail,
  Coupon,
  Coupon_History,
  Replace_Order,
  Replace_Order_Media,
  Return_Order,
  Return_Order_Media,
  Return_Reason,
  Order_Payment_Detail,
  Wallet_History,
  Notification,
  Wallet,
  Pack_Type,
  Offered_Product,
  App_Setup,
  Payment_Method,
  Time_Slot,
  Discount_Type,
  Product_Stock,
  Rating_Reviews,
  Order_Otp,
  Purchase_History,
  Receiving,
  Receiving_Product,
  Product_Variant_Stock,
  Users_Refer,
  Return_Status,
  p_category,
  Tax_Type,
  Coupon_Type,
  Brand,
  Offer,
  Country,
  State,
  City,
  Prescriptions,
  Prescription_Details,
  Lens_Option,
  Prescriptions_Type,
  Lens,
  LensType,
  Addon,
  Stocks,
  Advance_Payment,
  Coupon_Brand,
  sequelize,
  Admin_Notifiction,
  Stock_History,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
const app_setup = require("../../../../../models/app_setup");
const {
  AdminNotifications,
} = require("../../../../../helper/mobile_notifications");
const {
  stockMail,
  mail,
  mailOrder,
  commonMail,
} = require("../../../../../helper/NodeMailer");
const {
  update_order,
  create_order,
} = require("../../../../../helper/order_notification");
const { transaction } = require("../wallet/wallet.controller");
const {
  getDistance,
  capturePayment,
} = require("../../../../../helper/common/function");
const {
  findUniqueinvoicenumberorder,
  processOrderDetails,
  findUniqueinvoicenumberOrderDetails,
} = require("../../../../../helper/order_function/function");
const { sendWatsappMessage } = require("../../../../../helper/WhatsAppMessage");

exports.findAll = async (req, res) => {
  const order_status_id = req.query.order_status_id || "";
  const whereclause = { user_id: req.user.user_id };
  // if (order_status_id) {
  //   whereclause.order_status_id = order_status_id;
  // }

  if (order_status_id) {
    if (Array.isArray(order_status_id)) {
      whereclause.order_status_id = { [Op.in]: order_status_id };
    } else if (
      typeof order_status_id === "string" &&
      order_status_id.includes(",")
    ) {
      const ids = order_status_id.split(",").map((id) => Number(id.trim()));
      whereclause.order_status_id = { [Op.in]: ids };
    } else {
      whereclause.order_status_id = Number(order_status_id);
    }
  }

  try {
    const options = {
      include: [
        {
          model: Users,
          paranoid: false,
        },

        {
          model: User_Address,
          paranoid: false,
        },
        {
          model: Users,
          as: "delivery_boy",
        },
        {
          model: Product_Order_Detail,
          include: [
            {
              model: Product,
              paranoid: false,
            },
            {
              model: Product_Variant,
              paranoid: false,
            },
          ],
        },
        {
          model: Order_History,
          paranoid: false,
        },

        {
          model: Order_status,
        },
        {
          model: Return_Order,
          include: [
            {
              model: Return_Reason,
            },
            {
              model: Users,
            },
          ],
        },
        {
          model: Order_Otp,
        },
      ],
      where: whereclause,
      order: [["createdAt", "DESC"]],
    };

    const queryOptions = {
      ...options,
      where: {
        ...options.where,
      },
      // offset: (page - 1) * per_page,
      // limit: per_page,
      distinct: true,
    };

    const { count, rows: data } =
      await Product_Order.findAndCountAll(queryOptions);

    return Base.sendResponse(res, HTTPS.OK, {
      data: data,
      // current_page: page,
      // total_pages: total_pages,
      // per_page: per_page,
      // total: count,
      // search_name: term,
    });
    // await Paginate(Product_Order, options, req, res, Op);
  } catch (error) {
    console.error("Error fetching Brands:", error);
    return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
  }
};

exports.findOne = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const include = [
      {
        model: Users,
        paranoid: false,
        include: [
          {
            model: Wallet,
          },
        ],
      },

      {
        model: Payment_Method,
      },
      {
        model: Order_status,
      },
      {
        model: User_Address,
        paranoid: false,
        include: [
          {
            model: Users_Address_Details,
            paranoid: false,
            include: [
              { model: Country, paranoid: false },
              { model: State, paranoid: false },
              { model: City, paranoid: false },
              { model: Pincode, paranoid: false },
            ],
          },
        ],
      },
      {
        model: Users,
        paranoid: false,
        as: "delivery_boy",
      },
      {
        model: Product_Order_Detail,
        include: [
          {
            model: Product,
            paranoid: false,
          },
          {
            model: Product_Variant,
            paranoid: false,
          },
          {
            model: Rating_Reviews,
          },

          {
            model: Prescriptions,
            include: [
              {
                model: Prescription_Details,
              },
              {
                model: Lens_Option,
              },
              {
                model: Prescriptions_Type,
              },
              {
                model: Lens,
              },
              {
                model: LensType,
              },
              {
                model: Addon,
              },
              {
                model: Product,
                as: "Lense",
              },
            ],
          },
        ],
      },
      {
        model: Order_History,
      },
      {
        model: Order_Otp,
      },
      {
        model: Return_Order,
        include: [
          {
            model: Return_Reason,
          },
          {
            model: Users,
          },
        ],
      },
      // {
      //   model: Rating_Reviews,
      // },
    ];
    const result = await CheckExits(
      Product_Order,
      { id: req.params.id },
      t,
      include,
    );

    if (!result) {
      await t.rollback();
      return Base.sendError(res, HTTPS.NOT_FOUND, "Order not found");
    }
    await t.commit();
    return Base.sendResponse(res, HTTPS.OK, result);
  } catch (error) {
    await t.rollback();
    console.error("Error fetching Order:", error);
    return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
  }
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.CreateOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      address_id,
      coupon_id,
      payment_method_id,
      payment_id,
      order_summary,
      order_Details_summary,
      gst_number,
    } = req.body;
    const userId = req?.user?.user_id;

    const appsetup = await App_Setup.findOne({
      transaction: t,
    });
    const customer = await Users.findOne({
      where: { id: userId },
      transaction: t,
    });
    const cartListItems = await Cart.findAll(
      {
        include: [{ model: Product }, { model: Product_Variant }],
        where: { user_id: req?.user?.user_id },
      },
      { transaction: t },
    );

    if (!cartListItems || cartListItems.length === 0) {
      await t.rollback();
      return Base.sendResponse(res, HTTPS.NOT_FOUND, "No Cart Found");
    }

    const invoice_number = await findUniqueinvoicenumberorder();
    let razorpayorder = null;
    if (Number(payment_method_id) === Number(IDS.PaymentMethods.Online)) {
       const amount = Math.round(Number(order_summary.total_amount) * 100);
    //   const amount = Math.round(1 * 100);
      const options = {
        amount: amount,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };
      console.log(options, "options options");

      razorpayorder = await razorpay.orders.create(options);

      console.log(razorpayorder, "razorpayorder razorpayorder");
    }

    const order = {
      user_id: userId,
      order_status_id: IDS.order_status.Pending,
      address_id,
      no_of_item: order_summary?.no_of_item,
      invoice_no: invoice_number,
      delivery_charges: order_summary.total_delivery_charges,
      payment_method_id,
      total_coupon_discount: order_summary.total_coupon_discount,
      total_offer_discount: order_summary.total_offer_discount,
      total_amount: order_summary.total_amount,
      total_tax: order_summary.total_tax,
      total_mrp: order_summary.total_mrp,
      reward_discount: order_summary.reward_discount,
      total_selling_price: order_summary.total_selling_price,
      total_addon_price: order_summary.total_addon_price,
      total_lense_price: order_summary.total_lense_price,
      total_discount: order_summary.total_discount,
      lens_tax: order_summary.total_lense_tax,
      lens_discount: order_summary.total_lense_discount,
      lens_mrp: order_summary.total_lense_mrp,
    };
    if (razorpayorder) {
      order.razorpay_order_id = razorpayorder?.id;
    }

    if (gst_number) {
      order.gst_number = gst_number;
    }
    const user_wallet = await CheckExits(Wallet, { user_id: userId }, t);

    const newOrder = await Product_Order.create(order, { transaction: t });

    for (const item of order_Details_summary) {
      const existingStock = await Product.findOne({
        where: { id: item.product_id },
        transaction: t,
      });

      // const selectedBatch = await Product_Stock.findOne({
      //   attributes: ["id", "general_stock"],
      //   include: [
      //     { model: Receiving_Product },
      //     { model: Receiving, attributes: ["batch_no"] },
      //     {
      //       model: Stocks,
      //       where: { stock_status_id: IDS?.StockStatus?.Available },
      //     },
      //   ],
      //   where: {
      //     product_id: item.product_id,
      //     general_stock: { [Op.gt]: 0 },
      //   },
      //   transaction: t,
      //   order: [["id", "ASC"]],
      // });
      let stock = await Stocks.findOne({
        where: {
          product_id: item.product_id,
          stock_status_id: IDS?.StockStatus?.Available,
        },
        transaction: t,
      });
      if (stock) {
        await UpdateData(
          Stocks,
          {
            stock_status_id: IDS?.StockStatus?.Selled,
          },
          { id: stock.id },
          t,
        );
        await CreateNew(
          Stock_History,
          {
            stock_id: stock?.id,
            name: "Stock sale",
          },
          t,
        );
      } else {
        stock = await Stocks.create(
          {
            product_id: item.product_id,
            stock_status_id: IDS?.StockStatus?.Dummy,
          },
          { transaction: t },
        );
        await CreateNew(
          Stock_History,
          {
            stock_id: stock?.id,
            name: "Stock add dummy",
          },
          t,
        );
      }
      const newGeneralStock =
        Number(existingStock?.available_stock) - Number(item?.quantity);

      await UpdateData(
        Product,
        {
          available_stock: newGeneralStock,
        },
        { id: item.product_id },
        t,
      );
      let lensstock;
      if (item.lense_id) {
        const existingLenseStock = await Product.findOne({
          where: { id: item.lense_id },
          transaction: t,
        });
        lensstock = await Stocks.findOne({
          where: {
            product_id: item.lense_id,
            stock_status_id: IDS?.StockStatus?.Available,
          },
          transaction: t,
        });
        if (lensstock) {
          await UpdateData(
            Stocks,
            {
              stock_status_id: IDS?.StockStatus?.Selled,
            },
            { id: stock.id },
            t,
          );
          await CreateNew(
            Stock_History,
            {
              stock_id: lensstock?.id,
              name: "Stock sale",
            },
            t,
          );
        } else {
          lensstock = await Stocks.create(
            {
              product_id: item.lense_id,
              stock_status_id: IDS?.StockStatus?.Dummy,
            },
            { transaction: t },
          );
          await CreateNew(
            Stock_History,
            {
              stock_id: lensstock?.id,
              name: "Stock add dummy",
            },
            t,
          );
        }
        const newLenseStock =
          Number(existingLenseStock?.available_stock) - Number(item?.quantity);
        await UpdateData(
          Product,
          {
            available_stock: newLenseStock,
          },
          { id: item.lense_id },
          t,
        );
      }

      const invoice_number = await findUniqueinvoicenumberOrderDetails();
      await CreateNew(
        Product_Order_Detail,
        {
          invoice_no: invoice_number,
          order_id: newOrder?.id,
          product_id: item.product_id,
          // variant_id: item.variant_id,
          quantity: item.quantity,
          total_selling_price: item.total_selling_price,
          total_tax: item.total_tax,
          total_amount: item.total_amount,
          total_mrp: item.total_mrp,
          selling_price: item.selling_price,
          prescription_id: item.prescription_id,
          reward_discount: item.reward_discount,
          mrp: item.mrp,
          coupon_discount: item.coupon_discount,
          offer_discount: item.offer_discount,
          total_discount: item.total_discount,
          delivery_charges: item.delivery_charge,
          packing_charges: item.packing_charge,
          total_tax: item.total_tax,
          refer_discount: item.refer_discount,
          total_addon_price: item.total_addon_price,
          total_lense_price: item.total_lense_price,
          // batch_no: selectedBatch?.Receiving?.batch_no,
          // stock_id: item.barcode_status ? null : stock?.id,
          stock_id: stock?.id,
          lense_stock_id: item.lense_id ? lensstock?.id : null,
          status: true,
          tax_percentage: item.tax_percentage,
          discount_percentage: item.discount_percentage,
        },
        t,
      );

      if (item.prescription_id) {
        await UpdateData(
          Prescriptions,
          {
            selling_price: item.total_lense_price,
            mrp: item.total_lense_mrp,
            coupon_discount: item.lense_coupon_discount,
            tax_amount: item.total_lense_tax,
            discount: item.total_lense_discount,
            lense_tax_percentage: item.lense_tax_percentage,
            lense_discount_percentage: item.lense_discount_percentage,
          },
          { id: item.prescription_id },
          t,
        );
      }
    }

    {
      // reward amount apply
      if (parseFloat(order_summary?.reward_discount) > 0) {
        await UpdateData(
          Wallet,
          {
            amount:
              parseFloat(user_wallet.amount) -
              parseFloat(order_summary.reward_discount),
          },
          { user_id: userId },
          t,
        );

        const walletHistory = {
          wallet_id: user_wallet?.id,
          order_id: newOrder?.id,
          type: IDS?.Wallet_type?.Referral,
          transaction_type_id: IDS?.Transaction_type?.Debit,
          amount: order_summary.reward_discount,
          purchase_amount: order_summary?.total_amount,
          description: "Order Reward Discount",
        };
        await CreateNew(Wallet_History, walletHistory, t);
      }
    }

    {
      //refer reward
      const UsersRefer = await CheckExits(Users_Refer, { refer_to: userId }, t);
      const orderCount = await Product_Order.count({
        where: { user_id: userId },
        transaction: t,
      });

      if (
        UsersRefer &&
        orderCount === 1 &&
        Number(appsetup?.minimum_order) <= Number(order_summary?.total_amount)
      ) {
        const refWallet = await Wallet.findOne({
          where: { user_id: UsersRefer.refer_by },
          transaction: t,
        });

        const currentAmount = parseFloat(refWallet?.amount || 0);
        const rewardAmount = parseFloat(appsetup.refer_percentage);

        await UpdateData(
          Wallet,
          {
            amount: Number(currentAmount + rewardAmount).toFixed(2),
          },
          { id: refWallet?.id },
          t,
        );

        const walletHistory = {
          wallet_id: refWallet?.id,
          order_id: newOrder?.id,
          type: IDS.Wallet_type?.Referral,
          transaction_type_id: IDS?.Transaction_type?.Credit,
          amount: rewardAmount,
          purchase_amount: order_summary?.total_amount,
          description: "Referal amount Credit",
        };
        await CreateNew(Wallet_History, walletHistory, t);
      }
    }

    if (order_summary.coupon_applied) {
      await CreateNew(
        Coupon_History,
        {
          order_id: newOrder?.id,
          user_id: userId,
          coupon_id: order_summary.coupon?.id,
          discount_price: order_summary.total_coupon_discount,
        },
        t,
      );
    }

    {
      // reward amount add
      const rewardAmount =
        parseFloat(order_summary.total_amount) *
        (Number(appsetup?.reward_discount) / 100);
      const userwalletupdate = await CheckExits(Wallet, { user_id: userId }, t);
      await UpdateData(
        Wallet,
        {
          amount:
            parseFloat(userwalletupdate.amount) + parseFloat(rewardAmount),
        },
        { user_id: userId },
        t,
      );

      const walletHistory = {
        wallet_id: user_wallet?.id,
        order_id: newOrder?.id,
        transaction_type_id: IDS?.Transaction_type?.Credit,
        transaction_type: "credit",
        amount: rewardAmount,
        purchase_amount: order_summary?.total_amount,
        description: "Order Reward Credit",
      };
      await CreateNew(Wallet_History, walletHistory, t);
    }

    await CreateNew(Order_History, { order_id: newOrder?.id }, t);

    const datanotification = {
      message: `A new order has been placed by ${customer.name}. Invoice No: ${newOrder.invoice_no}.`,
      status: true,
      seen_status: false,
    };
    await CreateNew(Admin_Notifiction, datanotification, t);
    await CreateNew(
      Advance_Payment,
      {
        product_order_id: newOrder?.id,
        amount: order_summary?.total_amount,
        payment_method_id,
      },
      t,
    );

    await CreateNew(
      Order_Payment_Detail,
      {
        payment_method_id,
        order_id: newOrder?.id,
        payment_id: payment_id,
        amount: order.total_amount,
      },
      t,
    );
    if (Number(payment_method_id) !== Number(IDS.PaymentMethods.Online)) {
      await Cart.destroy({
        where: { user_id: req?.user?.user_id },
        transaction: t,
      });
    }
    await t.commit();
    Base.sendResponse(res, HTTPS.CREATED, newOrder);

    if (Number(payment_method_id) !== Number(IDS.PaymentMethods.Online)) {
      const pdf = await InvoiceGenerater(newOrder?.id);
      // await mailOrder(
      //   appsetup?.email,
      //   newOrder?.invoice_no,
      //   customer?.name,
      //   order_summary?.total_amount,
      // );
      const subject = "🛒 Order Confirmed – Thank you for your purchase!";

      const message = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color:#28a745;">Order Confirmed ✅</h2>

      <p>Hi <b>${customer.name}</b>,</p>

      <p>Thank you for placing your order with us. Your order has been successfully confirmed.</p>

      <table style="border-collapse: collapse; width: 100%; margin-top: 15px;">
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><b>Order ID</b></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${newOrder.invoice_no}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><b>Total Amount</b></td>
          <td style="border: 1px solid #ddd; padding: 8px;">₹${newOrder.total_amount}</td>
        </tr>
      </table>

      <p style="margin-top: 20px;">
        📦 We will notify you once your order is Delivered.
      </p>

      <p>
        If you have any questions, feel free to contact our support team.
      </p>

      <br/>
      <p>Thanks & Regards,<br/>
      <b>Bapat Optics</b></p>
    </div>
  `;

      const messagewhat = `
🛍️ 𝗬𝗼𝘂𝗿 𝗢𝗿𝗱𝗲𝗿 𝗶𝘀 𝗖𝗼𝗻𝗳𝗶𝗿𝗺𝗲𝗱 with Bapat Optics ✅

Hey ${customer.name} 👋

Thank you for shopping with us! Your order has been successfully confirmed. ✨

📦 Order Details
🆔 Order ID: ${newOrder.invoice_no}
💰 Total Amount: ₹${newOrder.total_amount}

🚚 Delivery Update
We will notify you once your order is delivered.

Need Help?
📞 Contact our support team anytime for assistance.

💛 Thanks & Regards,
Bapat Optics
👓 Quality Vision, Trusted Care
`;
      // sendWatsappMessage(customer, messagewhat);
      // commonMail(customer.email, subject, message);
    }
  } catch (error) {
    await t.rollback();
    console.error("Error creating Order:", error);
    return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
  }
};

const crypto = require("crypto");

exports.PaymentWebhook = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const razorpaySignature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (razorpaySignature !== expectedSignature) {
      console.log("Invalid Razorpay Webhook Signature");
      return res.status(400).send("Invalid signature");
    }

    const event = req.body.event;

    if (event === "payment.captured") {
      const payment = req.body.payload.payment.entity;

      const razorpay_payment_id = payment.id;
      const razorpay_order_id = payment.order_id;
      const amount = payment.amount / 100;

      const order = await Product_Order.findOne({
        where: { razorpay_order_id },
        transaction: t,
      });

      if (!order) {
        await t.rollback();
        return res.status(404).send("Order not found");
      }

      await Order_Payment_Detail.update(
        {
          payment_id: razorpay_payment_id,
          amount: amount,
        },
        {
          where: { order_id: order.id },
          transaction: t,
        },
      );

      await Product_Order.update(
        { status: true },
        {
          where: { id: order.id },
          transaction: t,
        },
      );

      await Cart.destroy({
        where: { user_id: order.user_id },
        transaction: t,
      });

      await t.commit();

      console.log("Order updated successfully");
    }

    res.status(200).json({ status: "ok" });
  } catch (error) {
    await t.rollback();
    console.error("Webhook Error:", error);
    res.status(500).send(error.message);
  }
};

exports.PaymentAfterOnline = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const userId = req?.user?.user_id;
    const newOrder = await CheckExits(Product_Order, { id: id }, t);

    if (!newOrder) {
      await t.rollback();
      return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Order Not Found");
    }

    const datapayment = {
      // payment_method_id: req?.body?.payment_method_id,
      payment_id: req?.body?.payment_id,
      amount: newOrder?.total_amount,
    };
    await UpdateData(
      Order_Payment_Detail,
      datapayment,
      { order_id: req?.params?.id },
      t,
    );
    const customer = await Users.findOne({
      where: { id: userId },
      transaction: t,
    });
    await capturePayment({
      payment_id: req?.body?.payment_id,
      amount: 1 || newOrder?.total_amount,
    });

    const data = {
      // payment_method_id: req?.body?.payment_method_id,
      status: true,
    };
    await UpdateData(Product_Order, data, { id: req?.params?.id }, t);

    await Cart.destroy({
      where: { user_id: req?.user?.user_id },
      transaction: t,
    });

    const appsetup = await App_Setup.findOne({
      transaction: t,
    });
    await t.commit();
    Base.sendResponse(res, HTTPS.ACCEPTED, "Order create successfully");

    //     const pdf = await InvoiceGenerater(newOrder?.id);
    //     await mailOrder(
    //       appsetup?.email,
    //       newOrder?.invoice_no,
    //       customer?.name,
    //       order_summary?.total_amount,
    //     );
    //     const subject = "🛒 Order Confirmed – Thank you for your purchase!";

    //     const message = `
    //     <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    //       <h2 style="color:#28a745;">Order Confirmed ✅</h2>

    //       <p>Hi <b>${customer.name}</b>,</p>

    //       <p>Thank you for placing your order with us. Your order has been successfully confirmed.</p>

    //       <table style="border-collapse: collapse; width: 100%; margin-top: 15px;">
    //         <tr>
    //           <td style="border: 1px solid #ddd; padding: 8px;"><b>Order ID</b></td>
    //           <td style="border: 1px solid #ddd; padding: 8px;">${newOrder.invoice_no}</td>
    //         </tr>
    //         <tr>
    //           <td style="border: 1px solid #ddd; padding: 8px;"><b>Total Amount</b></td>
    //           <td style="border: 1px solid #ddd; padding: 8px;">₹${newOrder.total_amount}</td>
    //         </tr>
    //       </table>

    //       <p style="margin-top: 20px;">
    //         📦 We will notify you once your order is Delivered.
    //       </p>

    //       <p>
    //         If you have any questions, feel free to contact our support team.
    //       </p>

    //       <br/>
    //       <p>Thanks & Regards,<br/>
    //       <b>Bapat Optics</b></p>
    //     </div>
    //   `;

    //     const messagewhat = `
    // 🛍️ 𝗬𝗼𝘂𝗿 𝗢𝗿𝗱𝗲𝗿 𝗶𝘀 𝗖𝗼𝗻𝗳𝗶𝗿𝗺𝗲𝗱 with Bapat Optics ✅

    // Hey ${customer.name} 👋

    // Thank you for shopping with us! Your order has been successfully confirmed. ✨

    // 📦 Order Details
    // 🆔 Order ID: ${newOrder.invoice_no}
    // 💰 Total Amount: ₹${newOrder.total_amount}

    // 🚚 Delivery Update
    // We will notify you once your order is delivered.

    // Need Help?
    // 📞 Contact our support team anytime for assistance.

    // 💛 Thanks & Regards,
    // Bapat Optics
    // 👓 Quality Vision, Trusted Care
    // `;
    //     sendWatsappMessage(customer, messagewhat);
    //     commonMail(customer.email, subject, message);
  } catch (error) {
    await t.rollback();
    console.error("Error updating Order:", error);
    return Base.sendError(
      res,
      HTTPS.INTERNAL_SERVER_ERROR,
      error.message || error,
    );
  }
};

exports.CalculationOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { coupon_id, selected_id, reward_status } = req.body;
    const userId = req?.user?.user_id;

    // Fetch cart items (selected or all)
    let cartListItems;
    const cartWhere = { user_id: userId };
    if (selected_id && Array.isArray(selected_id) && selected_id.length > 0) {
      cartWhere.id = selected_id;
    }

    cartListItems = await Cart.findAll({
      include: [
        {
          model: Product,
          include: [
            {
              model: Offered_Product,
              required: false,
              where: { status: true },
              include: [{ model: Offer, include: [Discount_Type] }],
            },
            { model: p_category, paranoid: false },
            { model: Brand, paranoid: false },
          ],
        },
        {
          model: Prescriptions,
          required: false,
          include: [
            { model: Addon },
            {
              model: Product,
              as: "Lense",
              include: [
                { model: Brand, paranoid: false },
                { model: p_category, paranoid: false },
              ],
            },
            { model: LensType },
          ],
        },
      ],
      where: cartWhere,
      transaction: t,
    });

    if (!cartListItems || cartListItems.length === 0) {
      await t.rollback();
      return Base.sendResponse(res, HTTPS.NOT_FOUND, "No Cart Found");
    }

    const appsetup = await App_Setup.findOne({}, { transaction: t });
    const user = await Users.findOne({ where: { id: userId }, transaction: t });
    const wallet = await Wallet.findOne({
      where: { user_id: userId },
      transaction: t,
    });

    const order = { no_of_item: cartListItems.length };

    let total_mrp = 0;
    let total_discount = 0;
    let total_addon_price = 0;
    let total_lense_price = 0;
    let total_lense_mrp = 0;
    let total_lense_discount = 0;
    let total_lense_tax = 0;
    let total_selling_price = 0;
    let totalOfferDiscount = 0;
    let totalCouponDiscount = 0;
    let deliveryCharges = parseFloat(appsetup?.delivery_price || 0);

    const productSubtotals = [];

    for (const cartItem of cartListItems) {
      const quantity = Number(cartItem?.quantity || 0);
      const product = cartItem?.Product || {};
      const prescription = cartItem?.Prescription || null;
      const lense = prescription?.Lense || null;

      const mrp = parseFloat(product?.mrp || 0);
      // const selling_price = parseFloat(product?.price || 0);
      const selling_price = parseFloat(product?.base_amount || 0);
      const discount = parseFloat(product?.discount_amount || 0);
      const taxamount = parseFloat(product?.tax_amount ?? 0);
      const tax = taxamount * quantity;
      const taxPercentage = parseFloat(product?.tax_percentage || 0) || 0;
      const discountPercentage = parseFloat(product?.discount || 0) || 0;

      const addon_price_each = parseFloat(prescription?.Addon?.price || 0);
      const lense_price = parseFloat(lense?.price || 0);
      const lense_mrp = parseFloat(lense?.mrp || 0);
      const lense_discount = parseFloat(lense?.discount_amount || 0);
      const lense_tax = parseFloat(lense?.tax_amount || 0);

      const lenseTaxPercentage = parseFloat(lense?.tax_percentage || 0);
      const lensediscountPercentage = parseFloat(lense?.discount || 0);

      const totalMrp = quantity * mrp;
      const totalSellingPrice = quantity * selling_price;
      const totalAddOnPrice = quantity * addon_price_each;
      const totalLensePrice = quantity * lense_price;

      let bapatofferDiscount = 0;
      let discountTypeId = 0;

      productSubtotals.push({
        cart_id: cartItem.id,
        product_id: cartItem.product_id,
        barcode_status: product?.barcode_status || null,
        variant_id: cartItem.variant_id || null,
        brand_id: product?.Brand?.id || null,
        category_id: product?.p_category?.id || null,
        base_subtotal: totalSellingPrice,
        lense_id: lense?.id || null,
        lense_brand_id: lense?.Brand?.id || null,
        lense_category_id: lense?.p_category?.id || null,
        lense_selling_price: totalLensePrice,
        lense_discount: lense_discount,
        lense_price: lense_price,
        lense_mrp: lense_mrp,
        lense_tax: lense_tax,
        quantity,
        mrp: mrp,
        selling_price: selling_price,
        tax: tax,
        addon_price: totalAddOnPrice,
        lense_price: totalLensePrice,
        tax_percentage: taxPercentage,
        discount_percentage: discountPercentage,
        lense_tax_percentage: lenseTaxPercentage,
        lense_discount_percentage: lensediscountPercentage,

        offer_discount: bapatofferDiscount,
        discount_type: discountTypeId,
        coupon_discount: 0,
        lense_coupon_discount: 0,
        discount: discount,

        total_mrp: totalMrp,
        total_selling_price: totalSellingPrice,
        total_discount: discount,
        prescription_id: cartItem.prescription_id || null,
      });

      total_mrp += totalMrp;
      total_discount += discount;
      total_addon_price += totalAddOnPrice;
      total_lense_price += totalLensePrice;
      total_lense_discount += lense_discount;
      total_lense_tax += lense_tax;
      total_lense_mrp += lense_mrp;
      total_selling_price += totalSellingPrice;
      totalOfferDiscount += bapatofferDiscount;
    }

    let couponApplied = false;
    let couponMessage = null;
    let coupon = null;
    if (coupon_id) {
      coupon = await Coupon.findOne({
        include: [{ model: Coupon_Type }, { model: Coupon_Brand }],
        where: { id: coupon_id },
        transaction: t,
      });

      if (!coupon) {
        couponMessage = "Invalid coupon";
      } else {
        couponApplied = true;
      }
    }

    if (couponApplied && coupon) {
      const eligibleFrameProducts = [];
      const eligibleLensProducts = [];

      let couponLensIds = null;
      if (coupon.lense_ids) {
        try {
          if (typeof coupon.lense_ids === "string") {
            couponLensIds = JSON.parse(coupon.lense_ids);
          } else if (Array.isArray(coupon.lense_ids)) {
            couponLensIds = coupon.lense_ids;
          }
        } catch (e) {
          // fallback: if comma separated
          if (typeof coupon.lense_ids === "string") {
            couponLensIds = coupon.lense_ids
              .split(",")
              .map((v) => Number(v.trim()))
              .filter(Boolean);
          }
        }
      }

      for (const item of productSubtotals) {
        // skip items that already have an offer discount
        if ((item.offer_discount || 0) > 0) continue;

        const frameBrand = item.brand_id;
        const frameCategory = item.category_id;
        const lensBrand = item.lense_brand_id;
        const lensCategory = item.lense_category_id;
        const lensId = item.lense_id;

        const ctypeId = coupon.Coupon_Type?.id;

        // if (ctypeId === IDS.CouponTypeId.Brand) {
        //   if (frameBrand && frameBrand === coupon.brand_id)
        //     eligibleFrameProducts.push(item);
        //   if (lensBrand && lensBrand === coupon.brand_id)
        //     eligibleLensProducts.push(item);
        //   // Also if coupon specifically lists lens ids and this lens matches, add to lens bucket
        //   if (couponLensIds && lensId && couponLensIds.includes(Number(lensId)))
        //     eligibleLensProducts.push(item);
        // }

        // else if (ctypeId === IDS.CouponTypeId.Categoty) {
        //   if (frameCategory && frameCategory === coupon.category_id)
        //     eligibleFrameProducts.push(item);
        //   if (lensCategory && lensCategory === coupon.category_id)
        //     eligibleLensProducts.push(item);
        //   if (couponLensIds && lensId && couponLensIds.includes(Number(lensId)))
        //     eligibleLensProducts.push(item);
        // }
        const couponBrandIds =
          coupon.Coupon_Brands?.map((b) => Number(b.brand_id)) || [];
        const hasBrandFilter = couponBrandIds.length > 0;

        if (ctypeId === IDS.CouponTypeId.Categoty) {
          // ---------- FRAME ----------
          const frameBrandMatch = hasBrandFilter
            ? frameBrand && couponBrandIds.includes(Number(frameBrand))
            : true; // no brand filter → allow all

          if (
            frameBrandMatch &&
            frameCategory &&
            frameCategory === coupon.category_id
          ) {
            eligibleFrameProducts.push(item);
          }

          // ---------- LENS ----------
          const lensBrandMatch = hasBrandFilter
            ? lensBrand && couponBrandIds.includes(Number(lensBrand))
            : true;

          if (
            lensBrandMatch &&
            lensCategory &&
            lensCategory === coupon.category_id
          ) {
            eligibleLensProducts.push(item);
          }

          if (
            couponLensIds &&
            lensId &&
            couponLensIds.includes(Number(lensId))
          ) {
            eligibleLensProducts.push(item);
          }
        } else if (
          ctypeId === IDS.CouponTypeId.Global ||
          ctypeId === IDS.CouponTypeId.DateWise
        ) {
          eligibleFrameProducts.push(item);
          eligibleLensProducts.push(item);
        }
      }

      const totalFrame = eligibleFrameProducts.reduce(
        (s, p) => s + (p.total_mrp || 0),
        0,
      );
      const totalLens = eligibleLensProducts.reduce(
        (s, p) => s + (p.lense_mrp || 0),
        0,
      );

      const applyFrameDiscount = totalFrame > 0;
      const applyLensDiscount = totalLens > 0;

      if (applyFrameDiscount) {
        for (const item of eligibleFrameProducts) {
          let d = 0;
          const itemBase = item.total_mrp || 0;

          if (coupon.discount_type_id === IDS.discountTypes.percentage) {
            const percent = parseFloat(coupon.discount) || 0;

            d = (itemBase * percent) / 100;
          } else {
            const flat = parseFloat(coupon.discount) || 0;
            d = (itemBase / totalFrame) * flat;
          }

          item.coupon_discount = (item.coupon_discount || 0) + Number(d);
          totalCouponDiscount += Number(d);
        }
      }

      if (applyLensDiscount) {
        for (const item of eligibleLensProducts) {
          let ld = 0;
          const lensBase = item.lense_mrp || 0;

          if (coupon.discount_type_id === IDS.discountTypes.percentage) {
            const percent = parseFloat(coupon.discount) || 0;
            ld = (lensBase * percent) / 100;
          } else if (
            coupon.Coupon_Type?.id === IDS.CouponTypeId.Brand ||
            coupon.Coupon_Type?.id === IDS.CouponTypeId.Categoty
          ) {
            const flat = parseFloat(coupon.discount) || 0;
            ld = (lensBase / totalLens) * flat;
          }

          item.lense_coupon_discount =
            (item.lense_coupon_discount || 0) + Number(ld);
          totalCouponDiscount += Number(ld);
        }
      }

      if (!applyFrameDiscount && !applyLensDiscount) {
        couponMessage =
          couponMessage || "Coupon not applicable to selected items";
      }
    }

    let total_tax = 0;
    let total_amount_before_reward = 0;

    const orderDetails = productSubtotals.map((item) => {
      const frameCoupon = Number(item.coupon_discount || 0);
      const lensCoupon = Number(item.lense_coupon_discount || 0);

      const baseAfterFrameDiscount =
        (item.base_subtotal || 0) -
        Number(item.offer_discount || 0) -
        frameCoupon;

      const lenseAfterLensDiscount =
        (item.lense_selling_price || 0) - lensCoupon;

      const productDeliveryCharge = (deliveryCharges || 0) / order.no_of_item;
      total_tax += Number(item.tax || 0);

      const productFinalAmount =
        Number(baseAfterFrameDiscount || 0) +
        Number(lenseAfterLensDiscount || 0) +
        Number(item.tax || 0) +
        Number(item.lense_tax || 0) +
        Number(item.addon_price || 0) +
        Number(productDeliveryCharge || 0);

      total_amount_before_reward += Number(productFinalAmount || 0);

      return {
        cart_id: item.cart_id,
        product_id: item.product_id,
        barcode_status: item.barcode_status,
        prescription_id: item.prescription_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        mrp: Number(item.mrp || 0).toFixed(2),
        selling_price: Number(item.selling_price || 0).toFixed(2),
        total_mrp: Number(item.total_mrp || 0).toFixed(2),
        total_selling_price: Number(item.total_selling_price || 0).toFixed(2),
        total_discount: Number(item.total_discount || 0).toFixed(2),
        offer_discount: Number(item.offer_discount || 0).toFixed(2),
        coupon_discount: Number(frameCoupon || 0).toFixed(2),
        lense_coupon_discount: Number(lensCoupon || 0).toFixed(2),

        total_tax: Number(item.tax || 0).toFixed(2),
        discount_type: Number(item.discount_type || 0),
        delivery_charge: Number(productDeliveryCharge || 0).toFixed(2),
        reward_discount: 0,
        total_amount: Number(productFinalAmount || 0).toFixed(2),
        total_addon_price: Number(item.addon_price || 0).toFixed(2),
        total_lense_price: Number(item.lense_price || 0).toFixed(2),
        total_lense_tax: Number(item.lense_tax || 0).toFixed(2),
        total_lense_mrp: Number(item.lense_mrp || 0).toFixed(2),
        total_lense_discount: Number(item.lense_discount || 0).toFixed(2),

        tax_percentage: Number(item.tax_percentage || 0).toFixed(2),
        discount_percentage: Number(item.discount_percentage || 0).toFixed(2),
        lense_tax_percentage: Number(item.lense_tax_percentage || 0).toFixed(2),
        lense_discount_percentage: Number(
          item.lense_discount_percentage || 0,
        ).toFixed(2),
        lense_id: item.lense_id || null,
      };
    });

    let rewardDiscount = 0;
    if (reward_status && wallet?.amount > 0 && total_amount_before_reward > 0) {
      const halfOrder = total_amount_before_reward / 2;
      if (wallet.amount >= halfOrder) {
        rewardDiscount = halfOrder;
      } else {
        rewardDiscount = wallet.amount;
      }

      for (const detail of orderDetails) {
        const proportion =
          Number(detail.total_amount) / total_amount_before_reward || 0;
        const rewardPerProduct = rewardDiscount * proportion;
        detail.reward_discount = Number(rewardPerProduct || 0).toFixed(2);
        detail.total_amount = (
          Number(detail.total_amount) - Number(rewardPerProduct || 0)
        ).toFixed(2);
      }
    }

    const finalAmount =
      Number(total_amount_before_reward) - Number(rewardDiscount || 0);

    order.total_mrp = Number(total_mrp || 0).toFixed(2);
    order.total_discount = Number(total_discount || 0).toFixed(2);
    order.total_addon_price = Number(total_addon_price || 0).toFixed(2);
    order.total_lense_price = Number(total_lense_price || 0).toFixed(2);
    order.total_lense_mrp = Number(total_lense_mrp || 0).toFixed(2);
    order.total_lense_discount = Number(total_lense_discount || 0).toFixed(2);
    order.total_lense_tax = Number(total_lense_tax || 0).toFixed(2);
    order.total_selling_price = Number(total_selling_price || 0).toFixed(2);
    order.total_tax = Number(total_tax || 0).toFixed(2);
    order.total_delivery_charges = Number(deliveryCharges || 0).toFixed(2);
    order.total_offer_discount = Number(totalOfferDiscount || 0).toFixed(2);
    order.total_coupon_discount = Number(totalCouponDiscount || 0).toFixed(2);
    order.reward_discount = Number(rewardDiscount || 0).toFixed(2);
    order.total_amount = Number(finalAmount || 0).toFixed(2);
    order.reward_status = reward_status ? true : false;
    order.selected_id = selected_id || null;
    order.coupon_applied = couponApplied;
    if (couponMessage) order.message = couponMessage;
    if (couponApplied && coupon) order.coupon = coupon;

    await t.commit();

    return Base.sendResponse(res, HTTPS.OK, {
      order_summary: order,
      order_Details_summary: orderDetails,
      message: "Order calculation successful",
    });
  } catch (error) {
    await t.rollback();
    console.error("Error calculating order:", error);
    return Base.sendError(
      res,
      HTTPS.INTERNAL_SERVER_ERROR,
      error?.message || error,
    );
  }
};

// exports.CalculationOrder = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const { coupon_id, selected_id, reward_status } = req.body;
//     const userId = req?.user?.user_id;

//     let cartListItems;
//     if (selected_id && selected_id.length > 0) {
//       cartListItems = await Cart.findAll({
//         include: [
//           {
//             model: Product,
//             include: [
//               {
//                 model: Offered_Product,
//                 required: false,
//                 where: { status: true },
//                 include: [{ model: Offer, include: [Discount_Type] }],
//               },
//               { model: p_category, paranoid: false },
//               { model: Brand, paranoid: false },
//             ],
//           },
//           {
//             model: Prescriptions,
//             required: false,
//             include: [
//               { model: Addon },
//               { model: Product, as: "Lense" },
//               { model: LensType },
//             ],
//           },
//         ],
//         where: {
//           user_id: userId,
//           id: selected_id,
//         },
//         transaction: t,
//       });
//     } else {
//       cartListItems = await Cart.findAll({
//         include: [
//           {
//             model: Product,
//             include: [
//               {
//                 model: Offered_Product,
//                 model: Offered_Product,
//                 required: false,
//                 where: { status: true },
//                 include: [{ model: Offer, include: [Discount_Type] }],
//               },
//               { model: p_category, paranoid: false },
//               { model: Brand, paranoid: false },
//             ],
//           },
//           {
//             model: Prescriptions,
//             required: false,
//             include: [
//               { model: Addon },
//               { model: Product, as: "Lense" },
//               { model: LensType },
//             ],
//           },
//         ],
//         where: { user_id: userId },
//         transaction: t,
//       });
//     }

//     if (!cartListItems || cartListItems.length === 0) {
//       await t.rollback();
//       return Base.sendResponse(res, HTTPS.NOT_FOUND, "No Cart Found");
//     }

//     const appsetup = await App_Setup.findOne({});
//     const user = await Users.findOne({ where: { id: userId } });
//     const wallet = await Wallet.findOne({ where: { user_id: userId } });

//     const order = { no_of_item: cartListItems.length };
//     let total_mrp = 0;
//     let total_addon_price = 0;
//     let total_lense_price = 0;
//     let total_selling_price = 0;
//     let totalOfferDiscount = 0;
//     let totalCouponDiscount = 0;
//     let deliveryCharges = parseFloat(appsetup.delivery_price);

//     const productSubtotals = [];

//     // Step 1: Base Totals + Bapat Offer
//     for (const item of cartListItems) {
//       const quantity = item?.quantity || 0;
//       const mrp = parseFloat(item?.Product?.mrp || 0);
//       const selling_price = parseFloat(item?.Product?.price || 0);
//       const taxamount = parseFloat(item?.Product?.tax_amount ?? 0);
//       const tax = taxamount * quantity;
//       const taxPercentage = parseInt(item?.Product?.tax_percentage || 0);

//       const addon_price = parseFloat(item?.Prescription?.Addon?.price || 0);
//       const lense_price = parseFloat(item?.Prescription?.Lense?.price || 0);
//       const totalMrp = quantity * mrp;
//       const totalSellingPrice = quantity * selling_price;
//       const totalAddOnPrice = quantity * addon_price;
//       const totalLensePrice = quantity * lense_price;
//       let bapatofferDiscount = 0;
//       let discountTypeId = 0;

//       // const offeredProduct = item.Product?.Offered_Product;
//       // if (offeredProduct && offeredProduct.Offer?.discount) {
//       //   const discountValue = parseFloat(offeredProduct.Offer?.discount);
//       //   discountTypeId = offeredProduct.Offer?.Discount_Type?.id || 1;

//       //   if (discountTypeId === IDS.CouponType.Percentage) {
//       //     bapatofferDiscount = (totalSellingPrice * discountValue) / 100;
//       //   } else {
//       //     bapatofferDiscount = discountValue * quantity;
//       //   }
//       //   totalOfferDiscount += bapatofferDiscount;
//       // }

//       productSubtotals.push({
//         product_id: item.product_id,
//         barcode_status: item?.Product?.barcode_status,
//         variant_id: item.variant_id,
//         brand_id: item.Product?.Brand?.id,
//         category_id: item.Product?.p_category?.id,
//         quantity,
//         mrp,
//         selling_price,
//         tax: tax,
//         addon_price: totalAddOnPrice,
//         lense_price: totalLensePrice,
//         tax_percentage: taxPercentage,
//         total_mrp: totalMrp,
//         total_selling_price: totalSellingPrice,
//         offer_discount: bapatofferDiscount,
//         discount_type: discountTypeId,
//         base_subtotal: totalSellingPrice,
//         prescription_id: item.prescription_id || null,
//         lense_id: item?.Prescription?.Lense?.id || null,
//       });

//       total_mrp += totalMrp;
//       total_addon_price += totalAddOnPrice;
//       total_lense_price += totalLensePrice;
//       total_selling_price += totalSellingPrice;
//     }

//     let couponApplied = false;
//     let couponMessage = null;
//     let coupon = null;

//     if (coupon_id) {
//       coupon = await Coupon.findOne({
//         include: [{ model: Coupon_Type }],
//         where: { id: coupon_id },
//         transaction: t,
//       });

//       if (!coupon) {
//         couponMessage = "Invalid coupon";
//       } else {
//         couponApplied = true;
//       }
//     }

//     if (couponApplied) {
//       let eligibleProducts = [];

//       for (const item of productSubtotals) {
//         if (item.offer_discount > 0) continue;

//         if (coupon.Coupon_Type.id === IDS.CouponTypeId.Brand) {
//           if (item.brand_id === coupon.brand_id) eligibleProducts.push(item);
//         } else if (coupon.Coupon_Type.id === IDS.CouponTypeId.Categoty) {
//           if (item.category_id === coupon.category_id)
//             eligibleProducts.push(item);
//         } else if (coupon.Coupon_Type.id === IDS.CouponTypeId.Global) {
//           eligibleProducts.push(item);
//         }
//       }

//       const eligibleTotal = eligibleProducts.reduce(
//         (sum, p) => sum + p.total_selling_price,
//         0
//       );

//       for (const item of eligibleProducts) {
//         let productCouponDiscount = 0;

//         if (coupon.discount_type_id === IDS.discountTypes.percentage) {
//           productCouponDiscount =
//             (item.total_selling_price / eligibleTotal) *
//             ((eligibleTotal * coupon.discount) / 100);
//         } else {
//           productCouponDiscount =
//             (item.total_selling_price / eligibleTotal) *
//             parseFloat(coupon.discount);
//         }

//         item.coupon_discount = productCouponDiscount;
//         totalCouponDiscount += productCouponDiscount;
//       }
//     }

//     // Step 3: Calculate orderDetails and total_tax
//     let total_tax = 0;
//     let total_amount_before_reward = 0;

//     const orderDetails = productSubtotals.map((item) => {
//       const couponDiscount = item.coupon_discount || 0;

//       const baseAfterDiscounts =
//         item.base_subtotal - item.offer_discount - couponDiscount;
//       const productDeliveryCharge = deliveryCharges / order.no_of_item;

//       const taxBase = baseAfterDiscounts;
//       // const tax = (taxBase * item.tax_percentage) / 100;
//       total_tax += item.tax;

//       const productFinalAmount =
//         taxBase +
//         item.tax +
//         item.addon_price +
//         item.lense_price +
//         productDeliveryCharge;
//       total_amount_before_reward += productFinalAmount;

//       return {
//         product_id: item.product_id,
//         barcode_status: item.barcode_status,
//         prescription_id: item.prescription_id,
//         variant_id: item.variant_id,
//         quantity: item.quantity,
//         mrp: item.mrp.toFixed(2),
//         selling_price: item.selling_price.toFixed(2),
//         total_mrp: item.total_mrp.toFixed(2),
//         total_selling_price: item.total_selling_price.toFixed(2),
//         offer_discount: item.offer_discount.toFixed(2),
//         coupon_discount: couponDiscount.toFixed(2),
//         tax_percentage: item.tax_percentage.toFixed(2),
//         total_tax: item?.tax.toFixed(2),
//         discount_type: item.discount_type.toFixed(2),
//         delivery_charge: productDeliveryCharge.toFixed(2),
//         reward_discount: 0,
//         total_amount: productFinalAmount,
//         total_addon_price: item.addon_price,
//         total_lense_price: item.lense_price,
//         lense_id: item.lense_id,
//       };
//     });

//     // Step 4: Apply reward discount
//     let rewardDiscount = 0;
//     if (reward_status && wallet?.amount > 0) {
//       const halfOrder = total_amount_before_reward / 2;

//       if (wallet.amount >= halfOrder) {
//         rewardDiscount = halfOrder;
//       } else {
//         rewardDiscount = wallet.amount;
//       }

//       for (const detail of orderDetails) {
//         const proportion = detail.total_amount / total_amount_before_reward;
//         const rewardPerProduct = rewardDiscount * proportion;

//         detail.reward_discount = rewardPerProduct.toFixed(2);
//         detail.total_amount = (detail.total_amount - rewardPerProduct).toFixed(
//           2
//         );
//       }
//     }

//     const finalAmount = total_amount_before_reward - rewardDiscount;

//     order.total_mrp = total_mrp;
//     order.total_addon_price = total_addon_price;
//     order.total_lense_price = total_lense_price;
//     order.total_selling_price = total_selling_price.toFixed(2);
//     order.total_tax = total_tax.toFixed(2);
//     order.total_delivery_charges = deliveryCharges.toFixed(2);
//     order.total_offer_discount = totalOfferDiscount.toFixed(2);
//     order.total_coupon_discount = totalCouponDiscount.toFixed(2);
//     order.reward_discount = rewardDiscount.toFixed(2);
//     order.total_amount = finalAmount.toFixed(2);
//     order.reward_status = reward_status ? true : false;
//     order.selected_id = selected_id;
//     order.coupon_applied = couponApplied;

//     if (couponMessage) order.message = couponMessage;
//     if (couponApplied) order.coupon = coupon;

//     await t.commit();

//     return Base.sendResponse(res, HTTPS.OK, {
//       order_summary: order,
//       order_Details_summary: orderDetails,
//       message: "Order calculation successful",
//     });
//   } catch (error) {
//     await t.rollback();
//     console.error("Error calculating order:", error);
//     return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
//   }
// };

exports.CancelOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const { cancel_reason_id, message, products } = req?.body;

    const order = await Product_Order.findOne({
      include: [
        {
          model: Product_Order_Detail,
          where: { status: true },
          include: [{ model: Product }],
        },
      ],
      where: {
        id: req?.params?.id,
      },
      transaction: t,
    });

    if (!order) {
      await t.rollback();
      return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Order Not Found");
    }

    await CreateNew(
      Order_Cancellation,
      { order_id: id, cancel_reason_id: cancel_reason_id, message: message },
      t,
    );
    await UpdateData(
      Order_History,
      { cancelledAt: new Date() },
      { order_id: id },
      t,
    );
    // console.log(products,'products');

    let total_mrp = 0;
    let total_selling_price = 0;
    let total_amount = 0;
    let delivery_charges = 0;
    let total_tax = 0;
    let total_coupon_discount = 0;
    let total_offer_discount = 0;
    let no_of_item = products.length;
    const customer = await Users.findOne({
      where: { id: order?.user_id },
      transaction: t,
    });
    for (let item of order?.Product_Order_Details) {
      const matched = products.find((p) => p.product_id === item.Product.id);

      const user = await Wallet.findOne({
        where: {
          user_id: order?.user_id,
        },
        transaction: t,
      });

      if (matched) {
        await UpdateData(
          Product_Order_Detail,
          { status: false },
          { order_id: id, product_id: item.Product.id },
          t,
        );

        total_mrp += parseFloat(item.total_mrp);
        total_selling_price += parseFloat(item.total_selling_price);
        total_amount += parseFloat(item.total_amount);
        delivery_charges += parseFloat(item.delivery_charges);
        total_mrp += parseFloat(item.total_mrp);
        total_tax += parseFloat(item.total_tax);
        total_coupon_discount += parseFloat(item.coupon_discount);
        total_offer_discount += parseFloat(item.offer_discount);

        await UpdateData(
          Wallet,
          {
            amount: parseFloat(user.amount) + parseFloat(item.total_amount),
          },
          { user_id: order?.user_id },
          t,
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
          t,
        );
      }

      // await CreateNew(
      //   Payment_Collect_Details,
      //   {
      //     order_details_id: item.id,
      //     payment_collect_id: paymentCollect.id,
      //     collection_status_id: matched?.collection_status_id || null,
      //     product_id: item.product_id,
      //     variant_id: item.variant_id,
      //     quantity: item.quantity,
      //     total_amount: item.total_amount,
      //     total_kg: item.total_kg,
      //     receive_payment: receiveAmount,
      //   },
      //   t
      // );
    }

    if (
      parseFloat(total_amount) > 0 &&
      Number(order.Product_Order_Details.length) !== Number(products.length)
    ) {
      const data = {
        total_mrp: parseFloat(order.total_mrp) - parseFloat(total_mrp),
        total_selling_price:
          parseFloat(order.total_selling_price) -
          parseFloat(total_selling_price),
        total_amount: parseFloat(order.total_amount) - parseFloat(total_amount),
        delivery_charges:
          parseFloat(order.delivery_charges) - parseFloat(delivery_charges),
        total_tax: parseFloat(order.total_tax) - parseFloat(total_tax),
        total_coupon_discount:
          parseFloat(order.total_coupon_discount) -
          parseFloat(total_coupon_discount),
        no_of_item: Number(order.no_of_item) - Number(no_of_item),
        cancel_on_of_item: Number(order.cancel_on_of_item) + no_of_item,
        total_offer_discount: order.total_offer_discount - total_offer_discount,
      };

      await UpdateData(Product_Order, data, { id: id }, t);
    }

    if (order.Product_Order_Details.length === products.length) {
      await UpdateData(
        Product_Order,
        { order_status_id: IDS.order_status.Rejected },
        { id: id },
        t,
      );
    }

    const subject = "Your Order Has Been Cancelled";

    const messagemail = `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <h2 style="color:#dc3545;">Order Cancelled ❌</h2>

    <p>Hi <b>${customer.name}</b>,</p>

    <p>
      Your order has been successfully cancelled as per your request.
      Below are the order details:
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
        <td style="border: 1px solid #ddd; padding: 8px;"><b>Cancellation Date</b></td>
        <td style="border: 1px solid #ddd; padding: 8px;">
          ${new Date().toLocaleDateString()}
        </td>
      </tr>
    </table>

    <p style="margin-top: 20px;">
      💳 If payment was already made, the refund will be processed to your wallet or original payment method within 3–5 business days.
    </p>

    <p>
      If you have any questions or need assistance, please contact our support team.
    </p>

    <br/>
    <p>Warm Regards,<br/>
    <b>Bapat Optics</b></p>
  </div>
`;
    commonMail(customer?.email, subject, messagemail);
    await t.commit();
    return Base.sendResponse(
      res,
      HTTPS.ACCEPTED,
      "Order Cancelled successfully",
    );
  } catch (error) {
    await t.rollback();
    console.error("Error updating Order:", error);
    return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
  }
};

exports.ReturnRepalceOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const { return_reason_id, message, type, images, products } = req?.body;
    const order = await Product_Order.findOne({
      include: [
        {
          model: Product_Order_Detail,
          where: { return_status: true },
          include: [{ model: Product }],
        },
      ],
      where: {
        id: req?.params?.id,
      },
      transaction: t,
    });
    const exists = await CheckExits(Product_Order, { id: id }, t);

    if (!exists) {
      await t.rollback();
      return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Order Not Found");
    }

    await UpdateData(
      Order_History,
      { returnedAt: new Date() },
      { order_id: id },
      t,
    );
    const returnOrder = await CreateNew(
      Return_Order,
      {
        order_id: id,
        return_reason_id,
        message,
        return_status_id: IDS.return_status.ReturnRequested,
      },
      t,
    );
    const user = await Wallet.findOne({
      where: {
        user_id: req.user.user_id,
      },
      transaction: t,
    });
    let total_mrp = 0;
    let total_selling_price = 0;
    let total_amount = 0;
    let delivery_charges = 0;
    let total_tax = 0;
    let total_coupon_discount = 0;
    let total_offer_discount = 0;

    let no_of_item = products?.length;

    for (let item of order?.Product_Order_Details) {
      const matched = products.find((p) => p.product_id === item.Product.id);

      if (matched) {
        total_mrp += parseFloat(item.total_mrp);
        total_selling_price += parseFloat(item.total_selling_price);
        total_amount += parseFloat(item.total_amount);
        delivery_charges += parseFloat(item.delivery_charges);
        total_mrp += parseFloat(item.total_mrp);
        total_tax += parseFloat(item.total_tax);
        total_coupon_discount += parseFloat(item.coupon_discount);
        total_offer_discount += parseFloat(item.offer_discount);

        await UpdateData(
          Wallet,
          {
            amount: parseFloat(user.amount) + parseFloat(item.total_amount),
          },
          { user_id: order?.user_id },
          t,
        );

        await UpdateData(
          Product_Order_Detail,
          { return_status: false },
          { order_id: id, product_id: item.product_id },
          t,
        );

        const data = await CreateNew(
          Return_Order_Details,
          {
            order_details_id: item.id,
            product_id: item.product_id,
            return_order_id: returnOrder.id,
          },
          t,
        );

        const walletHistory = {
          wallet_id: user?.id,
          transaction_type: "credit",
          amount: parseFloat(item.total_amount),
          description: "Order Return",
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
          t,
        );
      }

      if (
        total_amount > 0 &&
        order.Product_Order_Details.length !== products.length
      ) {
        const data = {
          total_mrp: order.total_mrp - total_mrp,
          total_selling_price: order.total_selling_price - total_selling_price,
          total_amount: order.total_amount - total_amount,
          delivery_charges: order.delivery_charges - delivery_charges,
          total_offer_discount:
            order.total_offer_discount - total_offer_discount,
          total_tax: order.total_tax - total_tax,
          total_coupon_discount:
            order.total_coupon_discount - total_coupon_discount,
          // no_of_item: Number(order.no_of_item) - Number(no_of_item),
          return_on_of_item:
            Number(order.return_on_of_item) + Number(no_of_item),
        };

        await UpdateData(Product_Order, data, { id: id }, t);
      }
    }

    const returnOrderUpdate = await UpdateData(
      Return_Order,
      {
        total_mrp: total_mrp,
        total_selling_price: total_selling_price,
        total_tax: total_tax,
        total_offer_discount: total_offer_discount,
        total_coupon_discount: total_coupon_discount,
        no_of_item: no_of_item,
        delivery_charges: delivery_charges,
        total_amount: total_amount,
      },
      { id: returnOrder?.id },
      t,
    );
    // if (
    //   Number(order.Product_Order_Details.length) === Number(products.length)
    // ) {
    //   await UpdateData(
    //     Product_Order,
    //     { order_status_id: IDS.order_status.Returned },
    //     { id: id },
    //     t
    //   );
    // }
    const customer = await Users.findOne({
      where: { id: exists.user_id },
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
        <td style="border: 1px solid #ddd; padding: 8px;">${exists.invoice_no}</td>
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

    commonMail(customer?.email, subject, messagemail);

    await t.commit();
    return Base.sendResponse(res, HTTPS.ACCEPTED, "Order returnt successfully");
  } catch (error) {
    await t.rollback();
    console.error("Error updating Order:", error);
    return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
  }
};

exports.ReOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const existsCart = await CheckExits(
      Cart,
      { user_id: req?.user?.user_id },
      t,
    );
    if (existsCart) {
      await t.rollback();
      return Base.sendError(
        res,
        HTTPS.ALREADY_REPORTED,
        "A cart is in progress. You can delete or continue with the current one",
      );
    }

    const include = [
      {
        model: Users,
      },
      {
        model: Order_status,
      },
      {
        model: Store_Detail,
        include: [
          {
            model: City,
          },
          {
            model: State,
          },

          {
            model: s_category,
          },
        ],
      },
      {
        model: Payment_Type,
      },
      {
        model: User_Address,
      },
      {
        model: Users,
        as: "delivery_boy",
      },
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
      {
        model: Order_History,
      },
      {
        model: Return_Order,
        include: [
          {
            model: Return_Reason,
          },
          {
            model: Users,
          },
        ],
      },
      {
        model: Restaurant_Service,
      },
    ];
    const result = await CheckExits(
      Product_Order,
      { id: req.params.id },
      t,
      include,
    );

    if (!result) {
      await t.rollback();
      return Base.sendError(res, HTTPS.NOT_FOUND, "Order not found");
    }

    for (item of result?.Product_Order_Details) {
      const data = {
        user_id: req?.user?.user_id,
        product_id: Number(item?.product_id),
        variant_id: item?.variant_id,
        store_id: item?.Product?.store_id,
        quantity: item?.quantity || 1,
        coupon_discount: item?.coupon_discount || 0,
        coupon_status: item?.coupon_status || 0,
      };

      const cart = await CreateNew(Cart, data, t);
    }

    await t.commit();
    return Base.sendResponse(res, HTTPS.OK, {});
  } catch (error) {
    await t.rollback();
    console.error("Error fetching Order:", error);
    return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
  }
};

exports.findAllCancelOrder = async (req, res) => {
  const order_status_id = req.query.order_status_id || "";
  const whereclause = { user_id: req.user.user_id };
  // if (order_status_id) {
  //   whereclause.order_status_id = order_status_id;
  // }

  try {
    const options = {
      include: [
        {
          model: Product,
          paranoid: false,
        },
        {
          model: Product_Variant,
          paranoid: false,
        },

        {
          model: Product_Order,
          where: whereclause,

          include: [
            {
              model: Users,
              paranoid: false,
            },

            {
              model: User_Address,
              paranoid: false,
            },
            {
              model: Users,
              paranoid: false,
              as: "delivery_boy",
            },
            {
              model: Order_History,
            },

            {
              model: Order_status,
            },

            {
              model: Order_Otp,
            },
          ],
        },
      ],
      where: { status: false },

      // where: {
      //   user_id: req.user.user_id,
      //   ...(order_status_id ? { order_status_id } : {}),
      // },
      order: [["createdAt", "DESC"]],
    };
    await Paginate(Product_Order_Detail, options, req, res, Op);
  } catch (error) {
    console.error("Error fetching Brands:", error);
    return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
  }
};

exports.findAllReturnOrder = async (req, res) => {
  const order_status_id = req.query.order_status_id || "";
  const whereclause = { user_id: req.user.user_id };
  // if (order_status_id) {
  //   whereclause.order_status_id = order_status_id;
  // }

  try {
    const options = {
      include: [
        {
          model: Product_Order,
          where: whereclause,
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
              model: Order_Otp,
            },
          ],
        },
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
      ],

      // where: {
      //   user_id: req.user.user_id,
      //   ...(order_status_id ? { order_status_id } : {}),
      // },
      order: [["createdAt", "DESC"]],
    };
    await Paginate(Return_Order, options, req, res, Op);
  } catch (error) {
    console.error("Error fetching Brands:", error);
    return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
  }
};

exports.findOneCancelOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const include = [
      {
        model: Product,
      },
      {
        model: Product_Variant,
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
            model: Order_Otp,
          },
        ],
      },
    ];
    const result = await CheckExits(
      Product_Order_Detail,
      { id: req.params.id },
      t,
      include,
    );

    if (!result) {
      await t.rollback();
      return Base.sendError(res, HTTPS.NOT_FOUND, "Order not found");
    }
    await t.commit();
    return Base.sendResponse(res, HTTPS.OK, result);
  } catch (error) {
    await t.rollback();
    console.error("Error fetching Order:", error);
    return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
  }
};

exports.findOneReturnOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const include = [
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
            model: Order_Otp,
          },
        ],
      },
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
        model: Return_Status,
      },
    ];
    const result = await CheckExits(
      Return_Order,
      { id: req.params.id },
      t,
      include,
    );

    if (!result) {
      await t.rollback();
      return Base.sendError(res, HTTPS.NOT_FOUND, "Order not found");
    }
    await t.commit();
    return Base.sendResponse(res, HTTPS.OK, result);
  } catch (error) {
    await t.rollback();
    console.error("Error fetching Order:", error);
    return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
  }
};
