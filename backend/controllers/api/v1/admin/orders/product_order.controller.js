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
  OrderStocks,
  Stocks,
  LensType,
  Addon,
  Prescriptions_Type,
  Prescriptions,
  Prescription_Details,
  Product_Stock,
  Stock_History,
  Coupon,
  Coupon_Type,
  Offer,
  Coupon_Brand,
  Brand,
  StockStatus,
  Coupon_History,
  Advance_Payment,
  RefundOrders,
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
const { mailOrder, commonMail } = require("../../../../../helper/NodeMailer");
const { InvoiceGenerater } = require("../../../../../helper/invoice_generater");
const { formatDateTime } = require("../../../../../helper/common/function");
const { sendWatsappMessage } = require("../../../../../helper/WhatsAppMessage");
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

      const productCategory = req.query.productCategory || "";
      const ProductDetails = { status: true };

      if (productCategory) {
        ProductDetails.product_id = productCategory;
      }

      const include = [
        { model: Advance_Payment, include: [{ model: Payment_Method }] },
        { model: Users, paranoid: false, where: whereClauseCustomer },
        { model: Order_status, required: false },
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
        { model: Order_History },
        { model: Payment_Method },

        // { model: Users, as: "delivery_boy" },
        {
          model: Product_Order_Detail,

          where: ProductDetails,
          include: [
            { model: Stocks, include: [{ model: StockStatus }] },
            {
              model: Stocks,
              as: "Lens_Stock",
              include: [{ model: StockStatus }],
            },
            {
              model: Product,
              paranoid: false,
              include: [
                {
                  model: Stocks,
                  as: "Stocks",
                  required: false,
                  where: { stock_status_id: IDS.StockStatus.Available },
                },
                { model: p_category, paranoid: false },
              ],
            },

            {
              model: Prescriptions,
              include: [
                {
                  model: Prescription_Details,
                },

                {
                  model: Prescriptions_Type,
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
        // {
        //   model: Return_Order,
        //   include: [
        //     return_status_id
        //       ? { model: Return_Status, where: { id: return_status_id } }
        //       : { model: Return_Status },
        //     { model: Return_Reason },
        //     { model: Users },
        //   ],
        // },
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

  async CalculationOrder(req, res) {
    const t = await sequelize.transaction();
    try {
      const { coupon_id, selected_id, reward_status, code } = req.body;
      const userId = req?.body?.user_id;

      // Products array from body (already provided by you)
      const cartListItems =
        typeof req.body.products === "string"
          ? JSON.parse(req.body.products)
          : req.body.products;

      const appsetup = await App_Setup.findOne({}, { transaction: t });
      const wallet = await Wallet.findOne({
        where: { user_id: userId },
        transaction: t,
      });

      const order = { no_of_item: cartListItems?.length || 0 };
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
      console.log("1");
      console.log("cartListItems",cartListItems);
      for (const item of cartListItems) {
        let productData = null;
        if (item.product_id) {
          productData = await Product.findOne({
            where: { id: item.product_id },
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
            transaction: t,
          });
        }

        let lenseData = null;
        if (item.lense_id) {
          lenseData = await Product.findOne({
            where: { id: item.lense_id },
            include: [
              { model: Brand, paranoid: false },
              { model: p_category, paranoid: false },
            ],
            transaction: t,
          });
        }

        let addonData = null;
        if (item.addon_id) {
          addonData = await Addon.findOne({
            where: { id: item.addon_id },
            transaction: t,
          });
        }

        const quantity = Number(item?.quantity || 0);
        const mrp = parseFloat(productData?.mrp || 0);
        const selling_price = parseFloat(productData?.base_amount || 0);
        const discount = parseFloat(productData?.discount_amount || 0);
        const taxamount = parseFloat(productData?.tax_amount ?? 0);
        const tax = taxamount * quantity;
        const taxPercentage = parseFloat(productData?.tax_percentage || 0) || 0;
        const discountPercentage = parseFloat(productData?.discount || 0) || 0;

        const addon_price_each = parseFloat(addonData?.price || 0);
        const lense_price = parseFloat(lenseData?.base_amount || 0);
        const lense_mrp = parseFloat(lenseData?.mrp || 0);
        console.log("lense_mrp",parseFloat(lenseData?.mrp || 0));
        const lense_discount = parseFloat(lenseData?.discount_amount || 0);
        const lense_tax = parseFloat(lenseData?.tax_amount || 0);

        const lenseTaxPercentage = parseFloat(lenseData?.tax_percentage || 0);
        const lensediscountPercentage = parseFloat(lenseData?.discount || 0);
        const totalMrp = quantity * mrp;
        const totalSellingPrice = quantity * selling_price;
        const totalAddOnPrice = quantity * addon_price_each;
        const totalLensePrice = quantity * lense_price;

        let bapatofferDiscount = 0;
        let discountTypeId = 0;
        // If offered product exists in productData -> compute bapatofferDiscount and discountTypeId similar to first implementation.
        // Example (commented):
        // const offered = productData?.Offered_Product;
        // if (offered && offered.Offer?.discount) { ... compute and set bapatofferDiscount and discountTypeId and add to totalOfferDiscount }

        productSubtotals.push({
          // identifiers
          product_id: item.product_id,
          cart_id: item.cart_id || null,
          variant_id: item.variant_id || null,
          barcode_status: productData?.barcode_status || null,

          // frame info
          brand_id: productData?.Brand?.id || productData?.brand_id || null,
          category_id:
            productData?.p_category?.id || productData?.category_id || null,
          base_subtotal: totalSellingPrice,

          // lens info
          lense_id: lenseData?.id || item.lense_id || null,
          stock_lense_id: item.stock_lense_id || null,
          lens_type_id: lenseData?.lens_type_id || item.lens_type_id || null,
          lense_brand_id: lenseData?.Brand?.id || lenseData?.brand_id || null,
          lense_category_id:
            lenseData?.p_category?.id || lenseData?.category_id || null,
          lense_selling_price: totalLensePrice,
          lense_discount: lense_discount,
          lense_price: lense_price,
          lense_mrp: lense_mrp,
          lense_tax: lense_tax,
          barcode_no: item.barcode_no,
          // taxes & additions
          quantity,
          mrp,
          selling_price,
          tax: tax, // already multiplied by qty
          addon_price: totalAddOnPrice,

          // discounts (initial)
          offer_discount: bapatofferDiscount,
          discount_type: discountTypeId,
          coupon_discount: 0, // frame coupon
          lense_coupon_discount: 0, // lens coupon
          discount: discount,

          // totals
          total_mrp: totalMrp,
          total_selling_price: totalSellingPrice,
          total_discount: discount,

          // links
          prescription_id: item.prescription_id || null,
          stock_lense_id: item.stock_lense_id || null,

          tax_percentage: taxPercentage,
          discount_percentage: discountPercentage,
          lense_tax_percentage: lenseTaxPercentage,
          lense_discount_percentage: lensediscountPercentage,
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
      let isCouponValid = true;
      let couponMessage = null;
      let coupon = null;
      const now = new Date();
      if (code) {
        coupon = await Coupon.findOne({
          include: [{ model: Coupon_Type }, { model: Coupon_Brand }],
          where: { code: code },
          transaction: t,
        });

        if (!coupon) {
          couponMessage = "Invalid coupon";
          isCouponValid = false;
        } else {
          const couponActive = await Coupon.findOne({
            include: [{ model: Coupon_Brand }],
            where: {
              status: true,
              code: code,
            },
          });
          if (!couponActive) {
            couponMessage = "Coupon Not Active.";
            isCouponValid = false;
          } else if (
            Number(IDS.CouponCategoryType.Category) ===
              Number(couponActive.coupon_type_id) &&
            couponActive?.category_id
          ) {
            const cartFrameCategories = cartListItems?.map(
              (item) => item?.category_id,
            );

            const cartLensCategories = cartListItems?.map(
              (item) => item?.lense_category_id,
            );

            const allCategories = [
              ...cartFrameCategories,
              ...cartLensCategories,
            ];

            const categoryMatch = allCategories.includes(
              Number(couponActive.category_id),
            );

            if (!categoryMatch) {
              couponMessage = "This coupon is not valid for selected Category.";
              isCouponValid = false;
            }

            if (Number(couponActive.Coupon_Brands?.length > 0)) {
              const couponBrandIds = couponActive?.Coupon_Brands?.map((b) =>
                Number(b.brand_id),
              );

              const cartBrandIds = cartListItems
                .map((item) => item?.brand_id)
                .filter(Boolean)
                .map(Number);

              if (couponBrandIds && couponBrandIds.length > 0) {
                const brandMatch = cartBrandIds.some((id) =>
                  couponBrandIds.includes(id),
                );

                if (!brandMatch) {
                  couponMessage =
                    "This coupon is not valid for selected Brand.";
                  isCouponValid = false;
                }
              }
            }
          }
          if (couponActive) {
            if (couponActive?.s_date && now < new Date(couponActive?.s_date)) {
              couponMessage = "This coupon is not active yet.";
              isCouponValid = false;
            }

            if (couponActive?.e_date && now > new Date(couponActive?.e_date)) {
              couponMessage = "This coupon has expired.";
              isCouponValid = false;
            }

            if (parseFloat(couponActive?.required_amount) > Number(total_mrp)) {
              couponMessage = `Booking amount must be at least Rs. ${couponActive.required_amount}`;
              isCouponValid = false;
            }
          }

          let totalCount = 0;

          const couponHistory = await Coupon_History.findAll({
            where: {
              coupon_id: couponActive.id,
            },
          });

          couponHistory.forEach((history) => {
            totalCount++;
          });

          if (couponActive?.use_per_coupon <= totalCount) {
            couponMessage = `This coupon has been fully used`;
            isCouponValid = false;
          }

          let totalCountCoupen = 0;

          // Count occurrences of user_id
          couponHistory.forEach((history) => {
            if (Number(history?.user_id) === userId) {
              totalCountCoupen++;
            }
          });

          // Check if the use_per_customer condition is met
          if (
            Number(couponActive?.use_per_customer) <= Number(totalCountCoupen)
          ) {
            couponMessage = `You have reached the maximum limit for this coupon`;
            isCouponValid = false;
          }
        }
      }

      if (isCouponValid && coupon) {
        couponApplied = true;
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
          }
          // GLOBAL coupon: applies to both frame and lens parts
          else if (ctypeId === IDS.CouponTypeId.Global) {
            eligibleFrameProducts.push(item);
            eligibleLensProducts.push(item);
          }
        }

        // Calculate totals for proportional distribution
        const totalFrame = eligibleFrameProducts.reduce(
          (s, p) => s + (p.mrp || 0),
          0,
        );
        const totalLens = eligibleLensProducts.reduce(
          (s, p) => s + (p.lense_mrp || 0),
          0,
        );

        const applyFrameDiscount = totalFrame > 0;
        const applyLensDiscount = totalLens > 0;

        // Apply Frame Coupon Discount proportionally across eligibleFrameProducts
        if (applyFrameDiscount) {
          for (const item of eligibleFrameProducts) {
            let d = 0;
            const itemBase = item.mrp || 0;

            if (coupon.discount_type_id === IDS.discountTypes.percentage) {
              const percent = parseFloat(coupon.discount) || 0;
              d = (itemBase * percent) / 100;
            } else {
              // flat: distribute proportionally by base_subtotal among frames
              const flat = parseFloat(coupon.discount) || 0;
              // For global flat, we will distribute between frame & lens below (Option A),
              // but for frame-only distribution here, do proportional share of frame portion.
              d = (itemBase / totalFrame) * flat;
            }

            item.coupon_discount = (item.coupon_discount || 0) + Number(d);
            totalCouponDiscount += Number(d);
          }
        }

        // Apply Lens Coupon Discount proportionally across eligibleLensProducts
        if (applyLensDiscount) {
          for (const item of eligibleLensProducts) {
            let ld = 0;
            const lensBase = item.lense_mrp || 0;

            if (coupon.discount_type_id === IDS.discountTypes.percentage) {
              const percent = parseFloat(coupon.discount) || 0;
              ld = (lensBase * percent) / 100;
            } else {
              const flat = parseFloat(coupon.discount) || 0;

              ld = (lensBase / totalLens) * flat;
            }

            item.lense_coupon_discount =
              (item.lense_coupon_discount || 0) + Number(ld);
            totalCouponDiscount += Number(ld);
          }
        }

        if (
          coupon.discount_type_id !== IDS.discountTypes.percentage &&
          coupon.Coupon_Type?.id === IDS.CouponTypeId.Global
        ) {
          // Reset previously added flat amounts for frames and lenses and re-distribute combined.
          // First, compute combined total contribution (frame + lens)
          const combinedFrameItems = eligibleFrameProducts;
          const combinedLensItems = eligibleLensProducts;
          const combinedTotal = totalFrame + totalLens;
          if (combinedTotal > 0) {
            for (const item of combinedFrameItems) {
              // Only reset coupon_discount if coupon discount_type is flat (we may have added a flat earlier)
              item.coupon_discount = 0;
            }
            for (const item of combinedLensItems) {
              item.lense_coupon_discount = 0;
            }

            // Re-distribute flat across combined (frame + lens) proportionally by (frame base_subtotal + lens_selling_price)
            for (const item of productSubtotals) {
              const frameShare = item.mrp || 0;
              const lensShare = item.lense_mrp || 0;
              const combinedShare = frameShare + lensShare;
              if (combinedShare <= 0) continue;

              const combinedPortion = combinedShare / combinedTotal;
              const combinedFlatValue =
                combinedPortion * parseFloat(coupon.discount || 0);

              // split combinedFlatValue into frame & lens part according to their relative share
              const framePart =
                frameShare > 0
                  ? (frameShare / combinedShare) * combinedFlatValue
                  : 0;
              const lensPart =
                lensShare > 0
                  ? (lensShare / combinedShare) * combinedFlatValue
                  : 0;

              item.coupon_discount =
                (item.coupon_discount || 0) + Number(framePart);
              item.lense_coupon_discount =
                (item.lense_coupon_discount || 0) + Number(lensPart);
            }

            // Recompute totalCouponDiscount from scratch for all items (to ensure accuracy)
            totalCouponDiscount = productSubtotals.reduce(
              (s, p) =>
                s +
                (Number(p.coupon_discount || 0) +
                  Number(p.lense_coupon_discount || 0)),
              0,
            );
          }
        }

        // If no eligible items found set coupon message (optional)
        if (!applyFrameDiscount && !applyLensDiscount) {
          couponMessage =
            couponMessage || "Coupon not applicable to selected items";
        }
      }

      // STEP 4: Calculate orderDetails and totals (tax, delivery, addons, lens, coupons, rewards)
      let total_tax = 0;
      let total_amount_before_reward = 0;

      const orderDetails = productSubtotals.map((item) => {
        const frameCoupon = Number(item.coupon_discount || 0);
        const lensCoupon = Number(item.lense_coupon_discount || 0);

        // After frame-level discounts
        const baseAfterFrameDiscount =
          (item.base_subtotal || 0) -
          Number(item.offer_discount || 0) -
          frameCoupon;

        const lenseAfterLensDiscount =
          (item.lense_selling_price || 0) - lensCoupon;

        const productDeliveryCharge =
          (deliveryCharges || 0) / (order.no_of_item || 1);

        // tax stored as qty * taxamount
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
          coupon_discount: Number(frameCoupon || 0).toFixed(2), // frame coupon
          lense_coupon_discount: Number(lensCoupon || 0).toFixed(2), // lens coupon
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
          lense_id: item.lense_id || null,
          stock_lense_id: item.stock_lense_id || null,
          lens_type_id: item.lens_type_id || null,
          barcode_no: item.barcode_no,

          tax_percentage: Number(item.tax_percentage || 0).toFixed(2),
          discount_percentage: Number(item.discount_percentage || 0).toFixed(2),
          lense_tax_percentage: Number(item.lense_tax_percentage || 0).toFixed(
            2,
          ),
          lense_discount_percentage: Number(
            item.lense_discount_percentage || 0,
          ).toFixed(2),
        };
      });

      // STEP 5: Apply reward wallet usage (if requested)
      let rewardDiscount = 0;
      if (
        reward_status &&
        wallet?.amount > 0 &&
        total_amount_before_reward > 0
      ) {
        const halfOrder = total_amount_before_reward / 2;
        rewardDiscount = wallet.amount >= halfOrder ? halfOrder : wallet.amount;

        // Distribute reward discount proportionally across orderDetails (by total_amount)
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
  }

  // async CreateOrder(req, res) {
  //   const t = await sequelize.transaction();
  //   try {
  //     const {
  //       payment_method_id,
  //       payment_id,
  //       advance_amount,
  //       gst_number,
  //       doctor_name,
  //     } = req.body;
  //     const order_summary = JSON.parse(req.body.order_summary);
  //     const order_Details_summary = JSON.parse(req.body.order_Details_summary);
  //     const appsetup = await App_Setup.findOne({
  //       transaction: t,
  //     });

  //     const userId = req.body.user_id;

  //     const customer = await Users.findOne({
  //       where: { id: userId },
  //       transaction: t,
  //     });

  //     const invoice_number = await findUniqueinvoicenumberorder();

  //     const order = {
  //       user_id: userId,
  //       order_status_id: IDS.order_status.Processing,
  //       // address_id,
  //       no_of_item: order_summary?.no_of_item,
  //       invoice_no: invoice_number,
  //       delivery_charges: order_summary.total_delivery_charges,
  //       payment_method_id,
  //       total_coupon_discount: order_summary.total_coupon_discount,
  //       total_offer_discount: order_summary.total_offer_discount,
  //       total_amount: order_summary.total_amount,
  //       total_tax: order_summary.total_tax,
  //       total_mrp: order_summary.total_mrp,
  //       reward_discount: order_summary.reward_discount,
  //       total_selling_price: order_summary.total_selling_price,
  //       total_addon_price: order_summary.total_addon_price,
  //       total_lense_price: order_summary.total_lense_price,
  //       total_discount: order_summary.total_discount,
  //     };
  //     if (gst_number) {
  //       order.gst_number = gst_number;
  //     }
  //     if (doctor_name) {
  //       order.doctor_name = doctor_name;
  //     }
  //     const user_wallet = await CheckExits(Wallet, { user_id: userId }, t);

  //     const newOrder = await Product_Order.create(order, { transaction: t });

  //     for (const item of order_Details_summary) {
  //       let stock = await Stocks.findOne({
  //         where: {
  //           product_id: item.product_id,
  //           stock_status_id: IDS?.StockStatus?.Available,
  //         },
  //         transaction: t,
  //       });
  //       if (stock) {
  //         await UpdateData(
  //           Stocks,
  //           {
  //             stock_status_id: IDS?.StockStatus?.Selled,
  //           },
  //           { id: stock.id },
  //           t,
  //         );
  //         await CreateNew(
  //           Stock_History,
  //           {
  //             stock_id: stock?.id,
  //             name: "Stock sale",
  //           },
  //           t,
  //         );
  //       } else {
  //         stock = await Stocks.create(
  //           {
  //             product_id: item.product_id,
  //             stock_status_id: IDS?.StockStatus?.Dummy,
  //           },
  //           { transaction: t },
  //         );
  //         await CreateNew(
  //           Stock_History,
  //           {
  //             stock_id: stock?.id,
  //             name: "Stock add Dummy",
  //           },
  //           t,
  //         );
  //       }

  //       let lensstock;
  //       if (item.lense_id) {
  //         const existingLenseStock = await Product.findOne({
  //           where: { id: item.lense_id },
  //           transaction: t,
  //         });
  //         lensstock = await Stocks.findOne({
  //           where: {
  //             product_id: item.lense_id,
  //             stock_status_id: IDS?.StockStatus?.Available,
  //           },
  //           transaction: t,
  //         });
  //         if (lensstock) {
  //           await UpdateData(
  //             Stocks,
  //             {
  //               stock_status_id: IDS?.StockStatus?.Selled,
  //             },
  //             { id: stock.id },
  //             t,
  //           );
  //           await CreateNew(
  //             Stock_History,
  //             {
  //               stock_id: lensstock?.id,
  //               name: "Stock sale",
  //             },
  //             t,
  //           );
  //         } else {
  //           lensstock = await Stocks.create(
  //             {
  //               product_id: item.lense_id,
  //               stock_status_id: IDS?.StockStatus?.Dummy,
  //             },
  //             { transaction: t },
  //           );
  //           await CreateNew(
  //             Stock_History,
  //             {
  //               stock_id: lensstock?.id,
  //               name: "Stock add dummy",
  //             },
  //             t,
  //           );
  //         }
  //         const newLenseStock =
  //           Number(existingLenseStock?.available_stock) -
  //           Number(item?.quantity);
  //         await UpdateData(
  //           Product,
  //           {
  //             available_stock: newLenseStock,
  //           },
  //           { id: item.lense_id },
  //           t,
  //         );
  //       }

  //       const orderDetail = await CreateNew(
  //         Product_Order_Detail,
  //         {
  //           order_id: newOrder?.id,
  //           product_id: item.product_id,
  //           variant_id: item.variant_id,
  //           quantity: item.quantity,
  //           total_selling_price: item.total_selling_price,
  //           total_tax: item.total_tax,
  //           total_amount: item.total_amount,
  //           total_mrp: item.total_mrp,
  //           selling_price: item.selling_price,
  //           reward_discount: item.reward_discount,
  //           mrp: item.mrp,
  //           tax_percentage: item.tax_percentage,
  //           coupon_discount: item.coupon_discount,
  //           offer_discount: item.offer_discount,
  //           delivery_charges: item.delivery_charge,
  //           packing_charges: item.packing_charge,
  //           total_tax: item.total_tax,
  //           refer_discount: item.refer_discount,
  //           // batch_no: selectedBatch?.batch_no,
  //           // expiry_date: selectedBatch?.expiry_date,
  //           total_addon_price: item.total_addon_price,
  //           total_lense_price: item.total_lense_price,
  //           prescription_id: item.prescription_id,
  //           stock_id: stock?.id,
  //           total_discount: item.total_discount,
  //           lense_stock_id: item.lense_id ? lensstock?.id : null,
  //           tax_percentage: item.tax_percentage,
  //           discount_percentage: item.discount_percentage,
  //         },
  //         t,
  //       );

  //       if (item.prescription_id) {
  //         await UpdateData(
  //           Prescriptions,
  //           {
  //             selling_price: item.total_lense_price,
  //             mrp: item.total_lense_mrp,
  //             coupon_discount: item.lense_coupon_discount,
  //             tax_amount: item.total_lense_tax,
  //             discount: item.total_lense_discount,
  //             lense_tax_percentage: item.lense_tax_percentage,
  //             lense_discount_percentage: item.lense_discount_percentage,
  //           },
  //           { id: item.prescription_id },
  //           t,
  //         );
  //       }

  //       const existingStock = await Product.findOne({
  //         where: { id: item.product_id },
  //         transaction: t,
  //       });

  //       if (stock) {
  //         await CreateNew(
  //           OrderStocks,
  //           {
  //             stock_id: stock?.id,
  //             order_details_id: orderDetail?.id,
  //           },
  //           t,
  //         );
  //       }

  //       const newGeneralStock =
  //         Number(existingStock?.available_stock) - Number(item?.quantity);

  //       await UpdateData(
  //         Product,
  //         {
  //           available_stock: newGeneralStock,
  //         },
  //         { id: item.product_id },
  //         t,
  //       );
  //     }

  //     if (order_summary?.coupon_applied) {
  //       await CreateNew(
  //         Coupon_History,
  //         {
  //           order_id: newOrder?.id,
  //           user_id: userId,
  //           coupon_id: order_summary.coupon?.id,
  //           discount_price: order_summary.total_coupon_discount,
  //         },
  //         t,
  //       );
  //     }

  //     await CreateNew(
  //       Order_Payment_Detail,
  //       {
  //         payment_method_id,
  //         order_id: newOrder?.id,
  //         payment_id: payment_id,
  //         amount: order.total_amount,
  //       },
  //       t,
  //     );

  //     {
  //       //reward amount add
  //       const rewardAmount =
  //         parseFloat(order_summary.total_amount) *
  //         (Number(appsetup?.reward_discount) / 100);
  //       const userwalletupdate = await CheckExits(
  //         Wallet,
  //         { user_id: userId },
  //         t,
  //       );

  //       await UpdateData(
  //         Wallet,
  //         {
  //           amount:
  //             parseFloat(userwalletupdate.amount || 0) +
  //             parseFloat(rewardAmount),
  //         },
  //         { user_id: userId },
  //         t,
  //       );

  //       const walletHistory = {
  //         wallet_id: user_wallet?.id,
  //         order_id: newOrder?.id,
  //         transaction_type_id: IDS?.Transaction_type?.Credit,
  //         transaction_type: "credit",
  //         amount: rewardAmount,
  //         purchase_amount: order_summary?.total_amount,
  //         description: "Order Reward Credit",
  //       };
  //       await CreateNew(Wallet_History, walletHistory, t);
  //     }

  //     {
  //       // refer reward
  //       const UsersRefer = await CheckExits(
  //         Users_Refer,
  //         { refer_to: userId },
  //         t,
  //       );
  //       const orderCount = await Product_Order.count({
  //         where: { user_id: userId },
  //         transaction: t,
  //       });

  //       if (
  //         UsersRefer &&
  //         orderCount === 1 &&
  //         Number(appsetup?.minimum_order) <= Number(order_summary?.total_amount)
  //       ) {
  //         const refWallet = await Wallet.findOne({
  //           where: { user_id: UsersRefer.refer_by },
  //           transaction: t,
  //         });

  //         const currentAmount = parseFloat(refWallet?.amount || 0);
  //         const rewardAmount = parseFloat(appsetup.refer_percentage);
  //         console.log(rewardAmount, "rewardAmount");

  //         await UpdateData(
  //           Wallet,
  //           {
  //             amount: Number(currentAmount + rewardAmount).toFixed(2),
  //           },
  //           { id: refWallet?.id },
  //           t,
  //         );

  //         const walletHistory = {
  //           wallet_id: refWallet?.id,
  //           order_id: newOrder?.id,
  //           type: IDS.Wallet_type?.Referral,
  //           transaction_type_id: IDS?.Transaction_type?.Credit,
  //           amount: rewardAmount,
  //           purchase_amount: order_summary?.total_amount,
  //           description: "Referal amount Credit",
  //         };
  //         await CreateNew(Wallet_History, walletHistory, t);
  //       }
  //     }

  //     {
  //       //reward discount
  //       if (Number(order_summary?.reward_discount) > 0) {
  //         await UpdateData(
  //           Wallet,
  //           {
  //             amount:
  //               parseFloat(user_wallet.amount) -
  //               parseFloat(order_summary.reward_discount),
  //           },
  //           { user_id: userId },
  //           t,
  //         );
  //       }
  //     }

  //     await CreateNew(
  //       Advance_Payment,
  //       {
  //         product_order_id: newOrder?.id,
  //         amount: advance_amount,
  //         payment_method_id,
  //       },
  //       t,
  //     );

  //     await CreateNew(
  //       Order_History,
  //       { order_id: newOrder?.id, processedAt: new Date() },
  //       t,
  //     );

  //     await t.commit();
  //     const pdf = await InvoiceGenerater(newOrder?.id);
  //     await mailOrder(
  //       appsetup?.email,
  //       newOrder?.invoice_no,
  //       customer?.name,
  //       order_summary?.total_amount,
  //     );

  //     const subject = "🛒 Order Confirmed – Thank you for your purchase!";

  //     const message = `
  //   <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
  //     <h2 style="color:#28a745;">Order Confirmed ✅</h2>

  //     <p>Hi <b>${customer.name}</b>,</p>

  //     <p>Thank you for placing your order with us. Your order has been successfully confirmed.</p>

  //     <table style="border-collapse: collapse; width: 100%; margin-top: 15px;">
  //       <tr>
  //         <td style="border: 1px solid #ddd; padding: 8px;"><b>Order ID</b></td>
  //         <td style="border: 1px solid #ddd; padding: 8px;">${newOrder.invoice_no}</td>
  //       </tr>
  //       <tr>
  //         <td style="border: 1px solid #ddd; padding: 8px;"><b>Total Amount</b></td>
  //         <td style="border: 1px solid #ddd; padding: 8px;">₹${newOrder.total_amount}</td>
  //       </tr>
  //     </table>

  //     <p style="margin-top: 20px;">
  //       📦 We will notify you once your order is Delivered.
  //     </p>

  //     <p>
  //       If you have any questions, feel free to contact our support team.
  //     </p>

  //     <br/>
  //     <p>Thanks & Regards,<br/>
  //     <b>Bapat Optics</b></p>
  //   </div>
  // `;

  //     commonMail(customer.email, subject, message);
  //     return Base.sendResponse(res, HTTPS.CREATED, newOrder);
  //   } catch (error) {
  //     await t.rollback();
  //     console.error("Error creating Order:", error);
  //     return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
  //   }
  // }

  async CreateOrder(req, res) {
    const t = await sequelize.transaction();
    try {
      const {
        payment_method_id,
        payment_id,
        advance_amount,
        gst_number,
        doctor_name,
      } = req.body;
      const order_summary = JSON.parse(req.body.order_summary);
      const order_Details_summary = JSON.parse(req.body.order_Details_summary);
      const appsetup = await App_Setup.findOne({
        transaction: t,
      });

      const userId = req.body.user_id;

      const customer = await Users.findOne({
        where: { id: userId },
        transaction: t,
      });

      const invoice_number = await findUniqueinvoicenumberorder();

      const order = {
        user_id: userId,
        order_status_id: IDS.order_status.Processing,
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
        total_addon_price: order_summary.total_addon_price,
        total_lense_price: order_summary.total_lense_price,
        total_discount: order_summary.total_discount,
        lens_tax: order_summary.total_lense_tax,
        lens_discount: order_summary.total_lense_discount,
        lens_mrp: order_summary.total_lense_mrp,
      };

      if (gst_number) {
        order.gst_number = gst_number;
      }
      if (doctor_name) {
        order.doctor_name = doctor_name;
      }
      const user_wallet = await CheckExits(Wallet, { user_id: userId }, t);

      const newOrder = await Product_Order.create(order, { transaction: t });

      for (const item of order_Details_summary) {
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
              name: "Stock add Dummy",
            },
            t,
          );
        }

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
            Number(existingLenseStock?.available_stock) -
            Number(item?.quantity);
          await UpdateData(
            Product,
            {
              available_stock: newLenseStock,
            },
            { id: item.lense_id },
            t,
          );
        }

        const orderDetail = await CreateNew(
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
            // batch_no: selectedBatch?.batch_no,
            // expiry_date: selectedBatch?.expiry_date,
            total_addon_price: item.total_addon_price,
            total_lense_price: item.total_lense_price,
            prescription_id: item.prescription_id,
            stock_id: stock?.id,
            total_discount: item.total_discount,
            lense_stock_id: item.lense_id ? lensstock?.id : null,
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

        const existingStock = await Product.findOne({
          where: { id: item.product_id },
          transaction: t,
        });

        if (stock) {
          await CreateNew(
            OrderStocks,
            {
              stock_id: stock?.id,
              order_details_id: orderDetail?.id,
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
      }

      if (order_summary?.coupon_applied) {
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

      {
        //reward amount add
        const rewardAmount =
          parseFloat(order_summary.total_amount) *
          (Number(appsetup?.reward_discount) / 100);
        const userwalletupdate = await CheckExits(
          Wallet,
          { user_id: userId },
          t,
        );

        await UpdateData(
          Wallet,
          {
            amount:
              parseFloat(userwalletupdate.amount || 0) +
              parseFloat(rewardAmount),
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

      {
        // refer reward
        const UsersRefer = await CheckExits(
          Users_Refer,
          { refer_to: userId },
          t,
        );
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

      {
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
      }

      await CreateNew(
        Advance_Payment,
        {
          product_order_id: newOrder?.id,
          amount: advance_amount,
          payment_method_id,
        },
        t,
      );

      await CreateNew(
        Order_History,
        { order_id: newOrder?.id, processedAt: new Date() },
        t,
      );

      await t.commit();
      const pdf = await InvoiceGenerater(newOrder?.id);
      await mailOrder(
        appsetup?.email,
        newOrder?.invoice_no,
        customer?.name,
        order_summary?.total_amount,
      );

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

      commonMail(customer.email, subject, message);
      return Base.sendResponse(res, HTTPS.CREATED, newOrder);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Order:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
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
          include: [{ model: p_category }],
        },

        {
          model: Product_Order,
          include: [
            { model: Order_Cancellation, include: [{ model: Cancel_Reason }] },
            { model: Users },
            { model: Order_status },
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
                    { model: Area, paranoid: false },
                  ],
                },
              ],
            },
            { model: Order_History },
            { model: Payment_Method, paranoid: true },
          ],
        },

        {
          model: Prescriptions,
          include: [
            {
              model: Prescription_Details,
            },

            {
              model: Prescriptions_Type,
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

  async findAllReturnOrder(req, res) {
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
      const where = { return_status: false };

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
          include: [{ model: p_category }],
        },
        {
          model: Prescriptions,
          include: [
            {
              model: Prescription_Details,
            },

            {
              model: Prescriptions_Type,
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

        {
          model: Product_Order,
          include: [
            { model: Order_Cancellation, include: [{ model: Cancel_Reason }] },
            { model: Users },
            { model: Order_status },
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
                    { model: Area, paranoid: false },
                  ],
                },
              ],
            },
            { model: Order_History },
            { model: Payment_Method, paranoid: true },
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
              include: [{ model: p_category }],
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
        order: [["createdAt", "DESC"]],
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
        "Total SubTotal",
        "Total Lense Price",
        "Shipping Charges",
        "Total Reward Discount",
        "Total Coupon Discount",
        "Total Tax",
        "Grand Total",
        "Order Status",
        "Payment Method",
        "Delivery Boy",
        "Return Status",
        "Order Created",
        "Order Processed",
        "Pickup Scheduled",
        "Shipped",
        "Delivered",
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

        const orderHistory = order.Order_History || {};

        const createdAt = formatDateTime(orderHistory.createdAt);
        const processedAt = formatDateTime(orderHistory.processedAt);
        const itemPickedAt = formatDateTime(orderHistory.itemPickedAt);
        const outForDelivery = formatDateTime(orderHistory.out_for_delivery);
        const deliveredAt = formatDateTime(orderHistory.deliveredAt);

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
          order.total_selling_price != null ? order.total_selling_price : "-",
          order.total_lense_price != null ? order.total_lense_price : "-",
          order.delivery_charges != null ? order.delivery_charges : "-",
          order.reward_discount != null ? order.reward_discount : "-",
          order.total_coupon_discount != null
            ? order.total_coupon_discount
            : "-",
          order.total_tax != null ? order.total_tax : "-",
          order.total_amount != null ? order.total_amount : "-",
          orderStatus.name || "-",
          paymentMethod.name || "-",
          deliveryBoy.name || "-",
          returnStatus.name || "-",
          createdAt || "-",
          processedAt || "-",
          itemPickedAt || "-",
          outForDelivery || "-",
          deliveredAt || "-",
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

  async ChangeOrderStatus(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { order_status_id, advance_amount, payment_method_id } = req.body;

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

      if (payment_method_id) {
        await CreateNew(
          Advance_Payment,
          {
            product_order_id: id,
            amount: advance_amount,
            payment_method_id,
          },
          t,
        );
      }

      // const data = {};
      // if (order_status_id === IDS.order_status.PickupScheduled) {
      //   data.delivery_boy_assigned = moment
      //     .utc()
      //     .add(5, "hours")
      //     .add(30, "minutes")
      //     .toDate();
      // } else if (order_status_id === IDS.order_status.Shipped) {
      //   data.out_for_delivery = moment
      //     .utc()
      //     .add(5, "hours")
      //     .add(30, "minutes")
      //     .toDate();
      // } else if (order_status_id === IDS.order_status.Delivered) {
      //   data.deliveredAt = moment
      //     .utc()
      //     .add(5, "hours")
      //     .add(30, "minutes")
      //     .toDate();
      // } else if (order_status_id === IDS.order_status.Returned) {
      //   data.returnedAt = moment
      //     .utc()
      //     .add(5, "hours")
      //     .add(30, "minutes")
      //     .toDate();
      // }

      const customer = await Users.findOne({
        where: { id: exists?.user_id },
        transaction: t,
      });
      if (Number(order_status_id) === Number(IDS.order_status.Processing)) {
        await UpdateData(
          Order_History,
          { processedAt: new Date() },
          { order_id: id },
          t,
        );
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
          Order_History,
          { cancelledAt: new Date() },
          { order_id: id },
          t,
        );
        await UpdateData(
          Product_Order,
          { cancel_reason: req.body.reason },
          { id: id },
          t,
        );
      }
      if (
        Number(order_status_id) === Number(IDS.order_status.PickupScheduled)
      ) {
        await UpdateData(
          Order_History,
          { itemPickedAt: new Date() },
          { order_id: id },
          t,
        );
      } else if (Number(order_status_id) === Number(IDS.order_status.Shipped)) {
        await UpdateData(
          Order_History,
          { out_for_delivery: new Date() },
          { order_id: id },
          t,
        );
      } else if (
        Number(order_status_id) === Number(IDS.order_status.Delivered)
      ) {
        await UpdateData(
          Order_History,
          { deliveredAt: new Date() },
          { order_id: id },
          t,
        );
        const subject =
          "📦 Your Order Has Been Delivered – Enjoy Your Purchase!";

        const message = `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <h2 style="color:#007bff;">Order Delivered ✅</h2>

    <p>Hi <b>${customer.name}</b>,</p>

    <p>We’re happy to inform you that your order has been successfully delivered.</p>

    <table style="border-collapse: collapse; width: 100%; margin-top: 15px;">
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;"><b>Order ID</b></td>
        <td style="border: 1px solid #ddd; padding: 8px;">${exists.invoice_no}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;"><b>Total Amount</b></td>
        <td style="border: 1px solid #ddd; padding: 8px;">₹${exists.total_amount}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;"><b>Delivery Date</b></td>
        <td style="border: 1px solid #ddd; padding: 8px;">
          ${new Date().toLocaleDateString()}
        </td>
      </tr>
    </table>

    <p style="margin-top: 20px;">
      🎉 We hope you enjoy your purchase! Thank you for shopping with us.
    </p>

    <p>
      If you face any issues or need help, feel free to contact our support team.
    </p>

    <br/>
    <p>Warm Regards,<br/>
    <b>Bapat Optics</b></p>
  </div>
`;

        const messagewhat = `
📦 𝗬𝗼𝘂𝗿 𝗢𝗿𝗱𝗲𝗿 𝗛𝗮𝘀 𝗕𝗲𝗲𝗻 𝗗𝗲𝗹𝗶𝘃𝗲𝗿𝗲𝗱 by Bapat Optics ✅

Hey ${customer.name} 👋

We’re happy to inform you that your order has been successfully delivered. 🎉

🧾 Order Details
🆔 Order ID: ${exists.invoice_no}
💰 Total Amount: ₹${exists.total_amount}
📅 Delivery Date: ${new Date().toLocaleDateString()}

✨ We hope you enjoy your purchase!
Thank you for shopping with us.

Need Help?
📞 Contact our support team anytime for assistance.

💛 Warm Regards,
Bapat Optics
👓 Quality Vision, Trusted Care
`;

        sendWatsappMessage(customer, messagewhat);
        commonMail(customer?.email, subject, message);
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

  async StockAssingOrder(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { stock_id } = req.body;

      const exists = await CheckExits(Product_Order_Detail, { id: id }, t);

      if (!exists) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Order Details Not Found",
        );
      }

      await UpdateData(Product_Order_Detail, { stock_id }, { id: id }, t);
      await UpdateData(
        Stocks,
        { stock_status_id: IDS.StockStatus.Selled },
        { id: stock_id },
        t,
      );

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

  async FindOnePrescription(req, res) {
    try {
      const id = req.params.id || "";
      const where = {};
      const queryOptions = {
        include: [{ model: Prescription_Details }],
      };

      if (id) {
        where.id = id;
        queryOptions.where = where;
      } else {
        queryOptions.order = [["createdAt", "DESC"]];
      }

      const prescription = await Prescriptions.findOne(queryOptions);

      if (!prescription) {
        return Base.sendError(res, HTTPS.NOT_FOUND, "Prescription not found.");
      }

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
}

module.exports = new ProductOrderController();
