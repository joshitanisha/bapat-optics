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
const { Shape, sequelize } = require("../../../../../models/index");
const { Op } = require("sequelize");
class ShapeController {


    // Fetch all Shape
    async findAll(req, res) {
        try {
            const name = req.query.term?.trim() || "";
            const options = {
                where: {
                    [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
                },
                order: [["createdAt", "DESC"]],
            };
            await Paginate(Shape, options, req, res, Op);
        } catch (error) {
            console.error("Error fetching Shape:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }

    // Fetch a single Shape by ID
    async findOne(req, res) {
        const t = await sequelize.transaction();
        try {
            const result = await CheckExits(Shape, { id: req.params.id }, t);

            if (!result) {
                await t.rollback();
                return Base.sendError(res, HTTPS.NOT_FOUND, "Shape not found");
            }
            await t.commit();
            return Base.sendResponse(res, HTTPS.OK, result);
        } catch (error) {
            await t.rollback();
            console.error("Error fetching Shape:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }

    // Create a new Shape
    async create(req, res) {
        const t = await sequelize.transaction();
        try {
            const data = {
                name: req.body?.name?.trim(),
                image: await File_Uploade(req.files?.image, "/uploads/masters/shape")
            }
            const exists = await CheckExits(Shape, { name: data?.name }, t);
         
         
            if (exists) {
                await t.rollback();
                return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Shape already exists");
            }

            const newItem = await CreateNew(Shape, data, t);

            await t.commit();

            return Base.sendResponse(res, HTTPS.CREATED, newItem);
        } catch (error) {
            await t.rollback();
            console.error("Error creating Shape:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }

    // Update a Shape by ID
    async update(req, res) {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;

            const data = {
                name: req.body?.name?.trim(),
            }

            if (req.files && req.files.image) {
                data.image = await File_Uploade(req.files?.image, "/uploads/masters/shape")
            }

            const exists = await CheckExits(Shape, { name: data?.name }, t);

            if (exists?.id != id && exists !== null) {
                await t.rollback();
                return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Shape name already in use");
            }

            const update = await UpdateData(Shape, data, { id: id }, t);

            await t.commit();
            return Base.sendResponse(res, HTTPS.ACCEPTED, "Shape updated successfully");
        } catch (error) {
            await t.rollback();
            console.error("Error updating Shape:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }

    // Delete Shape by id
    async delete(req, res) {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;
            // Check if the country exists
            const result = await CheckExits(Shape, { id }, t);

            if (!result) {
                await t.rollback();
                return Base.sendError(res, HTTPS.NOT_FOUND, "Shape not found");
            }

            await Shape.destroy({ where: { id }, transaction: t, });

            await t.commit();
            return Base.sendResponse(res, HTTPS.OK, "Shape Deleted Successfully");
        } catch (error) {
            await t.rollback();
            console.error("Error Deleting Shape:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }


    // Update the status of a country
    async status(req, res) {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;

            const result = await CheckExits(Shape, { id }, t);

            if (!result) {
                await t.rollback();
                return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
            }

            await UpdateData(Shape, { status: result.status ? false : true }, { id }, t);

            await t.commit();

            return Base.sendResponse(res, HTTPS.OK, "Shape status updated successfully");
        } catch (error) {
            await t.rollback();
            console.error("Error updating Shape status:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }
}

module.exports = new ShapeController();
