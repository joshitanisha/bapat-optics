const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
} = require("../../../../../helper/common/utils/dbUtils");
const Base = require("../../../../../helper/exception_handling");
const {
  HTTPS,
} = require("../../../../../helper/https-status-codes/https-status-codes");
const cart_detail = require("../../../../../models/cart_detail");
const {
  Coupon,
  Discount_Type,
  Coupon_History,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
class CartController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const amount = req.query.amount ? parseFloat(req.query.amount) : null;

      const whereClause = {
        status: true,
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
        include
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

      // Fetch coupon code based on provided code
      const couponCode = await Coupon.findOne({
        where: {
          code: code,
        },
      });
      if (!couponCode) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Invalid promo code.");
      }
      // Check start_date and expiry_date
      const now = new Date();

      if (couponCode.s_date && now < new Date(couponCode.s_date)) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_FOUND,
          "This coupon is not active yet."
        );
      }

      if (couponCode.e_date && now > new Date(couponCode.e_date)) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "This coupon has expired.");
      }

      if (parseFloat(couponCode.required_amount) > amount) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_FOUND,
          `Booking amount must be at least Rs. ${couponCode.required_amount}`
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
          HTTPS.NOT_FOUND,
          "This coupon has been fully used"
        );
      }

      let totalCountCoupen = 0;

      // Count occurrences of user_id
      couponHistory.forEach((history) => {
        if (history?.user_id == req.user?.user) {
          totalCountCoupen++;
        }
      });

      // Check if the use_per_customer condition is met
      if (couponCode.use_per_customer <= totalCountCoupen) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_FOUND,
          "You have reached the maximum limit for this coupon"
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
