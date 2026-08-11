
const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
} = require("../../../../../helper/common/utils/dbUtils");
const Base = require("../../../../../helper/exception_handling");
const { HTTPS } = require("../../../../../helper/https-status-codes/https-status-codes");
const { State, Country, City, sequelize } = require("../../../../../models/index");
const { Op } = require("sequelize");

class CityController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const searchCountry = req.query.searchCountry || "";
      const searchState = req.query.searchState || "";

      const whereCondition = {
        [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
      }
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
        ],
        where: whereCondition,
        order: [["createdAt", "DESC"]],
      };
      await Paginate(City, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching countries:", error);
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
          model: State
        }
      ]
      const state = await CheckExits(City, { id: req.params.id }, t, include);

      const data = {
        name: state?.name,
        image: state?.image,
        country_id: {
          name: 'country_id',
          label: state?.Country?.name,
          value: state?.Country?.id,
        },
        state_id: {
          name: 'state_id',
          label: state?.State?.name,
          value: state?.State?.id,
        }
      }
      if (!state) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "State not found");
      }
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching State:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new State
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        name: req?.body?.name,
        country_id: req?.body?.country_id,
        state_id: req?.body?.state_id,
      };

      if (req?.files && req.files?.image) {
        data.image = await File_Uploade(req.files?.image, "/uploads/masters/city")
      }

      const existingState = await CheckExits(City,
        {
          name: data.name,
          country_id: data?.country_id,
          state_id: data?.state_id,

        }, t);

      if (existingState) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "City already exists"
        );
      }

      const newState = await CreateNew(City, data, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newState);
    } catch (error) {
      await t.rollback();
      console.error("Error creating City:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a State by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        name: req?.body?.name,
        country_id: req?.body?.country_id,
        state_id: req?.body?.state_id,
      };

      if (req?.files && req.files?.image) {
        data.image = await File_Uploade(req.files?.image, "/uploads/masters/city")
      }

      const exits = await CheckExits(
        City,
        {
          name: data.name,
          country_id: data?.country_id,
          state_id: data?.state_id,

        },
        t
      );

      if (exits?.id != id && exits !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "City name already in use"
        );
      }

      const update = await UpdateData(City, data, { id: id }, t);

      await t.commit();
      return Base.sendResponse(res, HTTPS.ACCEPTED, "City updated successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error updating City:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a State by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const city = await CheckExits(City, { id }, t);

      if (!city) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "City not found");
      }
      await State.destroy({ where: { country_id: id }, transaction: t });

      await City.destroy({ where: { id }, transaction: t });
      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, "City deleted successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error deleting State:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a State
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const city = await CheckExits(City, { id }, t);

      if (!city) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "City not found");
      }

      await UpdateData(
        City,
        { status: city.status ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "City status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating State status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new CityController();
