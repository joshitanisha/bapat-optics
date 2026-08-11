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
  p_child_category,
  Order_History,
  Return_Reason,
  Return_Status,
  Order_Payment_Detail,
  sequelize,
  Replace_Order,
  ReplaceOrderStatus,
  Notification,
  Payment_Method,
  Time_Slot,
  Users_Address_Details,
  Country,
  State,
  City,
  Pincode,
  Wallet_History,
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
  Coupon_Type,
  Coupon,
  Prescriptions,
  Addon,
  Order_Refer_History,
  RefundOrders,
  Prescription_Details,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
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
const { mailOrder } = require("../../../../../helper/NodeMailer");
const { InvoiceGenerater } = require("../../../../../helper/invoice_generater");
const {
  generateReferralCode,
} = require("../../../../../helper/common/function");
class ProductOrderController {
  async findAll(req, res) {
    try {
      const searchOrderStatus = req.query.searchOrderStatus || "";
      const return_status_id = req.query.return_status_id || "";
      const sortOrder = req.query.sortOrder || "DESC";
      const term = req.query.term || "";

      const customer = req.query.customer || "";
      const page = parseInt(req.query.page) || 1;
      const per_page = parseInt(req.query.per_page) || 10;

      const from = req.query.from || "";
      const to = req.query.to || "";
      let start_time = req.query.start_time || "";
      let end_time = req.query.end_time || "";

      // Normalize time
      // const parseToTime = (value, fallback) => {
      //   const date = new Date(`1970-01-01T${value}`);
      //   return isNaN(date.getTime()) ? fallback : moment(date).format("HH:mm");
      // };

      function parseToTime(dateStr) {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? null : date;
      }
      start_time = parseToTime(start_time, "00:00");
      end_time = parseToTime(end_time, "23:59");

      // Build main where clause
      const where = {};

      if (searchOrderStatus) {
        where.order_status_id = searchOrderStatus;
      }

      const whereClauseProduct = {};

      if (term) {
        whereClauseProduct.name = { [Op.like]: `%${term}%` };
      }
      const whereClauseCustomer = {};

      if (customer) {
        whereClauseCustomer.name = { [Op.like]: `%${customer}%` };
      }
      // Build time slot filter
      const timeSlotWhere = {};
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

      // if (start_time && end_time) {
      //   timeSlotWhere.from = { [Op.gte]: start_time };
      //   timeSlotWhere.to = { [Op.lte]: end_time };
      // }
      const productCategory = req.query.productCategory || "";

      const ProductDetails = { status: true };

      if (productCategory) {
        ProductDetails.product_id = productCategory;
      }

      const include = [
        { model: Users, where: whereClauseCustomer },
        { model: Order_status, required: false },
        {
          model: User_Address,
          include: [
            {
              model: Users_Address_Details,
              include: [
                { model: Country },
                { model: State },
                { model: City },
                { model: Pincode },
                { model: Area },
              ],
            },
          ],
        },
        { model: Order_History },
        { model: Payment_Method },
        // {
        //   model: Time_Slot,
        //   where: timeSlotWhere,
        //   required: true,
        // },
        { model: Users, as: "delivery_boy" },
        {
          model: Product_Order_Detail,
          // required:true,
          // where: { status: true },
          where: ProductDetails,
          include: [
            {
              model: Product,
              // required: false,
              // where: whereClauseProduct,
              include: [
                { model: p_category },
                { model: p_sub_category },
                { model: p_child_category },
              ],
            },
          ],
        },
        {
          model: Return_Order,
          include: [
            return_status_id
              ? { model: Return_Status, where: { id: return_status_id } }
              : { model: Return_Status },
            { model: Return_Reason },
            { model: Users },
          ],
        },
      ];

      const { count, rows: data } = await Product_Order.findAndCountAll({
        include,
        where,
        order: [["createdAt", sortOrder]],
        offset: (page - 1) * per_page,
        limit: per_page,
        distinct: true,
      });

      const totalSellingValue = data.reduce((sum, order) => {
        return sum + (Number(order.total_amount) || 0);
      }, 0);
      const totalWeight = data.reduce((sum, order) => {
        return sum + (Number(order.total_kg) || 0);
      }, 0);

      const averageSellingValue = count > 0 ? totalSellingValue / count : 0;
      const total_pages = Math.ceil(count / per_page);

      return Base.sendResponse(res, HTTPS.OK, {
        data,
        current_page: page,
        total_pages,
        per_page,
        total: count,
        search_name: term,
        total_selling_value: parseFloat(totalSellingValue || 0).toFixed(2),
        average_selling_value: parseFloat(averageSellingValue || 0).toFixed(2),
        total_weight: parseFloat(totalWeight || 0).toFixed(2),
      });
    } catch (error) {
      console.error("Error fetching Orders:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async findUser(req, res) {
    try {
      const contact_no = req.query.contact_no || "";
      const data = await CheckExits(Users, { contact_no: contact_no });
    
     
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error fetching User:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async registerUser(req, res) {
    const t = await sequelize.transaction();
    try {
      const refer_code_generate = await generateReferralCode(5, 4, t);
      const { name, email, contact_no, age, date_of_birth, refer_code } =
        req.body;

      let contactExists = await CheckExits(
        Users,
        { contact_no: contact_no },
        t,
      );
      if (contactExists) {
        return Base.sendError(res, HTTPS.ALREADY_REPORTED, {
          contact_no: "Contact already exists",
        });
      }
      let emailExists = await CheckExits(Users, { email: email }, t);
      if (emailExists) {
        return Base.sendError(res, HTTPS.ALREADY_REPORTED, {
          email: "Email already exists",
        });
      }

      const data = {
        name,
        email,
        contact_no,
        date_of_birth,
        role_id: IDS.RoleId.Customer,
        refer_code: refer_code_generate,
      };

      if (refer_code) {
        const refered_by = await Users.findOne({
          where: {
            refer_code: refer_code,
          },
          transaction: t,
        });

        if (!refered_by) {
          await t.rollback();
          return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, {
            refer_code: "Invalid Refer Code",
          });
        }
      }
      const newUser = await CreateNew(Users, data, t);

      const wallet = await CreateNew(Wallet, { user_id: newUser?.id }, t);
      if (refer_code) {
        const refered_by = await Users.findOne({
          where: {
            refer_code: refer_code,
          },
          transaction: t,
        });
        if (refered_by && newUser) {
          await Users_Refer.create(
            {
              refer_by: refered_by?.id,
              refer_to: newUser?.id,
            },
            {
              transaction: t,
            },
          );

          await CreateNew(
            Order_Refer_History,
            {
              user_id: refered_by?.id,
              user_by_id: newUser?.id,
            },
            t,
          );
        }
      }
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, newUser);
    } catch (error) {
      await t.rollback();
      console.error("Error updating User:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async CalculationOrder(req, res) {
    const t = await sequelize.transaction();
    try {
      const { coupon_id, selected_id, reward_status } = req.body;
      const userId = req?.body?.user_id;

      const cartListItems =
        typeof req.body.products === "string"
          ? JSON.parse(req.body.products)
          : req.body.products;

      const appsetup = await App_Setup.findOne({});
      // const user = await Users.findOne({ where: { id: userId } });
      // const wallet = await Wallet.findOne({ where: { user_id: userId } });

      const order = { no_of_item: cartListItems.length };
      let total_mrp = 0;
      let total_selling_price = 0;
      let totalOfferDiscount = 0;
      let totalCouponDiscount = 0;
      let total_addon_price = 0;
      let total_lense_price = 0;
      let deliveryCharges = parseFloat(appsetup.delivery_price);

      const productSubtotals = [];

      // Step 1: Base Totals + Bapat Offer
      for (const item of cartListItems) {
        const productData = await Product.findOne({
          where: { id: item.product_id },
          include: [{ model: Offered_Product, include: [Discount_Type] }],
          transaction: t,
        });
        const lenseData = await Product.findOne({
          where: { id: item.lense_id },

          transaction: t,
        });

        const addonData = await Addon.findOne({
          where: { id: item.addon_id },

          transaction: t,
        });

        const variant = await Product_Variant.findOne({
          where: { id: item.variant_id || null, product_id: item.product_id },
          transaction: t,
        });
        const quantity = item?.quantity || 0;
        const mrp = parseFloat(variant?.mrp || 0);
        const selling_price = parseFloat(variant?.price || 0);
        const taxPercentage = parseInt(productData.tax_percentage || 0);

        const totalAddOnPrice = addonData?.price;
        const totalLensePrice = lenseData?.price;
        const totalMrp = quantity * mrp;
        const totalSellingPrice = quantity * selling_price;

        let bapatofferDiscount = 0;
        let discountTypeId = 0;

        const offeredProduct = item.Product?.Offered_Product;
        if (offeredProduct && offeredProduct.Offer?.discount) {
          const discountValue = parseFloat(offeredProduct.Offer?.discount);
          discountTypeId = offeredProduct.Offer?.Discount_Type?.id || 1;

          if (discountTypeId === IDS.CouponType.Percentage) {
            bapatofferDiscount = (totalSellingPrice * discountValue) / 100;
          } else {
            bapatofferDiscount = discountValue * quantity;
          }
          totalOfferDiscount += bapatofferDiscount;
        }

        productSubtotals.push({
          product_id: item.product_id,
          variant_id: item.variant_id,

          quantity,
          mrp,
          selling_price,
          addon_price: totalAddOnPrice,
          lense_price: totalLensePrice,
          tax_percentage: taxPercentage,
          total_mrp: totalMrp,
          total_selling_price: totalSellingPrice,
          offer_discount: bapatofferDiscount,
          discount_type: discountTypeId,
          base_subtotal: totalSellingPrice,
        });

        total_mrp += totalMrp;
        total_addon_price += totalAddOnPrice;
        total_lense_price += totalLensePrice;
        total_selling_price += totalSellingPrice;
      }

      let couponApplied = false;
      let couponMessage = null;
      let coupon = null;

      if (coupon_id) {
        coupon = await Coupon.findOne({
          include: [{ model: Coupon_Type }],
          where: { id: coupon_id },
          transaction: t,
        });

        if (!coupon) {
          couponMessage = "Invalid coupon";
        } else {
          couponApplied = true;
        }
      }

      // Step 2: Coupon Distribution (non-bapat products)
      if (couponApplied) {
        let eligibleProducts = [];

        for (const item of productSubtotals) {
          if (item.offer_discount > 0) continue;

          if (coupon.Coupon_Type.id === IDS.CouponTypeId.Brand) {
            if (item.brand_id === coupon.brand_id) eligibleProducts.push(item);
          } else if (coupon.Coupon_Type.id === IDS.CouponTypeId.Categoty) {
            if (item.category_id === coupon.category_id)
              eligibleProducts.push(item);
          } else if (coupon.Coupon_Type.id === IDS.CouponTypeId.Global) {
            eligibleProducts.push(item);
          }
        }

        const eligibleTotal = eligibleProducts.reduce(
          (sum, p) => sum + p.total_selling_price,
          0,
        );

        for (const item of eligibleProducts) {
          let productCouponDiscount = 0;

          if (coupon.discount_type_id === IDS.discountTypes.percentage) {
            productCouponDiscount =
              (item.total_selling_price / eligibleTotal) *
              ((eligibleTotal * coupon.discount) / 100);
          } else {
            productCouponDiscount =
              (item.total_selling_price / eligibleTotal) *
              parseFloat(coupon.discount);
          }

          item.coupon_discount = productCouponDiscount;
          totalCouponDiscount += productCouponDiscount;
        }
      }

      // Step 3: Calculate orderDetails and total_tax
      let total_tax = 0;
      let total_amount_before_reward = 0;

      const orderDetails = productSubtotals.map((item) => {
        const couponDiscount = item.coupon_discount || 0;

        const baseAfterDiscounts =
          item.base_subtotal - item.offer_discount - couponDiscount;
        const productDeliveryCharge = deliveryCharges / order.no_of_item;

        const taxBase = baseAfterDiscounts + productDeliveryCharge;
        const tax = (taxBase * item.tax_percentage) / 100;
        total_tax += tax;

        const productFinalAmount = taxBase + tax;
        total_amount_before_reward += productFinalAmount;

        return {
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          mrp: item.mrp.toFixed(2),
          selling_price: item.selling_price.toFixed(2),
          total_mrp: item.total_mrp.toFixed(2),
          total_selling_price: item.total_selling_price.toFixed(2),
          offer_discount: item.offer_discount.toFixed(2),
          coupon_discount: couponDiscount.toFixed(2),
          tax_percentage: item.tax_percentage.toFixed(2),
          total_tax: tax.toFixed(2),
          discount_type: item.discount_type.toFixed(2),
          delivery_charge: productDeliveryCharge.toFixed(2),
          reward_discount: 0,
          total_amount: productFinalAmount,
          total_addon_price: item.addon_price,
          total_lense_price: item.lense_price,
        };
      });

      let rewardDiscount = 0;
      if (reward_status && wallet?.amount > 0) {
        const halfOrder = total_amount_before_reward / 2;

        if (wallet.amount >= halfOrder) {
          rewardDiscount = halfOrder;
        } else {
          rewardDiscount = wallet.amount;
        }

        for (const detail of orderDetails) {
          const proportion = detail.total_amount / total_amount_before_reward;
          const rewardPerProduct = rewardDiscount * proportion;

          detail.reward_discount = rewardPerProduct.toFixed(2);
          detail.total_amount = (
            detail.total_amount - rewardPerProduct
          ).toFixed(2);
        }
      }

      const finalAmount = total_amount_before_reward - rewardDiscount;

      order.total_mrp = total_mrp;
      order.total_selling_price = total_selling_price.toFixed(2);
      order.total_addon_price = total_addon_price;
      order.total_lense_price = total_lense_price;
      order.total_tax = total_tax.toFixed(2);
      order.total_delivery_charges = deliveryCharges.toFixed(2);
      order.total_offer_discount = totalOfferDiscount.toFixed(2);
      order.total_coupon_discount = totalCouponDiscount.toFixed(2);
      order.reward_discount = rewardDiscount.toFixed(2);
      order.total_amount = finalAmount.toFixed(2);
      order.reward_status = reward_status ? true : false;
      order.selected_id = selected_id;
      order.coupon_applied = couponApplied;

      if (couponMessage) order.message = couponMessage;
      if (couponApplied) order.coupon = coupon;

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
  }

  async CreateOrder(req, res) {
    const t = await sequelize.transaction();
    try {
      const {
        address_id,
        coupon_id,
        payment_method_id,
        payment_id,
        // order_summary,
        // order_Details_summary,
        name,
        email,
        contact_no,
      } = req.body;
      const order_summary = JSON.parse(req.body.order_summary);
      const order_Details_summary = JSON.parse(req.body.order_Details_summary);
      const appsetup = await App_Setup.findOne({
        transaction: t,
      });

      const user = {
        name,
        email,
        contact_no,
      };

      let contactExits = await CheckExits(
        Users,
        { contact_no: user?.contact_no },
        t,
      );
      let usercreate;

      if (!contactExits) {
        usercreate = await CreateNew(Users, user, t);

        await CreateNew(Wallet, { user_id: usercreate?.id }, t);
      } else {
        usercreate = contactExits;
      }

      // Check if the email already exists
      if (email) {
        const emailExits = await CheckExits(Users, { email: user?.email }, t);
        if (!emailExits) {
          usercreate = await CreateNew(Users, user, t);
          await CreateNew(Wallet, { user_id: usercreate?.id }, t);
        } else {
          usercreate = emailExits;
        }
      }

      const userId = usercreate?.id;
      const customer = await Users.findOne({
        where: { id: userId },
        transaction: t,
      });

      const invoice_number = await findUniqueinvoicenumberorder();

      const order = {
        user_id: userId,
        order_status_id: IDS.order_status.Delivered,
        // address_id,
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
      };

      const user_wallet = await CheckExits(Wallet, { user_id: userId }, t);

      const newOrder = await Product_Order.create(order, { transaction: t });

      //reward discount
      if (Number(order_summary?.reward_discount) > 0) {
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
      }

      // refer discount
      const UsersRefer = await CheckExits(Users_Refer, { refer_to: userId }, t);
      const orderCount = await Product_Order.count({
        where: { user_id: userId },
        transaction: t,
      });
      if (UsersRefer && orderCount === 1) {
        const refWallet = await Wallet.findOne({
          where: { user_id: UsersRefer.refer_by },
          transaction: t,
        });

        const currentAmount = parseFloat(refWallet?.amount || 0);

        const rewardAmount =
          (parseFloat(appsetup.refer_percentage) / 100) *
          parseFloat(order_summary.total_amount);

        await UpdateData(
          Wallet,
          {
            amount: currentAmount + rewardAmount,
          },
          { user_id: UsersRefer.refer_by },
          t,
        );
      }

      for (const item of order_Details_summary) {
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
            reward_discount: item.reward_discount,
            mrp: item.mrp,
            tax_percentage: item.tax_percentage,
            coupon_discount: item.coupon_discount,
            offer_discount: item.offer_discount,
            delivery_charges: item.delivery_charge,
            packing_charges: item.packing_charge,
            total_tax: item.total_tax,
            refer_discount: item.refer_discount,
            batch_no: selectedBatch?.batch_no,
            expiry_date: selectedBatch?.expiry_date,
          },
          t,
        );

        if (existingStock.general_stock > 0) {
          const newStock =
            Number(selectedBatch?.general_stock) - Number(item?.quantity);

          await UpdateData(
            Product_Variant_Stock,
            {
              general_stock: newStock,
            },
            { id: selectedBatch.id },
            t,
          );
        }

        // if (Number(existingStock?.general_stock) < Number(item?.quantity)) {
        //   await t.rollback();
        //   return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Low in stock");
        // }

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
          {
            general_stock: newGeneralStock,
          },
          { id: item.variant_id },
          t,
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
          t,
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
        t,
      );

      await CreateNew(Order_History, { order_id: newOrder?.id }, t);

      await t.commit();

      const pdf = await InvoiceGenerater(newOrder?.id);

      await mailOrder(
        appsetup?.email,
        newOrder?.invoice_no,
        customer?.name,
        order_summary?.total_amount,
      );

      return Base.sendResponse(res, HTTPS.CREATED, newOrder);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Order:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async CreatePrescription(req, res) {
    const t = await sequelize.transaction();
    try {
      const {
        // lens_option_id,
        user_id,
        lens_type_id,
        addon_id,
        prescriptions_type_id,
        vision,
        product_id,
        lense_product_id,
        a_size,
        b_size,
        dbl,
        fh,
      } = req.body;

      const data = {
        user_id: user_id,
        lens_type_id,
        addon_id,
        product_id,
        prescriptions_type_id,
        lense_product_id,
      };

      if (a_size) {
        data.a_size = a_size;
      }
      if (b_size) {
        data.b_size = b_size;
      }
      if (dbl) {
        data.dbl = dbl;
      }
      if (fh) {
        data.fh = fh;
      }

      if (req.files && req.files.pdf) {
        data.pdf = await File_Uploade(req.files?.pdf, "/uploads/prescription");
      }
      const prescription = await Prescriptions.create(data, { transaction: t });

      if (Number(prescriptions_type_id) === 1) {
        // Ensure vision is an object, not a string
        let parsedVision = vision;
        if (typeof vision === "string") {
          try {
            parsedVision = JSON.parse(vision);
          } catch (err) {
            console.error("Invalid JSON in vision field:", vision);
            parsedVision = {};
          }
        }
        const visionData = [];
        for (const eyeId in parsedVision) {
          for (const labelId in parsedVision[eyeId]) {
            for (const headId in parsedVision[eyeId][labelId]) {
              visionData.push({
                prescription_id: prescription.id,
                eye_type_id: eyeId,
                vission_type_id: labelId,
                eye_unit_id: headId,
                name: parsedVision[eyeId][labelId][headId],
              });
            }
          }
        }

        if (visionData.length > 0) {
          await Prescription_Details.bulkCreate(visionData, { transaction: t });
        }
      }

      await t.commit();
      return Base.sendResponse(res, HTTPS.CREATED, {
        prescription,
      });
    } catch (error) {
      await t.rollback();
      console.error("Prescription create error:", error);
      return Base.sendError(
        res,
        HTTPS.INTERNAL_SERVER_ERROR,
        "Error creating prescription.",
      );
    }
  }

  async GetSinglePrescription(req, res) {
    try {
      const id = req.params.id || "";
      const where = { user_id: id };
      const queryOptions = {
        include: [{ model: Prescription_Details }],
        where,
      };

      queryOptions.order = [["createdAt", "DESC"]];

      const prescription = await Prescriptions.findOne(queryOptions);

      // if (!prescription) {
      //   return Base.sendError(res, HTTPS.NOT_FOUND, "Prescription not found.");
      // }

      return Base.sendResponse(res, HTTPS.OK, prescription);
    } catch (error) {
      console.error("FindOne Prescription error:", error);
      return Base.sendError(
        res,
        HTTPS.INTERNAL_SERVER_ERROR,
        "Error fetching prescription.",
      );
    }
  }

  async findAllCancelOrder(req, res) {
    try {
      const searchOrderStatus = req.query.searchOrderStatus || "";
      const return_status_id = req.query.return_status_id || "";
      const sortOrder = req.query.sortOrder || "DESC";
      const term = req.query.term || "";

      const customer = req.query.customer || "";
      const page = parseInt(req.query.page) || 1;
      const per_page = parseInt(req.query.per_page) || 10;

      const from = req.query.from || "";
      const to = req.query.to || "";
      let start_time = req.query.start_time || "";
      let end_time = req.query.end_time || "";

      // Normalize time
      // const parseToTime = (value, fallback) => {
      //   const date = new Date(`1970-01-01T${value}`);
      //   return isNaN(date.getTime()) ? fallback : moment(date).format("HH:mm");
      // };

      function parseToTime(dateStr) {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? null : date;
      }
      start_time = parseToTime(start_time, "00:00");
      end_time = parseToTime(end_time, "23:59");

      // Build main where clause
      const where = { status: false };

      // if (searchOrderStatus) {
      //   where.order_status_id = searchOrderStatus;
      // }

      const whereClauseProduct = {};

      if (term) {
        whereClauseProduct.name = { [Op.like]: `%${term}%` };
      }
      const whereClauseCustomer = {};

      if (customer) {
        whereClauseCustomer.name = { [Op.like]: `%${customer}%` };
      }
      // Build time slot filter
      const timeSlotWhere = {};
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

      // if (start_time && end_time) {
      //   timeSlotWhere.from = { [Op.gte]: start_time };
      //   timeSlotWhere.to = { [Op.lte]: end_time };
      // }

      const include = [
        {
          model: Product,
          paranoid: true,
          where: whereClauseProduct,
          include: [
            { model: p_category },
            { model: p_sub_category },
            { model: p_child_category },
          ],
        },

        {
          model: Product_Order,
          paranoid: true,

          include: [
            { model: Order_Cancellation, include: [{ model: Cancel_Reason }] },
            { model: Users, where: whereClauseCustomer },
            { model: Order_status },
            {
              model: User_Address,
              paranoid: true,
              include: [
                {
                  model: Users_Address_Details,
                  paranoid: true,
                  include: [
                    { model: Country },
                    { model: State },
                    { model: City },
                    { model: Pincode },
                    { model: Area },
                  ],
                },
              ],
            },
            { model: Order_History },
            { model: Payment_Method },
            {
              model: Time_Slot,
              where: timeSlotWhere,
            },
            { model: Users, as: "delivery_boy" },
          ],
        },
      ];

      const { count, rows: data } = await Product_Order_Detail.findAndCountAll({
        include,
        where,
        order: [["createdAt", sortOrder]],
        offset: (page - 1) * per_page,
        limit: per_page,
        distinct: true,
      });

      const total_pages = Math.ceil(count / per_page);

      return Base.sendResponse(res, HTTPS.OK, {
        data,
        current_page: page,
        total_pages,
        per_page,
        total: count,
        search_name: term,
      });
    } catch (error) {
      console.error("Error fetching Orders:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async getDownloadExcelOrderList(req, res) {
    try {
      // Extract filters and pagination from req.query or req.body (adjust as needed)
      const searchOrderStatus = req.query.searchOrderStatus || "";
      const return_status_id = req.query.return_status_id || "";
      const sortOrder = req.query.sortOrder || "DESC";
      const term = req.query.term || "";

      const customer = req.query.customer || "";
      const page = parseInt(req.query.page) || 1;
      const per_page = parseInt(req.query.per_page) || 10;

      const from = req.query.from || "";
      const to = req.query.to || "";
      let start_time = req.query.start_time || "";
      let end_time = req.query.end_time || "";

      // Normalize time
      const parseToTime = (value, fallback) => {
        const date = new Date(`1970-01-01T${value}`);
        return isNaN(date.getTime()) ? fallback : moment(date).format("HH:mm");
      };

      start_time = parseToTime(start_time, "00:00");
      end_time = parseToTime(end_time, "23:59");

      // Build main where clause
      const where = {};

      if (searchOrderStatus) {
        where.order_status_id = searchOrderStatus;
      }

      const whereClauseProduct = {};

      if (term) {
        whereClauseProduct.name = { [Op.like]: `%${term}%` };
      }
      const whereClauseCustomer = {};

      if (customer) {
        whereClauseCustomer.name = { [Op.like]: `%${customer}%` };
      }
      // Build time slot filter
      const timeSlotWhere = {};
      if (from && to) {
        const fromDate = moment(from).startOf("day").toDate(); // 00:00:00
        const toDate = moment(to).endOf("day").toDate(); // 23:59:59
        where.delivery_date = { [Op.between]: [fromDate, toDate] };
      } else if (from) {
        const fromDate = moment(from).startOf("day").toDate();
        where.delivery_date = { [Op.gte]: fromDate };
      } else if (to) {
        const toDate = moment(to).endOf("day").toDate();
        where.delivery_date = { [Op.lte]: toDate };
      }

      if (start_time && end_time) {
        timeSlotWhere.from = { [Op.gte]: start_time };
        timeSlotWhere.to = { [Op.lte]: end_time };
      }

      const productCategory = req.query.productCategory || "";

      const ProductDetails = { status: true };

      if (productCategory) {
        ProductDetails.product_id = productCategory;
      }
      // Build include with return status filter
      const include = [
        { model: Users, where: whereClauseCustomer },
        { model: Order_status },
        { model: User_Address },
        { model: Order_History },
        { model: Payment_Method },
        { model: Time_Slot },
        { model: Users, as: "delivery_boy" },
        {
          model: Product_Order_Detail,
          where: ProductDetails,
          include: [
            {
              model: Product,
              // where: whereClauseProduct,
              include: [{ model: p_category }, { model: p_sub_category }],
            },
          ],
        },
        {
          model: Return_Order,
          include: [
            return_status_id
              ? { model: Return_Status, where: { id: return_status_id } }
              : { model: Return_Status },
            { model: Return_Reason },
            { model: Users },
          ],
        },
      ];

      // Fetch all matching orders (no pagination for export)
      const orders = await Product_Order.findAll({
        where,
        include,
        order: [["createdAt", sortOrder]],
        distinct: true,
      });

      // Create workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Order List");

      // Add header row (adjust columns as per your desired export)
      worksheet.addRow([
        "Sr No",
        "Order Date & Time",
        "Invoice No",
        "Buyer Name",
        "Buyer Phone",
        "Buyer Address",
        "Total MRP",
        "Total Tax",
        "Grand Total",
        "Order Status",
        "Payment Method",
        "Delivery Boy",
        "Return Status",
      ]);

      // Populate rows
      orders.forEach((order, index) => {
        const buyer = order.User || {};
        const buyerAddress = order.User_Address || {};
        const orderStatus = order.Order_status || {};
        const paymentMethod = order.Payment_Method || {};
        const deliveryBoy = order.delivery_boy || {};
        const returnOrder = order.Return_Order || {};
        const returnStatus = returnOrder?.Return_Status || {};

        // Compose buyer address string
        const buyerFullAddress =
          [
            buyerAddress.building,
            buyerAddress.floor,
            buyerAddress.apartment,
            buyerAddress.street,
            buyerAddress.direction,
          ]
            .filter(Boolean)
            .join(", ") || "-";

        worksheet.addRow([
          index + 1,
          moment(order.createdAt)
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DD hh:mm A"),
          order.invoice_no || "-",
          buyer.name || "-",
          buyer.contact_no || "-",
          buyerFullAddress,
          order.total_mrp != null ? order.total_mrp : "-",
          order.total_tax != null ? order.total_tax : "-",
          order.total_amount != null ? order.total_amount : "-",
          orderStatus.name || "-",
          paymentMethod.name || "-",
          deliveryBoy.name || "-",
          returnStatus.name || "-",
        ]);
      });

      // Write to temp file
      const filePath = path.join(__dirname, "Order_List.xlsx");
      await workbook.xlsx.writeFile(filePath);

      // Send the file and delete after
      res.download(filePath, "Order_List.xlsx", (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error downloading file.");
        }
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr)
            console.error("Failed to delete temp file:", unlinkErr);
        });
      });
    } catch (error) {
      console.error("Error generating order list Excel:", error);
      return res.status(500).send("Error generating Excel file.");
    }
  }

  // async findOne(req, res) {
  //   try {
  //     const include = [
  //       {
  //         model: Store_Detail,
  //       },
  //       { model: Users },
  //       { model: Order_status },
  //       { model: Restaurant_Service },
  //       { model: Payment_Type },
  //       { model: User_Address },
  //       { model: Order_History },
  //       { model: Users, as: "delivery_boy" },
  //       {
  //         model: Product_Order_Detail,
  //         include: [
  //           {
  //             model: Product,
  //             include: [{ model: p_category }, { model: p_sub_category }],
  //           },
  //           {
  //             model: Order_Add_On,
  //             include: [{ model: Food_Add_On }],
  //           },
  //         ],
  //       },
  //       {
  //         model: Return_Order,
  //         required: false,
  //         include: [
  //           { model: Return_Status },
  //           { model: Return_Reason },
  //           { model: Users },
  //         ],
  //       },
  //       {
  //         model: Replace_Order,
  //         required: false,
  //         include: [{ model: ReplaceOrderStatus }],
  //       },
  //       {
  //         model: RefundOrders,
  //         required: false,
  //       },
  //     ];

  //     const { count, rows: data } = await Product_Order.findAndCountAll({
  //       include: include,
  //       where: {
  //         id: req.params.id,
  //       },

  //       distinct: true,
  //     });

  //     const total_pages = Math.ceil(count / per_page);

  //     // Send the response
  //     return Base.sendResponse(res, HTTPS.OK, {
  //       data: data,
  //       current_page: page,
  //       total_pages: total_pages,
  //       per_page: per_page,
  //       total: data?.length,
  //       search_name: term,
  //     });
  //   } catch (error) {
  //     console.error("Error fetching Orders:", error);
  //     return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
  //   }
  // }

  async ChangeOrderStatus(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { order_status_id } = req.body;

      const exists = await CheckExits(Product_Order, { id: id }, t);

      if (!exists) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Order Not Found");
      }

      await UpdateData(
        Product_Order,
        { order_status_id: order_status_id },
        { id: id },
        t,
      );

      const data = {};
      if (order_status_id === IDS.order_status.PickupScheduled) {
        data.delivery_boy_assigned = moment
          .utc()
          .add(5, "hours")
          .add(30, "minutes")
          .toDate();
      } else if (order_status_id === IDS.order_status.Shipped) {
        data.out_for_delivery = moment
          .utc()
          .add(5, "hours")
          .add(30, "minutes")
          .toDate();
      } else if (order_status_id === IDS.order_status.Delivered) {
        data.deliveredAt = moment
          .utc()
          .add(5, "hours")
          .add(30, "minutes")
          .toDate();
      } else if (order_status_id === IDS.order_status.Returned) {
        data.returnedAt = moment
          .utc()
          .add(5, "hours")
          .add(30, "minutes")
          .toDate();
      }

      await UpdateData(Order_History, { data }, { order_id: id }, t);

      if (Number(order_status_id) === Number(IDS.order_status.Processing)) {
        const newCreated = await CreateNew(
          Notification,
          {
            order_id: id,
            user_id: exists.user_id,
            message: "Accept Order successfully",
          },
          t,
        );
        await update_order(Number(id), exists.user_id);
        const user = await CheckExits(Users, { id: exists?.user_id }, t);
        await AdminNotifications(user?.device_key, newCreated);
      } else if (
        Number(order_status_id) === Number(IDS.order_status.Cancelled)
      ) {
        await UpdateData(
          Product_Order,
          { cancel_reason: req.body.reason },
          { id: id },
          t,
        );
        // if (
        //   Number(exists.payment_method_id) ===
        //     Number(IDS.PaymentMethods.Online) ||
        //   Number(exists.payment_method_id === IDS.PaymentMethods.Card)
        // ) {
        //   const walletamount = await Wallet.findOne({
        //     where: {
        //       user_id: exists.user_id,
        //     },
        //     transaction: t,
        //   });

        //   await UpdateData(
        //     Wallet,
        //     {
        //       amount:
        //         parseFloat(walletamount?.amount) +
        //         parseFloat(exists?.total_amount),
        //     },
        //     { user_id: exists.user_id },
        //     t
        //   );

        //   const walletHistory = {
        //     wallet_id: walletamount?.id,
        //     transaction_type: "credit",
        //     amount: parseFloat(exists?.total_amount),
        //     description: "Order cancelled",
        //   };
        //   await CreateNew(Wallet_History, walletHistory, t);
        // }

        // const newCreated = await CreateNew(
        //   Notification,
        //   {
        //     order_id: id,
        //     user_id: exists.user_id,
        //     message: "The order has been cancelled",
        //   },
        //   t
        // );

        // await update_order(Number(id), exists.user_id);
        // const user = await CheckExits(Users, { id: exists?.user_id }, t);
        // await AdminNotifications(user?.device_key, newCreated);
      }

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Order updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Order:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async AcceptOrRejectOrder(req, res) {
    const t = await sequelize.transaction();
    try {
      const { type } = req.query;
      const { id } = req.params;

      if (type === "accept") {
        const update = await UpdateData(
          Product_Order,
          {
            order_status_id: IDS.order_status.Processing,
          },
          { id: id },
          t,
        );
        if (!update) {
          await t.rollback();
          return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Order Not Found");
        }

        t.commit();

        return Base.sendResponse(
          res,
          HTTPS.ACCEPTED,
          "Order accepted successfully",
        );
      } else if (type === "reject") {
        const update = await UpdateData(
          Product_Order,
          {
            order_status_id: IDS.order_status.Cancelled,
          },
          { id: id },
          t,
        );
        if (!update) {
          await t.rollback();
          return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Order Not Found");
        }

        t.commit();

        return Base.sendResponse(
          res,
          HTTPS.ACCEPTED,
          "Order rejected successfully",
        );
      }
    } catch (error) {
      await t.rollback();
      console.error("Error Accepting Order:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async AssignDeliveryBoy(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { delivery_boy_id } = req.body;

      const exists = await CheckExits(Product_Order, { id: id }, t);

      if (!exists) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Order Not Found");
      }

      const update = await UpdateData(
        Product_Order,
        {
          // order_status_id: IDS.order_status.PickupScheduled,
          delivery_boy_id: delivery_boy_id,
        },
        { id: id },
        t,
      );

      const check = await Order_Payment_Detail.findOne({
        where: {
          order_id: id,
        },
        transaction: t,
      });

      if (check) {
        await UpdateData(
          Order_Payment_Detail,
          {
            delivery_boy_id: delivery_boy_id,
          },
          { order_id: id },
          t,
        );
      }
      // else {
      //   await CreateNew(
      //     Order_Payment_Detail,
      //     { delivery_boy_id: delivery_boy_id, order_id: id },
      //     t
      //   );
      // }

      await UpdateData(
        Order_History,
        {
          delivery_boy_assigned: moment
            .utc()
            .add(5, "hours")
            .add(30, "minutes")
            .toDate(),
        },
        { order_id: id },
        t,
      );

      // const newCreated = await CreateNew(
      //   Notification,
      //   {
      //     order_id: id,
      //     user_id: exists.user_id,
      //     message: "A delivery boy has been assigned to your order.",
      //   },
      //   t
      // );

      const user = await CheckExits(Users, { id: exists?.user_id }, t);
      // await AdminNotifications(user?.device_key, newCreated);

      const newCreatedDelivery = await CreateNew(
        Notification,
        {
          order_id: id,
          user_id: delivery_boy_id,
          message: "You have been assigned a new delivery order.",
        },
        t,
      );

      await update_order(Number(id), user.id);

      await update_user(delivery_boy_id);

      const DeliveryBoy = await CheckExits(Users, { id: delivery_boy_id }, t);
      await AdminNotifications(DeliveryBoy?.device_key, newCreatedDelivery);

      await update_user(DeliveryBoy.id);

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Delivery boy asigned successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Order:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async AssignReturnDeliveryBoy(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { delivery_boy_id } = req.body;

      const exists = await CheckExits(Product_Order, { id: id }, t);

      if (!exists) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Order Not Found");
      }

      const dataToUpdate = {
        // return_status_id: IDS.return_status.PickupScheduled,
        delivery_boy_id: delivery_boy_id,
      };
      await UpdateData(Return_Order, dataToUpdate, { order_id: id }, t);

      await UpdateData(
        Order_History,
        {
          returnScheduledAt: moment
            .utc()
            .add(5, "hours")
            .add(30, "minutes")
            .toDate(),
        },
        { order_id: id },
        t,
      );

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Delivery boy asigned successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Order:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async ExpiryDate(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { delivery_boy_id, expiry_date } = req.body;

      const exists = await CheckExits(Product_Order, { id: id }, t);

      if (!exists) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Order Not Found");
      }

      const dataToUpdate = {
        expiry_date: expiry_date,
      };
      await UpdateData(Product_Order, dataToUpdate, { id: id }, t);

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Delivery boy asigned successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Order:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new ProductOrderController();
