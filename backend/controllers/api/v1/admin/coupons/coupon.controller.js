const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
} = require("../../../../../helper/common/utils/dbUtils");
const Base = require("../../../../../helper/exception_handling");
const { RoleId, CouponType } = require("../../../../../helper/fix_ids");
const {
  HTTPS,
} = require("../../../../../helper/https-status-codes/https-status-codes");
const {
  Coupon,
  Discount_Type,
  Coupon_Type,
  Brand,
  Coupon_Brand,
  p_category,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
class CouponController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const discount_type_id = req.query.discount_type_id || "";
      const options = {
        include: [
          {
            model: Discount_Type,
          },
        ],
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
        },
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

        {
          model: Coupon_Type,
        },
        {
          model: Brand,
        },
        {
          model: p_category,
        },
        {
          model: Coupon_Brand,
          include: [{ model: Brand }],
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
        coupon_type_id: {
          value: result?.coupon_type_id,
          name: "coupon_type_id",
          label: result?.Coupon_Type?.name,
        },

        brand_id:
          result.Coupon_Brands?.map((val) => ({
            value: val.brand_id,
            name: "brand_id",
            label: val.Brand?.name,
          })) ?? [],

        // brand_id: {
        //   value: result?.brand_id,
        //   name: "brand_id",
        //   label: result?.Brand?.name,
        // },
        category_id: {
          value: result?.category_id,
          name: "category_id",
          label: result?.p_category?.name,
        },
        brand_status: result?.Coupon_Brands?.length > 0 ? true : false,
      };

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Coupon:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new country
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        store_id: req.user.store_id,
        name: req.body?.name?.trim(),
        code: req.body?.code?.trim(),
        message: req.body?.message?.trim(),
        info: req.body?.info?.trim(),
        discount_type_id: req.body?.discount_type_id,
        discount: req.body?.discount,
        required_amount: req.body?.required_amount,
        use_per_coupon: req.body?.use_per_coupon,
        use_per_customer: req.body?.use_per_customer,
        s_date: req.body?.s_date,
        e_date: req.body?.e_date,
        image: await File_Uploade(req.files?.image, "/uploads/masters/coupon"),
      };
      if (req.body?.coupon_type_id) {
        data.coupon_type_id = req.body?.coupon_type_id;
      }
      // if (req.body?.brand_id) {
      //   data.brand_id = req.body?.brand_id;
      // }
      if (req.body?.category_id) {
        data.category_id = req.body?.category_id;
      }
      const exists = await CheckExits(Coupon, { code: data?.code }, t);

      if (exists) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Coupon already exists",
        );
      }

      const newItem = await CreateNew(Coupon, data, t);

      if (req.body.brand_id) {
        const brands = JSON.parse(req.body.brand_id);

        for (const add of brands) {
          const data = {
            brand_id: add,
            coupon_id: newItem?.id,
          };
          if (add.id) {
            await UpdateData(Coupon_Brand, data, { id: add.id }, t);
          } else {
            await CreateNew(Coupon_Brand, data, t);
          }
        }
      }

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newItem);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Coupon:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a country by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        name: req.body?.name?.trim(),
        code: req.body?.code?.trim(),
        message: req.body?.message?.trim(),
        info: req.body?.info?.trim(),
        discount_type_id: req.body?.discount_type_id,
        discount: req.body?.discount,
        required_amount: req.body?.required_amount,
        use_per_coupon: req.body?.use_per_coupon,
        use_per_customer: req.body?.use_per_customer,
        s_date: req.body?.s_date,
        e_date: req.body?.e_date,
      };

      if (req.body?.coupon_type_id) {
        data.coupon_type_id = req.body?.coupon_type_id;
      }
      // if (req.body?.brand_id) {
      //   data.brand_id = req.body?.brand_id;
      //   data.category_id = null;
      // } else {
      //   data.brand_id = null;
      // }
      if (req.body?.category_id) {
        data.category_id = req.body?.category_id;
        // data.brand_id = null;
      } else {
        data.category_id = null;
      }

      if (req.files && req.files.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/coupon",
        );
      }

      const exists = await CheckExits(Coupon, { code: data?.code }, t);

      if (exists?.id != id && exists !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Coupon already in use",
        );
      }

      const barnd = await CheckExits(Coupon_Brand, { coupon_id: id }, t);
      if (barnd) {
        await Coupon_Brand.destroy({
          where: { coupon_id: id },
          transaction: t,
        });
      }

      const update = await UpdateData(Coupon, data, { id: id }, t);

      if (req.body.brand_id) {
        const brands = JSON.parse(req.body.brand_id);

        // await Coupon_Brand.destroy({
        //   where: { coupon_id: id },
        //   transaction: t,
        // });

        for (const add of brands) {
          await CreateNew(
            Coupon_Brand,
            {
              coupon_id: id,
              brand_id: add,
            },
            t,
          );
        }
      }

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Coupon updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Coupon:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a country by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Coupon, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Coupon not found");
      }

      await Coupon.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "Coupon Deleted Successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Coupon:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Coupon, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Coupon,
        { status: result.status ? false : true },
        { id },
        t,
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Coupon status updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Coupon status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async CustomerViewStatus(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Coupon, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Coupon,
        { customer_view: result.customer_view ? false : true },
        { id },
        t,
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Coupon customer view status updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Coupon status:", error);
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

      if (couponCode.category_id) {
        // Collect category IDs from cart products
        const cartFrameCategories = cart.map(
          (item) => item?.Product?.p_category_id,
        );

        // Collect category IDs from lens inside Prescription
        const cartLensCategories = cart.map(
          (item) => item?.Prescription?.Lense?.p_category_id,
        );

        // Merge both category lists
        const allCategories = [...cartFrameCategories, ...cartLensCategories];

        // Check if ANY matches the coupon category
        const categoryMatch = allCategories.includes(
          Number(couponCode.category_id),
        );

        if (!categoryMatch) {
          await t.rollback();
          return Base.sendError(
            res,
            HTTPS.NOT_ACCEPTABLE,
            "This coupon is not valid for selected Category.",
          );
        }
      }

      const couponBrandIds = couponActive?.Coupon_Brands?.map((b) =>
        Number(b.brand_id),
      );

      const cartBrandIds = cart
        .map((item) => item?.Product?.brand_id)
        .filter(Boolean)
        .map(Number);

      // If coupon has brand restriction
      if (couponBrandIds && couponBrandIds.length > 0) {
        const brandMatch = cartBrandIds.some((id) =>
          couponBrandIds.includes(id),
        );

        if (!brandMatch) {
          await t.rollback();
          return Base.sendError(
            res,
            HTTPS.NOT_ACCEPTABLE,
            "This coupon is not valid for selected Brand.",
          );
        }
      }

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

      if (parseFloat(couponCode.required_amount) > amount) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          `Booking amount must be at least Rs. ${couponCode.required_amount}`,
        );
      }

      // if (parseFloat(couponCode.brand_id) > amount) {
      //   await t.rollback();
      //   return Base.sendError(
      //     res,
      //     HTTPS.NOT_ACCEPTABLE,
      //     `Booking amount must be at least Rs. ${couponCode.required_amount}`
      //   );
      // }

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

module.exports = new CouponController();
