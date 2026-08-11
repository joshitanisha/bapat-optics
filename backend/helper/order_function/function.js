const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");
const { HTTPS } = require("../https-status-codes/https-status-codes");
const Base = require("../exception_handling");
const { ContactType } = require("../fix_ids");
const request = require("request");
const QRCode = require("qrcode");
const { AdminNotifications } = require("../mobile_notifications");
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
  sequelize,
} = require("../../models/index");
const crypto = require("crypto");
const {
  transaction,
} = require("../../controllers/api/v1/mobile/wallet/wallet.controller");
const { default: axios } = require("axios");
const { CreateNew, UpdateData } = require("../common/utils/dbUtils");
const { stockMail } = require("../NodeMailer");

function generateInvoiceNumber() {
  const prefix = "INV";
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random = String(Math.floor(1000 + Math.random() * 9000));
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

const findUniqueinvoicenumberOrderDetails = async () => {
  let invoice_no;
  let isUnique = false;

  while (!isUnique) {
    invoice_no = await generateInvoiceNumber();
    const existingTask = await Product_Order_Detail.findOne({
      where: { invoice_no: invoice_no },
    });
    if (!existingTask) {
      isUnique = true;
    }
  }

  return invoice_no;
};

const processOrderDetails = async ({ orderId, items, appsetup, t, res }) => {
  for (const item of items) {
    const existingStock = await Product_Variant.findOne({
      where: { id: item.variant_id },
      transaction: t,
    });

    const selectedBatch = await Product_Variant_Stock.findOne({
      attributes: ["id", "general_stock"],
      include: [
        {
          model: Receiving_Product,
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
        general_stock: { [Op.gt]: 0 },
      },
      transaction: t,
      order: [["createdAt", "ASC"]],
    });

    // ✅ Create order detail row
    await CreateNew(
      Product_Order_Detail,
      {
        order_id: orderId,
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
        refer_discount: item.refer_discount,
        batch_no: selectedBatch?.batch_no,
        expiry_date: selectedBatch?.expiry_date,
      },
      t
    );

    // ✅ Stock validations
    if (Number(existingStock?.general_stock) < Number(item?.quantity)) {
      await t.rollback();
      return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Low in stock");
    }

    // ✅ Deduct stock from selected batch
    if (existingStock.general_stock > 0) {
      const newStock =
        Number(selectedBatch?.general_stock) - Number(item?.quantity);

      await UpdateData(
        Product_Variant_Stock,
        { general_stock: newStock },
        { id: selectedBatch.id },
        t
      );
    }

    // ✅ Update main variant stock
    const newGeneralStock =
      Number(existingStock?.general_stock) - Number(item?.quantity);

    const product = await Product.findOne({
      where: { id: item.product_id },
      transaction: t,
    });

    if (newGeneralStock < Number(appsetup.stock_alert)) {
      await stockMail({ product_name: product.name, qty: newGeneralStock });
    }

    await UpdateData(
      Product_Variant,
      { general_stock: newGeneralStock },
      { id: item.variant_id },
      t
    );
  }
};

module.exports = {
  findUniqueinvoicenumberorder,
  processOrderDetails,
  findUniqueinvoicenumberOrderDetails,
};
