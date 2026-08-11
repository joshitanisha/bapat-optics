const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
} = require("../../../../../helper/common/utils/dbUtils");
const Base = require("../../../../../helper/exception_handling");
const { HTTPS } = require("../../../../../helper/https-status-codes/https-status-codes");
const { State, Country, sequelize } = require("../../../../../models/index");
const { Op, where } = require("sequelize");

class StateController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const searchCountry = req.query.searchCountry || "";

      const whereCondition = {
        [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
      }

      const options = {
        include: [
          {
            model: Country,
            where: searchCountry ? { id: searchCountry, status: true } : { status: true }
          },
        ],
        where: whereCondition,
        order: [["createdAt", "DESC"]],
      };
      await Paginate(State, options, req, res, Op);
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
          model: Country
        }
      ]
      const state = await CheckExits(State, { id: req.params.id }, t, include);

      const data = {
        name: state?.name,
        country_id: {
          name: 'country_id',
          label: state?.Country?.name,
          value: state?.Country?.id,
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
      const { name, country_id } = req.body;

      const existingState = await CheckExits(State, { name, country_id }, t);

      if (existingState) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "State already exists"
        );
      }

      const newState = await CreateNew(State, { name, country_id }, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newState);
    } catch (error) {
      await t.rollback();
      console.error("Error creating State:", error);
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
      };

      const exits = await CheckExits(
        State,
        {
          name: data.name,
          country_id: data?.country_id
        },
        t
      );

      if (exits?.id != id && exits !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "State name already in use"
        );
      }

      const update = await UpdateData(
        State,
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
        "State updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating State:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a State by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      // Check if the country exists
      const country = await CheckExits(State, { id }, t);

      if (!country) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "state not found");
      }

      // Find all states belonging to the country
      const states = await State.findAll({
        where: {
          country_id: id,
        },
        transaction: t,
      });

      for (const state of states) {
        // Find all cities belonging to the state
        const cities = await City.findAll({
          where: {
            state_id: state.id,
          },
          transaction: t,
        });


        // Delete the state
        await City.destroy({
          where: {
            id: state.id,
          },
          transaction: t,
        });
      }

      // Delete the country
      await State.destroy({
        where: {
          id,
        },
        transaction: t,
      });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "Country deleted successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error deleting country:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a State
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const state = await CheckExits(State, { id }, t);

      if (!state) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "State not found");
      }

      await UpdateData(
        State,
        { status: state.status ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "State status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating State status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new StateController();
