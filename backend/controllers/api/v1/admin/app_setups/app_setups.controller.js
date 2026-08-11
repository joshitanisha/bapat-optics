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
const { App_Setup, State, sequelize } = require("../../../../../models/index");
const { Op } = require("sequelize");
class App_SetupController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const options = {
        where: {
          // [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
        },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(App_Setup, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching App_Setups:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      // const result = await CheckExits(App_Setup, { id: req.params.id }, t);

      const result = await App_Setup.findOne({
        where: { id: req.params.id },
        include: [{ model: State }],
      });

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "App_Setup not found");
      }

      const data = {
        id: result?.id,
        address: result?.address,
        email: result?.email,
        alt_contact_no: result?.alt_contact_no,
        contact_no: result?.contact_no,
        logo: result?.logo,
        website_name: result?.website_name,
        delivery_price_three_kilometer: result?.delivery_price_three_kilometer,
        long: result?.long,
        lat: result?.lat,
        delivery_price: result?.delivery_price,
        free_delivery_order_price: result?.free_delivery_order_price,
        low_stock_day: result?.low_stock_day??"",
        minimum_order: result?.minimum_order,
        reward_discount: result?.reward_discount??"",

        refer_percentage: result?.refer_percentage,
        // experience_to: result?.experience_to,
        // deadline: result?.deadline,
        ...(result?.State?.name && {
          state_id: {
            name: "state_id",
            label: result.State.name,
            value: result.State.id,
          },
        }),
      };

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching App_Setup:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a country by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        website_name: req.body?.website_name?.trim(),
        contact_no: req.body?.contact_no?.trim(),
        alt_contact_no: req.body?.alt_contact_no?.trim(),
        email: req.body?.email?.trim(),
        address: req.body?.address?.trim(),
        minimum_order: req.body?.minimum_order?.trim(),
        delivery_price: req.body?.delivery_price?.trim(),
        // packing_price: req.body?.packing_price?.trim(),
        // free_delivery_order_price: req.body?.free_delivery_order_price?.trim(),
        // delivery_range: req.body?.delivery_range?.trim(),
        reward_discount: req.body?.reward_discount?.trim(),
        refer_percentage: req.body?.refer_percentage?.trim(),
        // refer_to_order: req.body?.refer_to_order?.trim(),
        // refer_by_order: req.body?.refer_by_order?.trim(),
        // delivery_price_three_kilometer:
        //   req.body?.delivery_price_three_kilometer,
        // customer_limit: req.body?.customer_limit?.trim(),
        low_stock_day: req.body?.low_stock_day?.trim(),
        // refer_to_percentage: req.body?.refer_to_percentage?.trim(),
        // order_time: req.body?.order_time,
        state_id: req.body?.state_id,
        lat: req.body?.lat,
        long: req.body?.long,
      };

      if (req.files && req.files.logo) {
        data.logo = await File_Uploade(req.files?.logo, "/uploads/App_Setup");
      }

      await UpdateData(App_Setup, data, { id: id }, t);

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "App_Setup updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating App_Setup:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new App_SetupController();
