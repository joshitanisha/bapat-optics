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
const { customOtpGen } = require("otp-gen-agent");
const {
  Users,
  Product,
  Store_Detail,
  Order_status,
  Payment_Type,
  User_Address,
  Pincode,
  Cart,
  Product_Variant,
  Order_Cancellation,
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
  Return_Order_Details,
  Return_Status,
  Tax_Type,
  
  sequelize,
  Users_Address_Details,
  Deliveryboy_Rating,
 
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
} = require("../../../../../helper/NodeMailer");
const {
  update_order,
  create_order,
} = require("../../../../../helper/order_notification");
const { transaction } = require("../wallet/wallet.controller");
const { getDistance } = require("../../../../../helper/common/function");
// class ProductOrderController {
// Fetch all countries
exports.findAll = async (req, res) => {
  const order_status_id = req.query.order_status_id || "";
  const whereclause = { user_id: req.user.user_id };
  if (order_status_id) {
    whereclause.order_status_id = order_status_id;
  }

  try {
    const options = {
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
          model: Product_Order_Detail,
          required:true,
          where:{status:true,return_status:true},

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
          model: Time_Slot,
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
      // where: {
      //   user_id: req.user.user_id,
      //   ...(order_status_id ? { order_status_id } : {}),
      // },
      order: [["createdAt", "DESC"]],
    };
    await Paginate(Product_Order, options, req, res, Op);
  } catch (error) {
    console.error("Error fetching Brands:", error);
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
        },
        {
          model: Product_Variant,
        },

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

// Fetch a single country by ID
exports.findOne = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const include = [
      {
        model: Users,
      },
      {
        model: Time_Slot,
      },
      {
        model: Payment_Method,
      },
      {
        model: Order_status,
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
        where: { status: true, return_status: true },
        include: [
          {
            model: Product,
            required: false,
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
      {
        model: Rating_Reviews,
      },
      {
        model: Deliveryboy_Rating,
      },

      {
        model: Tax_Type,
      },
    ];
    const result = await CheckExits(
      Product_Order,
      { id: req.params.id },
      t,
      include
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
          {
            model: Tax_Type,
          },
        ],
      },
    ];
    const result = await CheckExits(
      Product_Order_Detail,
      { id: req.params.id },
      t,
      include
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
          {
            model: Tax_Type,
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
      include
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

function generateInvoiceNumber() {
  const prefix = "INV";
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const random = String(Math.floor(1000 + Math.random() * 9000)); // Ensures 4-digit number
  return `${prefix}-${day}${month}-${random}`;
}

const findUniqueinvoicenumberorder = async () => {
  let invoice_no;
  let isUnique = false;

  while (!isUnique) {
    invoice_no = await generateInvoiceNumber();
    const existingTask = await Product_Order.findOne({
      where: { invoice_no: invoice_no },
    });
    if (!existingTask) {
      isUnique = true;
    }
  }

  return invoice_no;
};

// Create a new country

exports.CreateOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      delivery_date,
      time_slot_id,
      address_id,
      coupon_id,
      payment_method_id,
      delivery_type_id,
      pack_type_id,
      tax_type_id,
      payment_id,
      order_summary,
      order_Details_summary,
      total_kilometer,
    } = req.body;
    const userId = req?.user?.user_id;

    const appsetup = await App_Setup.findOne({
      transaction: t,
    });
    const cartListItems = await Cart.findAll(
      {
        include: [{ model: Product }, { model: Product_Variant }],
        where: { user_id: req?.user?.user_id },
      },
      { transaction: t }
    );

    if (!cartListItems || cartListItems.length === 0) {
      await t.rollback();
      return Base.sendResponse(res, HTTPS.NOT_FOUND, "No Cart Found");
    }

    function formatDate(input) {
      const date = new Date(input);
      if (isNaN(date)) {
        throw new Error(`Invalid date provided: ${input}`);
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    }
    const invoice_number = await findUniqueinvoicenumberorder();

    const order = {
      user_id: userId,
      time_slot_id,
      delivery_date: formatDate(delivery_date),
      order_status_id: IDS.order_status.Pending,
      // pack_type_id,
      // delivery_type_id,
      address_id,
      no_of_item: order_summary?.no_of_item,
      invoice_no: invoice_number,
      packing_charges: order_summary.total_packing_charges,
      delivery_charges: order_summary.total_delivery_charges,
      payment_method_id,
      total_coupon_discount: order_summary.total_coupon_discount,
      total_offer_discount: order_summary.total_offer_discount,
      total_amount: order_summary.total_amount,
      total_tax: order_summary.total_tax,
      total_mrp: order_summary.total_mrp,
      total_selling_price: order_summary.total_selling_price,
      total_kg: order_summary.total_kg,
      total_refer_discount: order_summary.refer_discount,
      total_kilometer,
      tax_type_id,
    };

    if (parseFloat(total_kilometer) <= 3) {
      order.deliveryboy_payment = parseFloat(
        appsetup.delivery_price_three_kilometer || 0
      );
    } else {
      const extraDistance = parseFloat(total_kilometer) - 3;
      const baseCharge = parseFloat(
        appsetup.delivery_price_three_kilometer || 0
      );
      const extraCharge =
        parseFloat(appsetup.delivery_price || 0) * extraDistance;

      order.deliveryboy_payment = baseCharge + extraCharge;
    }

    if (payment_method_id === IDS.PaymentMethods.Wallet) {
      const user_wallet = await CheckExits(
        Wallet,
        { user_id: req.user.user_id },
        t
      );

      if (
        payment_method_id === IDS.PaymentMethods.Wallet &&
        parseFloat(user_wallet?.amount) < parseFloat(order.total_amount)
      ) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          `Insufficient Amount In Wallet`
        );
      }
    }

    const newOrder = await Product_Order.create(order, { transaction: t });

    if (Number(order_summary.refer_discount) > 0) {
      const UsersRefer = await CheckExits(
        Users_Refer,
        { refer_to: req.user.user_id },
        t
      );

      console.log(UsersRefer, "UsersRefer UsersRefer");

      const appsetup = await App_Setup.findOne({ transaction: t });
      if (UsersRefer) {
        const walletamount =
          Number(order_summary.total_amount) *
          (Number(appsetup.refer_percentage) / 100);
        const walletdata = await CheckExits(
          Wallet,
          { user_id: UsersRefer.refer_by },
          t
        );

        await UpdateData(
          Wallet,
          { amount: parseFloat(walletdata.amount) + parseFloat(walletamount) },
          { user_id: UsersRefer.refer_by },
          t
        );

        const referordercount = await CheckExits(
          Users,
          { id: req.user.user_id },
          t
        );

        await UpdateData(
          Users,
          { refer_order_count: Number(referordercount.refer_order_count) - 1 },
          { id: req.user.user_id },
          t
        );

        const walletHistory = {
          wallet_id: walletdata?.id,
          transaction_type: "credit",
          amount: parseFloat(walletamount),
          description: "Referral Reward Credited",
        };
        await CreateNew(Wallet_History, walletHistory, t);
      }
    }

    let uniqueOtp = null;
    let retries = 5;

    while (retries > 0) {
      const otp = await customOtpGen({ length: 4, chars: "0123456789" });

      // Check if OTP already exists
      const existing = await Order_Otp.findOne({
        where: { name: otp },
        transaction: t,
      });

      if (!existing) {
        uniqueOtp = otp;
        break;
      }

      retries--;
    }

    if (!uniqueOtp) {
      throw new Error(
        "Failed to generate a unique OTP after multiple attempts"
      );
    }

    const order_otp = await Order_Otp.create(
      {
        order_id: newOrder.id,
        name: uniqueOtp,
      },
      { transaction: t }
    );

    for (const item of order_Details_summary) {
      let productOrder = await Product_Order_Detail.findAll({
        where: {
          variant_id: item.variant_id,
          product_id: item.product_id,
        },
        transaction: t,
      });

      const totalSold = productOrder.reduce(
        (sum, row) => sum + Number(row.quantity || 0),
        0
      );

      const purchaseOrder = await Product_Variant_Stock.findAll({
        attributes: ["id", "general_stock"],
        include: [
          {
            model: Receiving_Product,
            attributes: [],
            include: [
              {
                model: Receiving,
                attributes: ["batch_no", "createdAt"],
              },
            ],
          },
        ],
        where: {
          variant_id: item.variant_id,
          product_id: item.product_id,
        },
        transaction: t,
        order: [
          [
            { model: Receiving_Product },
            { model: Receiving },
            "createdAt",
            "ASC",
          ],
        ],
        raw: true,
        nest: true,
      });

      let remaining = totalSold;
      let selectedBatch = null;

      for (const row of purchaseOrder) {
        const batchNo = row.Receiving_Product.Receiving.batch_no;
        const expiry_date = row.Receiving_Product.expiry_date;
        const available = Number(row.general_stock || 0);

        if (available >= remaining) {
          selectedBatch = {
            batch_no: batchNo,
            quantity: remaining,
            expiry_date: expiry_date,
          };
          break;
        }
      }

      await CreateNew(
        Product_Order_Detail,
        {
          order_id: newOrder?.id,
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          total_selling_price: item.total_selling_price,
          total_tax: item.total_tax,
          total_amount: item.total_amount,
          total_mrp: item.total_mrp,
          selling_price: item.selling_price,
          mrp: item.mrp,
          tax_percentage: item.tax_percentage,
          coupon_discount: item.coupon_discount,
          offer_discount: item.offer_discount,
          delivery_charges: item.delivery_charge,
          packing_charges: item.packing_charge,
          total_kg: item.total_kg,
          total_tax: item.total_tax,
          refer_discount: item.refer_discount,
          batch_no: selectedBatch?.batch_no,
          expiry_date: selectedBatch?.expiry_date,
        },
        t
      );
      const existingStock = await Product_Variant.findOne({
        where: { id: item.variant_id },
        transaction: t,
      });

      if (Number(existingStock?.general_stock) < Number(item?.quantity)) {
        await t.rollback();
        return Base.sendResponse(res, HTTPS.NOT_FOUND, "Low in stock");
      }

      const newGeneralStock =
        Number(existingStock?.general_stock) - Number(item?.quantity);
      const product = await Product.findOne({
        where: { id: item.product_id },
        transaction: t,
      });
      if (newGeneralStock < Number(appsetup.stock_alert)) {
        await stockMail({ product_name: product.name, qty: newGeneralStock });
      }

      const ProductStock = await UpdateData(
        Product_Variant,
        {
          general_stock: newGeneralStock,
        },
        { id: item.variant_id },
        t
      );
    }

    if (order_summary.couponApplied) {
      await CreateNew(
        Coupon_History,
        {
          order_id: newOrder?.id,
          user_id: userId,
          coupon_id: coupon_id,
          discount_price: order_summary.total_coupon_discount,
        },
        t
      );
    }

    await CreateNew(
      Order_Payment_Detail,
      {
        payment_method_id,
        order_id: newOrder?.id,
        payment_id: payment_id,
        amount: order.total_amount,
      },
      t
    );

    await CreateNew(Order_History, { order_id: newOrder?.id }, t);

    if (Number(payment_method_id) === Number(IDS.PaymentMethods.Wallet)) {
      const user_wallet = await Wallet.findOne({
        where: { user_id: req?.user?.user_id },
        transaction: t,
      });

      const new_amount =
        parseFloat(user_wallet?.amount) - parseFloat(order.total_amount);
      await UpdateData(
        Wallet,
        { amount: parseFloat(new_amount) },
        { user_id: req.user.user_id },
        t
      );
      const walletHistory = {
        wallet_id: user_wallet?.id,
        transaction_type: "debit",
        amount: parseFloat(order.total_amount),
        description: "Create Order ",
      };
      await CreateNew(Wallet_History, walletHistory, t);
    }

    // await NotificationsManagment(newCreated);
    await Cart.destroy({
      where: { user_id: req?.user?.user_id },
      transaction: t,
    });

    await t.commit();

    const newCreated = await CreateNew(Notification, {
      order_id: newOrder?.id,
      user_id: req.user.user_id,
      message: "Order placed successfully",
    });
    const customer = await Users.findOne({
      where: { id: req.user.user_id },
    });
console.log(customer?.device_key,
  "customer?.device_key"
);

    await create_order(newOrder?.id);
    await AdminNotifications(customer?.device_key, newCreated);

    const pdf = await InvoiceGenerater(newOrder?.id);

    await mailOrder(
      appsetup?.email,
      newOrder?.invoice_no,
      customer?.name,
      order_summary?.total_amount
    );

    return Base.sendResponse(res, HTTPS.CREATED, newOrder);
  } catch (error) {
    await t.rollback();
    console.error("Error creating Order:", error);
    return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
  }
};

