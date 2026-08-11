const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
} = require("../../../../../helper/common/utils/dbUtils");
const Base = require("../../../../../helper/exception_handling");
const { HTTPS } = require("../../../../../helper/https-status-codes/https-status-codes");
const {
  State,
  Country,
  City,
  Pincode,
  Area,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");

class AreaController {
  // Fetch all countries
  async findAll(req, res) {
   
    try {
      const name = req.query.term?.trim() || "";
      const searchCountry = req.query.searchCountry || "";
      const searchState = req.query.searchState || "";
      const searchCity = req.query.searchCity || "";
      const searchPincode = req.query.searchPincode || "";

      const options = {
        include: [
          {
            model: Country,
            where: searchCountry
              ? { id: searchCountry, status: true }
              : { status: true },
          },
          {
            model: State,
            where: searchState
              ? { id: searchState, status: true }
              : { status: true },
          },
          {
            model: City,
            where: searchCity
              ? { id: searchCity, status: true }
              : { status: true },
          },
          {
            model: Pincode,
            where: searchPincode
              ? { id: searchPincode, status: true }
              : { status: true },
          },
        ],
        where: { [Op.or]: [{ name: { [Op.like]: `%${name}%` } }] },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Area, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Area:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single State by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const include = [
        {
          model: Country,
        },
        {
          model: State,
        },
        {
          model: City,
        },
        {
          model: Pincode,
        },
      ];
      const state = await CheckExits(Area, { id: req.params.id }, t, include);

      const data = {
        name: state?.name,
        country_id: {
          name: "country_id",
          label: state?.Country?.name,
          value: state?.Country?.id,
        },
        state_id: {
          name: "state_id",
          label: state?.State?.name,
          value: state?.State?.id,
        },
        city_id: {
          name: "city_id",
          label: state?.City?.name,
          value: state?.City?.id,
        },
        pincode_id: {
          name: "pincode_id",
          label: state?.Pincode?.name,
          value: state?.Pincode?.id,
        },
      };
      //  console.log(data,"pincode_idpincode_id");
      if (!state) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Area not found");
      }
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Area:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new State
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const { name, country_id, state_id, city_id, pincode_id } = req.body;

      const existingState = await CheckExits(
        Area,
        { name, country_id, state_id, city_id, pincode_id },
        t
      );

      if (existingState) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Area already exists");
      }

      const newState = await CreateNew(
        Area,
        { name, country_id, state_id, city_id, pincode_id },
        t
      );

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newState);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Area:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a State by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        name: req.body.name.trim(),
        country_id: req.body.country_id,
        city_id: req.body.city_id,
        state_id: req.body.state_id,
        pincode_id: req.body.pincode_id,
      };

      const exits = await CheckExits(
        Area,
        {
          name: data.name,
          country_id: data?.country_id,
          city_id: req.body.city_id,
          state_id: req.body.state_id,
          pincode_id: req.body.pincode_id,
        },
        t
      );

      if (exits?.id != id && exits !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Area name already in use"
        );
      }

      const update = await UpdateData(
        Area,
        data,
        {
          id: id,
        },
        t
      );

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Area updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Area:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a State by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const area = await CheckExits(Area, { id }, t);

      if (!area) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Area not found");
      }

      await Area.destroy({ where: { id }, transaction: t });
      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, "Area deleted successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error deleting Area:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a State
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const area = await CheckExits(Area, { id }, t);

      if (!area) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Area not found");
      }

      await UpdateData(Area, { status: area.status ? false : true }, { id }, t);

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Area status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Area status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new AreaController();
