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
const { Country_Code, Country, sequelize } = require("../../../../../models/index");
const { Op } = require("sequelize");
class CountryCodeController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const country_id = req.query.country_id || "";
      const options = {
        where: {
          [Op.or]: [{ country_code: { [Op.like]: `%${name}%` } }],
          ...country_id ? { country_id } : {}
        },
        include: [
          {
            model: Country,
          }
        ],
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Country_Code, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Country Code:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const include = [
        {
          model: Country,
        }
      ]
      const result = await CheckExits(Country_Code, { id: req.params.id }, t, include);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Country Code not found");
      }

      const data = {
        id: result?.id,
        name: result?.name,
        country_code: result?.country_code,
        no_length: result?.no_length,
        flag: result?.flag,
        status: result?.status,
        country_id: {
          value: result?.country_id,
          name: "country_id",
          label: result?.Country?.name
        }
      }
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Country Code:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new country
  async create(req, res) {
    const t = await sequelize.transaction();
    try {

      const data = {
        // name: req.body?.name?.trim(),
        country_code: req.body?.country_code?.trim(),
        country_id: req.body?.country_id,
        no_length: req.body?.no_length,
      }

      if (req?.files && req.files?.flag) {
        data.flag = await File_Uploade(req.files?.flag, "/uploads/masters/country_code")
      }

      const exists = await CheckExits(Country_Code, { country_code: data?.country_code }, t);

      if (exists) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Country Code already exists");
      }

      const newItem = await CreateNew(Country_Code, data, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newItem);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Country Code:", error);
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
        country_code: req.body?.country_code?.trim(),
        country_id: req.body?.country_id,
        no_length: req.body?.no_length,
      }

      if (req?.files && req.files?.flag) {
        data.flag = await File_Uploade(req.files?.flag, "/uploads/masters/country_code")
      }

      const exists = await CheckExits(Country_Code, { country_code: data?.country_code }, t);

      if (exists?.id != id && exists !== null) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Country Code name already in use");
      }

      const update = await UpdateData(Country_Code, data, { id: id }, t);

      await t.commit();
      return Base.sendResponse(res, HTTPS.ACCEPTED, "Country Code updated successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error updating Country Code:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a country by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Country_Code, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Country Code not found");
      }

      await Country_Code.destroy({ where: { id }, transaction: t, });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "Country Code Deleted Successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Country Code:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }


  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Country_Code, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(Country_Code, { status: result.status ? false : true }, { id }, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, "Country Code status updated successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error updating Country Code status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new CountryCodeController();
