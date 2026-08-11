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
const { Country, State, City, Pincode, sequelize } = require("../../../../../models/index");
const { Op } = require("sequelize");
class CountryController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";

      const options = {
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
        },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Country, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching countries:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const country = await CheckExits(Country, { id: req.params.id }, t);

      if (!country) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Country not found");
      }
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, country);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching country:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new country
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        name: req.body?.name,
        currency: req.body?.currency,
        country_code: req.body?.country_code,
      };

      if (req?.files && req.files?.image) {
        data.image = await File_Uploade(req.files?.image, "/uploads/masters/country")
      }

      const existingCountry = await CheckExits(Country, { name: data.name }, t);

      if (existingCountry) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Country already exists");
      }

      const newCountry = await CreateNew(Country, data, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newCountry);
    } catch (error) {
      await t.rollback();
      console.error("Error creating country:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a country by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        name: req.body?.name,
        currency: req.body?.currency,
        country_code: req.body?.country_code,
      };

      if (req?.files && req.files?.image) {
        data.image = await File_Uploade(req.files?.image, "/uploads/masters/country")
      }



      const exits = await CheckExits(Country, { name: data.name, }, t);

      if (exits?.id != id && exits !== null) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Country name already in use");
      }

      const update = await UpdateData(Country, data, { id: id, }, t);

      await t.commit();
      return Base.sendResponse(res, HTTPS.ACCEPTED, "Country updated successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error updating country:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a country by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      // Check if the country exists
      const country = await CheckExits(Country, { id }, t);

      if (!country) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Country not found");
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

        for (const city of cities) {
          // Find and delete all pincodes belonging to the city
          await Pincode.destroy({
            where: {
              city_id: city.id,
            },
            transaction: t,
          });

          // Delete the city
          await City.destroy({
            where: {
              id: city.id,
            },
            transaction: t,
          });
        }

        // Delete the state
        await State.destroy({
          where: {
            id: state.id,
          },
          transaction: t,
        });
      }

      // Delete the country
      await Country.destroy({
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


  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const country = await CheckExits(Country, { id }, t);

      if (!country) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Country not found");
      }

      await UpdateData(
        Country,
        { status: country.status ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Country status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating country status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new CountryController();
