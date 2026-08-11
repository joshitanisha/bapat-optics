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
const { Gender, sequelize } = require("../../../../../models/index");
const { Op } = require("sequelize");
class GenderController {


    // Fetch all Gender
    async findAll(req, res) {
        try {
            const name = req.query.term?.trim() || "";
            const options = {
                where: {
                    [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
                },
                order: [["createdAt", "ASC"]],
            };
            await Paginate(Gender, options, req, res, Op);
        } catch (error) {
            console.error("Error fetching Gender:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }

    // Fetch a single Gender by ID
    async findOne(req, res) {
        const t = await sequelize.transaction();
        try {
            const result = await CheckExits(Gender, { id: req.params.id }, t);

            if (!result) {
                await t.rollback();
                return Base.sendError(res, HTTPS.NOT_FOUND, "Gender not found");
            }
            await t.commit();
            return Base.sendResponse(res, HTTPS.OK, result);
        } catch (error) {
            await t.rollback();
            console.error("Error fetching Gender:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }

    // Create a new Gender
    async create(req, res) {
        const t = await sequelize.transaction();
        try {
            const data = {
                name: req.body?.name?.trim(),
                image: await File_Uploade(req.files?.image, "/uploads/masters/gender")
            }
            const exists = await CheckExits(Gender, { name: data?.name }, t);
         
         
            if (exists) {
                await t.rollback();
                return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Gender already exists");
            }

            const newItem = await CreateNew(Gender, data, t);

            await t.commit();

            return Base.sendResponse(res, HTTPS.CREATED, newItem);
        } catch (error) {
            await t.rollback();
            console.error("Error creating Gender:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }

    // Update a Gender by ID
    async update(req, res) {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;

            const data = {
                name: req.body?.name?.trim(),
            }

            if (req.files && req.files.image) {
                data.image = await File_Uploade(req.files?.image, "/uploads/masters/gender")
            }

            const exists = await CheckExits(Gender, { name: data?.name }, t);

            if (exists?.id != id && exists !== null) {
                await t.rollback();
                return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Gender name already in use");
            }

            const update = await UpdateData(Gender, data, { id: id }, t);

            await t.commit();
            return Base.sendResponse(res, HTTPS.ACCEPTED, "Gender updated successfully");
        } catch (error) {
            await t.rollback();
            console.error("Error updating Gender:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }

    // Delete Gender by id
    async delete(req, res) {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;
            // Check if the country exists
            const result = await CheckExits(Gender, { id }, t);

            if (!result) {
                await t.rollback();
                return Base.sendError(res, HTTPS.NOT_FOUND, "Gender not found");
            }

            await Gender.destroy({ where: { id }, transaction: t, });

            await t.commit();
            return Base.sendResponse(res, HTTPS.OK, "Gender Deleted Successfully");
        } catch (error) {
            await t.rollback();
            console.error("Error Deleting Gender:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }


    // Update the status of a country
    async status(req, res) {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;

            const result = await CheckExits(Gender, { id }, t);

            if (!result) {
                await t.rollback();
                return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
            }

            await UpdateData(Gender, { status: result.status ? false : true }, { id }, t);

            await t.commit();

            return Base.sendResponse(res, HTTPS.OK, "Gender status updated successfully");
        } catch (error) {
            await t.rollback();
            console.error("Error updating Gender status:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }
}

module.exports = new GenderController();
