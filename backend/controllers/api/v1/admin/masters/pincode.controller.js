const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
} = require("../../../../../helper/common/utils/dbUtils");
const Base = require("../../../../../helper/exception_handling");
const { HTTPS } = require("../../../../../helper/https-status-codes/https-status-codes");
const { State, Country, City, Pincode, sequelize } = require("../../../../../models/index");
const { Op } = require("sequelize");

class PincodeController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const searchCountry = req.query.searchCountry || "";
      const searchState = req.query.searchState || "";
      const searchCity = req.query.searchCity || "";

      const options = {
        include: [
          {
            model: Country,
            where: searchCountry ? { id: searchCountry, status: true } : { status: true }
          },
          {
            model: State,
            where: searchState ? { id: searchState, status: true } : { status: true }
          },
          {
            model: City,
            where: searchCity ? { id: searchCity, status: true } : { status: true }
          },
        ],
        where: { [Op.or]: [{ name: { [Op.like]: `%${name}%` } }], },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Pincode, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Pincode:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single State by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {

      const include = [
        {
          model: Country
        },
        {
          model: State
        },
        {
          model: City
        }
      ]
      const state = await CheckExits(Pincode, { id: req.params.id }, t, include);

      const data = {
        name: state?.name,
        country_id: {
          name: 'country_id',
          label: state?.Country?.name,
          value: state?.Country?.id,
        },
        state_id: {
          name: 'state_id',
          label: state?.State?.name,
          value: state?.State?.id,
        },
        city_id: {
          name: 'city_id',
          label: state?.City?.name,
          value: state?.City?.id,
        }
      }
      if (!state) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Pincode not found");
      }
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Pincode:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new State
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const { name, country_id, state_id, city_id } = req.body;

      const existingState = await CheckExits(Pincode, { name, state_id, country_id, city_id }, t);

      if (existingState) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Pincode already exists"
        );
      }

      const newState = await CreateNew(Pincode, { name, state_id, country_id, city_id }, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newState);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Pincode:", error);
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
      };

      const exits = await CheckExits(
        Pincode,
        {
          name: data.name,
          country_id: data?.country_id,
          city_id: req.body.city_id,
          state_id: req.body.state_id,
        },
        t
      );

      if (exits?.id != id && exits !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Pincode name already in use"
        );
      }

      const update = await UpdateData(
        Pincode,
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
        "Pincode updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Pincode:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a State by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const pincode = await CheckExits(Pincode, { id }, t);

      if (!pincode) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Pincode not found");
      }

      await Pincode.destroy({ where: { id }, transaction: t });
      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, "Pincode deleted successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error deleting Pincode:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a State
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const pincode = await CheckExits(Pincode, { id }, t);

      if (!pincode) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Pincode not found");
      }

      await UpdateData(
        Pincode,
        { status: pincode.status ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Pincode status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Pincode status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new PincodeController();
