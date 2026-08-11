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
const { Vission_Mission, sequelize } = require("../../../../../models/index");
const { Op } = require("sequelize");
class Vission_MissionController {


    // Fetch all blog
    async findAll(req, res) {
        try {
            const name = req.query.term?.trim() || "";
            const options = {
                where: {
                    [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
                },
                order: [["createdAt", "DESC"]],
            };
            await Paginate(Vission_Mission, options, req, res, Op);
        } catch (error) {
            console.error("Error fetching Vission_Mission:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }

    // Fetch a single blog by ID
    async findOne(req, res) {
        const t = await sequelize.transaction();
        try {
            const result = await CheckExits(Vission_Mission, { id: req.params.id }, t);

            if (!result) {
                await t.rollback();
                return Base.sendError(res, HTTPS.NOT_FOUND, "Vission_Mission not found");
            }
            await t.commit();
            return Base.sendResponse(res, HTTPS.OK, result);
        } catch (error) {
            await t.rollback();
            console.error("Error fetching Vission_Mission:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }

    // Create a new blog
    async create(req, res) {
        const t = await sequelize.transaction();
        try {
            const data = {
                name: req.body?.name?.trim(),
                subname: req.body?.subname?.trim(),
                description: req.body?.description?.trim(),
                logo: await File_Uploade(req.files?.logo, "/uploads/masters/blog")
            }
            const exists = await CheckExits(Vission_Mission, { name: data?.name }, t);
         
         
            if (exists) {
                await t.rollback();
                return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Vission_Mission already exists");
            }

            const newItem = await CreateNew(Vission_Mission, data, t);

            await t.commit();

            return Base.sendResponse(res, HTTPS.CREATED, newItem);
        } catch (error) {
            await t.rollback();
            console.error("Error creating Vission_Mission:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }

    // Update a blog by ID
    async update(req, res) {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;

            const data = {
                name: req.body?.name?.trim(),
                subname: req.body?.subname?.trim(),
                description: req.body?.description?.trim(),
            }

            if (req.files && req.files.logo) {
                data.logo = await File_Uploade(req.files?.logo, "/uploads/masters/blog")
            }

            const exists = await CheckExits(Vission_Mission, { name: data?.name }, t);

            if (exists?.id != id && exists !== null) {
                await t.rollback();
                return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Vission_Mission name already in use");
            }

            const update = await UpdateData(Vission_Mission, data, { id: id }, t);

            await t.commit();
            return Base.sendResponse(res, HTTPS.ACCEPTED, "Vission_Mission updated successfully");
        } catch (error) {
            await t.rollback();
            console.error("Error updating Vission_Mission:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }

    // Delete blog by id
    async delete(req, res) {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;
            // Check if the country exists
            const result = await CheckExits(Vission_Mission, { id }, t);

            if (!result) {
                await t.rollback();
                return Base.sendError(res, HTTPS.NOT_FOUND, "Vission_Mission not found");
            }

            await Vission_Mission.destroy({ where: { id }, transaction: t, });

            await t.commit();
            return Base.sendResponse(res, HTTPS.OK, "Vission_Mission Deleted Successfully");
        } catch (error) {
            await t.rollback();
            console.error("Error Deleting Vission_Mission:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }


    // Update the status of a country
    async status(req, res) {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;

            const result = await CheckExits(Vission_Mission, { id }, t);

            if (!result) {
                await t.rollback();
                return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
            }

            await UpdateData(Vission_Mission, { status: result.status ? false : true }, { id }, t);

            await t.commit();

            return Base.sendResponse(res, HTTPS.OK, "Vission_Mission status updated successfully");
        } catch (error) {
            await t.rollback();
            console.error("Error updating Vission_Mission status:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }
}

module.exports = new Vission_MissionController();