exports.CalculationOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      pack_type_id = 1,
      coupon_id,
      address_id,
      delivery_kilometer,
    } = req.body;

    // const delivery_kilometer = 10;

    const userId = req?.user?.user_id;
    const cartListItems = await Cart.findAll({
      include: [
        {
          model: Product,
          include: [{ model: Offered_Product, include: [Discount_Type] }],
        },
        { model: Product_Variant, paranoid: true,  },
      ],
      where: { user_id: userId },
      transaction: t,
    });

    if (!cartListItems || cartListItems.length === 0) {
      await t.rollback();
      return Base.sendResponse(res, HTTPS.NOT_FOUND, "No Cart Found");
    }

    console.log(req.body, "req.body req.body");

    const [packtype, appsetup, user] = await Promise.all([
      Pack_Type.findOne({ where: { id: pack_type_id }, transaction: t }),
      App_Setup.findOne({ transaction: t }),
      Users.findOne({ where: { id: userId }, transaction: t }),
    ]);

    const customerAddress = await User_Address.findOne({
      include: [
        {
          model: Users_Address_Details,
          include: [
            {
              model: Pincode,
            },
          ],
        },
      ],
      where: { id: address_id },
      transaction: t,
    });

    // const delivery_kilometer = await getDistance(
    //   customerAddress.Users_Address_Detail?.Pincode?.name
    // )

    const customerStateId =
      customerAddress?.Users_Address_Detail?.Pincode?.state_id;

    // Extract business state_id
    const businessStateId = appsetup?.state_id;
 

    // Decide tax type
    let taxType_id;

    if (customerStateId && businessStateId) {
      taxType_id = Number(customerStateId) === Number(businessStateId) ? 2 : 3;
    }
    const taxType = await Tax_Type.findOne({
      where: { id: taxType_id },
      transaction: t,
    });

    const packingChargePerKg = parseFloat(packtype?.rate || 0);

    const order = { no_of_item: cartListItems.length };
    let total_mrp = 0;
    let total_selling_price = 0;
    let totalOfferDiscount = 0;
    let totalCouponDiscount = 0;
    let total_kg = 0;

    const productSubtotals = [];

    for (const item of cartListItems) {
      const quantity = item?.quantity || 0;
      const mrp = parseFloat(item?.Product_Variant?.mrp || 0);
      const selling_price = parseFloat(item?.Product_Variant?.price || 0);
      const rawTax = item?.Product?.tax_percentage;
      const taxPercentage = isNaN(parseFloat(rawTax)) ? 0 : parseFloat(rawTax);
      // const kg = parseFloat(item?.Product_Variant?.name || 0);
      const totalMrp = quantity * mrp;
      const totalSellingPrice = quantity * selling_price;

      let offerDiscount = 0;
      let discountTypeId = 0;

      const offeredProduct = item.Product?.Offered_Product;
      if (offeredProduct && offeredProduct.discount) {
        const discountValue = parseFloat(offeredProduct.discount);
        discountTypeId = offeredProduct.Discount_Type?.id || 1;

        if (discountTypeId === IDS.CouponType.Percentage) {
          offerDiscount = (totalSellingPrice * discountValue) / 100;
        } else {
          offerDiscount = discountValue * quantity;
        }
        totalOfferDiscount += offerDiscount;
      }

      const baseSubtotal = totalSellingPrice;
      // const totalKg = quantity * kg;

      productSubtotals.push({
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity,
        mrp,
        selling_price,
        tax_percentage: taxPercentage,
        total_mrp: totalMrp,
        total_selling_price: totalSellingPrice,
        offer_discount: offerDiscount,
        discount_type: discountTypeId,
        base_subtotal: baseSubtotal,
        // total_kg: totalKg,
      });

      total_mrp += totalMrp;
      total_selling_price += totalSellingPrice;
      // total_kg += totalKg;
    }

    // const totalPackingCharges =
    //   packingChargePerKg *
    //   Math.ceil(total_kg / parseInt(appsetup.packing_quantity));
    let deliveryCharges = 0;
    // console.log(appsetup.minimum_order,'appsetup.minimum_order');

    if (total_selling_price < parseFloat(appsetup.minimum_order || 0)) {
      if (delivery_kilometer <= 3) {
        deliveryCharges = parseFloat(
          appsetup.delivery_price_three_kilometer || 0
        );
      } else {
        const extraDistance = delivery_kilometer - 3;
        const baseCharge = parseFloat(
          appsetup.delivery_price_three_kilometer || 0
        );
        const extraCharge =
          parseFloat(appsetup.delivery_price || 0) * extraDistance;

        deliveryCharges = baseCharge + extraCharge;
      }
    }

    // Coupon logic
    let couponApplied = false;
    let couponMessage = null;
    let coupon;
    if (coupon_id) {
      coupon = await Coupon.findOne({
        where: { id: coupon_id },
        transaction: t,
      });

      if (!coupon) {
        couponMessage = "Invalid coupon";
      } else {
        if (total_selling_price < parseFloat(coupon.required_amount)) {
          couponMessage =
            "Minimum amount should be ₹${coupon.required_amount} to use this coupon";
        } else {
          if (coupon.discount_type_id === IDS.discountTypes.percentage) {
            totalCouponDiscount = (total_selling_price * coupon.discount) / 100;
          } else {
            totalCouponDiscount = parseFloat(coupon.discount);
          }

          if (totalCouponDiscount > total_selling_price) {
            totalCouponDiscount = total_selling_price;
          }

          couponApplied = true;
        }
      }
    }

    // const totalKgWeight = productSubtotals.reduce(
    //   (sum, item) => sum + item.total_kg,
    //   0
    // );

    // Refer discount logic
    let referDiscount = 0;
    if (Number(user.refer_order_count) > 0) {
      const referPercentage = parseFloat(appsetup.refer_to_percentage || 0);
      if (referPercentage > 0) {
        referDiscount = (total_selling_price * referPercentage) / 100;
      }
    }

    // Distribute discounts
    let distributedCouponDiscount = 0;
    let distributedReferDiscount = 0;
    let total_tax = 0;

    const orderDetails = productSubtotals.map((item, index) => {
      let productCouponDiscount = 0;
      let productReferDiscount = 0;

      if (couponApplied && total_selling_price > 0) {
        productCouponDiscount =
          (item.total_selling_price / total_selling_price) *
          totalCouponDiscount;
      }

      if (referDiscount > 0 && total_selling_price > 0) {
        productReferDiscount =
          (item.total_selling_price / total_selling_price) * referDiscount;
      }

      distributedCouponDiscount += productCouponDiscount;
      distributedReferDiscount += productReferDiscount;

      if (index === productSubtotals.length - 1) {
        const couponDiff = totalCouponDiscount - distributedCouponDiscount;
        const referDiff = referDiscount - distributedReferDiscount;

        productCouponDiscount += couponDiff;
        productReferDiscount += referDiff;
      }

      productCouponDiscount = productCouponDiscount;
      productReferDiscount = productReferDiscount;

      const baseAfterOffer = item.base_subtotal - item.offer_discount;

      // const productPackingCharge =
      //   (item.total_kg / totalKgWeight) * totalPackingCharges;

      // const productDeliveryCharge =
      //   (baseAfterOffer / total_selling_price) * deliveryCharges;

      const productDeliveryCharge = deliveryCharges / order.no_of_item;

      const taxBase =
        baseAfterOffer +
        // productPackingCharge +
        productDeliveryCharge -
        (productCouponDiscount + productReferDiscount);

      const tax = (taxBase * item.tax_percentage) / 100;
      total_tax += tax;

      const finalAmount = taxBase + tax;

      return {
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        mrp: item.mrp,
        selling_price: item.selling_price,
        total_mrp: item.total_mrp,
        total_selling_price: item.total_selling_price,
        offer_discount: item.offer_discount,
        coupon_discount: productCouponDiscount,
        refer_discount: productReferDiscount,
        tax_percentage: item.tax_percentage,
        total_tax: tax,
        total_amount: finalAmount,
        discount_type: item.discount_type,
        total_kg: item.total_kg,
        // packing_charge: productPackingCharge,
        delivery_charge: productDeliveryCharge,
      };
    });

    const finalAmount = orderDetails.reduce(
      (sum, i) => sum + parseFloat(i.total_amount),
      0
    );

    order.total_mrp = total_mrp.toFixed(2);
    order.total_selling_price = total_selling_price.toFixed(2);
    order.total_tax = total_tax.toFixed(2);
    // order.total_packing_charges = totalPackingCharges.toFixed(2);
    order.total_delivery_charges = deliveryCharges.toFixed(2);
    order.total_offer_discount = totalOfferDiscount.toFixed(2);
    order.total_coupon_discount = totalCouponDiscount.toFixed(2);
    order.refer_discount = referDiscount.toFixed(2);
    order.total_amount = finalAmount.toFixed(2);
    order.total_kg = total_kg.toFixed(2);
    order.coupon_applied = couponApplied;
    order.Tax_Type = taxType;
    if (couponMessage) order.message = couponMessage;
    if (couponApplied) order.coupon = coupon;

    // if (order.total_selling_price < parseFloat(appsetup.minimum_order)) {
    //   await t.rollback();
    //   return Base.sendError(
    //     res,
    //     HTTPS.NOT_ACCEPTABLE,
    //     Total Amount must be greater than ₹${appsetup.minimum_order}
    //   );
    // }

    await t.commit();

    return Base.sendResponse(res, HTTPS.OK, {
      order_summary: order,
      order_Details_summary: orderDetails,
      message: "Order calculation successful",
    });
  } catch (error) {
    await t.rollback();
    console.error("Error calculating order:", error);
    return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
  }
};

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
      t
    );
    await UpdateData(
      Order_History,
      { cancelledAt: new Date() },
      { order_id: id },
      t
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
          t
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
        t
      );
    }

    await t.commit();
    return Base.sendResponse(
      res,
      HTTPS.ACCEPTED,
      "Order Cancelled successfully"
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
      t
    );
    const returnOrder = await CreateNew(
      Return_Order,
      {
        order_id: id,
        return_reason_id,
        message,
        return_status_id: IDS.return_status.ReturnRequested,
      },
      t
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
          t
        );

        await UpdateData(
          Product_Order_Detail,
          { return_status: false },
          { order_id: id, product_id: item.product_id },
          t
        );

        const data = await CreateNew(
          Return_Order_Details,
          {
            order_details_id: item.id,
            product_id: item.product_id,
            return_order_id: returnOrder.id,
          },
          t
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
          t
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
      t
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
      t
    );
    if (existsCart) {
      await t.rollback();
      return Base.sendError(
        res,
        HTTPS.ALREADY_REPORTED,
        "A cart is in progress. You can delete or continue with the current one"
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
          {
            model: Order_Add_On,
            include: [
              {
                model: Food_Add_On,
              },
            ],
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
      include
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

      if (item?.Order_Add_Ons && item?.Order_Add_Ons?.length > 0) {
        for (addon of item?.Order_Add_Ons) {
          await CreateNew(
            Cart_Detail,
            { cart_id: cart?.id, add_on_id: addon?.add_on_id },
            t
          );
        }
      }
    }

    await t.commit();
    return Base.sendResponse(res, HTTPS.OK, {});
  } catch (error) {
    await t.rollback();
    console.error("Error fetching Order:", error);
    return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
  }
};

// }

// module.exports = new ProductOrderController();
