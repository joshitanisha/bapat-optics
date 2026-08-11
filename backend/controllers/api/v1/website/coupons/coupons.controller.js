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
const cart_detail = require("../../../../../models/cart_detail");
const {
  Coupon,
  Discount_Type,
  Coupon_History,
  Product,
  Cart,
  Users,
  Frame_Type,
  Colour,
  LensType,
  Prescriptions,
  Addon,
  Coupon_Brand,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
class CartController {
  async findAll(req, res) {
    try {
      const amount = req.query.amount ? parseFloat(req.query.amount) : null;

      const whereClause = {
        status: true,
        customer_view: true,
      };

      if (amount !== null) {
        whereClause.required_amount = {
          [Op.lte]: amount,
        };
      }

      const options = {
        include: [
          {
            model: Discount_Type,
          },
        ],
        where: whereClause,
        order: [["createdAt", "DESC"]],
      };

      await Paginate(Coupon, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Coupons:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const include = [
        {
          model: Discount_Type,
        },
      ];
      const result = await CheckExits(
        Coupon,
        { id: req.params.id },
        t,
        include,
      );

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Coupon not found");
      }
      await t.commit();

      const data = {
        store_id: result.store_id,
        name: result?.name,
        code: result?.code,
        message: result?.message,
        info: result?.info,
        discount: result?.discount,
        required_amount: result?.required_amount,
        use_per_coupon: result?.use_per_coupon,
        use_per_customer: result?.use_per_customer,
        s_date: result?.s_date,
        e_date: result?.e_date,
        image: result?.image,
        discount_type_id: {
          value: result?.discount_type_id,
          name: "discount_type_id",
          label: result?.Discount_Type?.name,
        },
      };

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Coupon:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async validCouponCode(req, res) {
    const t = await sequelize.transaction();
    try {
      const { code, amount } = req.body;

      const couponCode = await Coupon.findOne({
        where: {
          code: code,
        },
      });
      if (!couponCode) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Invalid promo code.");
      }

      const couponActive = await Coupon.findOne({
        include: [{ model: Coupon_Brand }],
        where: {
          status: true,
          code: code,
        },
      });

      if (!couponActive) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Coupon Not Active.");
      }

      const cart = await Cart.findAll({
        include: [
          {
            model: Users,
          },
          {
            model: Prescriptions,
            required: false,
            include: [
              { model: Addon },
              { model: Product, as: "Lense" },
              { model: LensType },
            ],
          },
          {
            model: Product,
            include: [{ model: Frame_Type }, { model: Colour }],
            paranoid: true,
          },
        ],
        where: {
          user_id: req.user.user_id,
        },
      });

      const now = new Date();
      let categoryTotalAmount = 0;
      const getItemAmount = (item) => {
        const price = Number(item?.Product?.mrp || 0);
        const qty = Number(item?.quantity || 1);
        return price * qty;
      };

      if (
        Number(IDS.CouponCategoryType.Category) ===
        Number(couponCode.coupon_type_id)
      ) {
        if (couponCode.category_id) {
          const couponCategoryId = Number(couponCode.category_id);

          const matchedItems = cart.filter((item) => {
            const frameCategory = Number(item?.Product?.p_category_id);
            const lensCategory = Number(
              item?.Prescription?.Lense?.p_category_id,
            );

            return (
              frameCategory === couponCategoryId ||
              lensCategory === couponCategoryId
            );
          });

          if (matchedItems.length === 0) {
            await t.rollback();
            return Base.sendError(
              res,
              HTTPS.NOT_ACCEPTABLE,
              "This coupon is not valid for selected Category.",
            );
          }

          // ✅ Calculate total amount of matched category
          categoryTotalAmount = matchedItems.reduce((sum, item) => {
            return sum + getItemAmount(item);
          }, 0);

          if (parseFloat(couponCode.required_amount) > categoryTotalAmount) {
            await t.rollback();
            return Base.sendError(
              res,
              HTTPS.NOT_ACCEPTABLE,
              `Booking amount must be at least Rs. ${couponCode.required_amount}`,
            );
          }
          
        }

        let brandTotalAmount = 0;

        if (couponActive?.Coupon_Brands?.length > 0) {
          const couponBrandIds = couponActive.Coupon_Brands.map((b) =>
            Number(b.brand_id),
          );

          const matchedBrandItems = cart.filter((item) =>
            couponBrandIds.includes(Number(item?.Product?.brand_id)),
          );

          if (matchedBrandItems.length === 0) {
            await t.rollback();
            return Base.sendError(
              res,
              HTTPS.NOT_ACCEPTABLE,
              "This coupon is not valid for selected Brand.",
            );
          }

          brandTotalAmount = matchedBrandItems.reduce((sum, item) => {
            return sum + getItemAmount(item);
          }, 0);

          if (parseFloat(couponCode.required_amount) > brandTotalAmount) {
            await t.rollback();
            return Base.sendError(
              res,
              HTTPS.NOT_ACCEPTABLE,
              `Booking amount must be at least Rs. ${couponCode.required_amount}`,
            );
          }

          console.log("Brand Total Amount:", brandTotalAmount);
        }
      }

      if (
        Number(IDS.CouponCategoryType.DateWise) ===
        Number(couponCode.coupon_type_id)
      ) {
        if (couponCode.s_date && now < new Date(couponCode.s_date)) {
          await t.rollback();
          return Base.sendError(
            res,
            HTTPS.NOT_ACCEPTABLE,
            "This coupon is not active yet.",
          );
        }

        if (couponCode.e_date && now > new Date(couponCode.e_date)) {
          await t.rollback();
          return Base.sendError(
            res,
            HTTPS.NOT_ACCEPTABLE,
            "This coupon has expired.",
          );
        }

        if (couponCode.e_date && now > new Date(couponCode.e_date)) {
          await t.rollback();
          return Base.sendError(
            res,
            HTTPS.NOT_ACCEPTABLE,
            "This coupon has expired.",
          );
        }
      }

      if (parseFloat(couponCode.required_amount) > amount) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          `Booking amount must be at least Rs. ${couponCode.required_amount}`,
        );
      }

      // Count occurrences of user_id
      let totalCount = 0;

      const couponHistory = await Coupon_History.findAll({
        where: {
          coupon_id: couponCode.id,
        },
      });

      // Count occurrences of user_id
      couponHistory.forEach((history) => {
        totalCount++;
      });

      if (couponCode.use_per_coupon <= totalCount) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "This coupon has been fully used",
        );
      }

      let totalCountCoupen = 0;

      // Count occurrences of user_id
      couponHistory.forEach((history) => {
        if (history?.user_id == req.user?.user_id) {
          totalCountCoupen++;
        }
      });

      // Check if the use_per_customer condition is met
      if (Number(couponCode.use_per_customer) <= Number(totalCountCoupen)) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "You have reached the maximum limit for this coupon",
        );
      }
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, couponCode);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new CartController();
