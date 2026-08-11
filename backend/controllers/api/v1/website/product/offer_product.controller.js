const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
} = require("../../../../../helper/common/utils/dbUtils");
const Base = require("../../../../../helper/exception_handling");
//const { RoleId, CouponType } = require("../../../../../helper/fix_ids");
const {
  HTTPS,
} = require("../../../../../helper/https-status-codes/https-status-codes");
const {
  Offered_Product,
  Product,
  Store_Detail,
  Discount_Type,
  Unit,
  Product_Variant,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
class OfferedController {
  // Fetch all countries
 async findAll(req, res) {
    try {
      const name = req?.query?.name || "";
      const price_order = req?.query?.price_order || "ASC";
    
      const data = await Offered_Product.findAll({
        include: [
          {
            model: Discount_Type,
          },
          {
            model: Product,
            include: [
              {
                model: Product_Variant,
              },
              // {
              //   model: Product_Variant_Stock,
              // },
              {
                model: Unit,
              },
            ],
            where: {
              [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
              status: true,
            },
          },
        ],
        where: {
          status: true,
        },

        distinct: true,
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error(error);
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
          model: Product,
        },
      ];
      const result = await CheckExits(
        Offered_Product,
        { id: req.params.id },
        t,
        include
      );

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Product not found");
      }

      const data = {
        // store_id: result.store_id,
        message: result?.message,
        discount: result?.discount,
        image: result?.image,
        discount_type_id: {
          value: result?.discount_type_id,
          name: "discount_type_id",
          label: result?.Discount_Type?.name,
        },
        product_id: {
          value: result?.product_id,
          name: "product_id",
          label: result?.Product?.name,
        },
      };

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Offered Product:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new OfferedController();
