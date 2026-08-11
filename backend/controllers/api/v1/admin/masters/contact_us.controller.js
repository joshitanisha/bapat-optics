const {
    Paginate,
    CheckExits,
    CreateNew,
    UpdateData,
} = require("../../../../../helper/common/utils/dbUtils");
const Base = require("../../../../../helper/exception_handling");
const { HTTPS } = require("../../../../../helper/https-status-codes/https-status-codes");
const { Contact_us: ContactUsForm, sequelize } = require("../../../../../models/index");
const { Op } = require("sequelize");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");

class Contact_usController {
    // Fetch All
    async findAll(req, res) {
        try {
            const term = req.query.term?.trim() || "";
            const searchEmail = req.query.searchEmail?.trim() || "";
            const searchNumber = req.query.searchNumber?.trim() || "";
            const fromDate = req.query.from ? new Date(req.query.from.trim()) : null;
            const toDate = req.query.to ? new Date(req.query.to.trim()) : null;
            let startCheckDate;

            if (toDate) {
                startCheckDate = new Date(toDate);
                startCheckDate.setDate(startCheckDate.getDate() + 1);
                startCheckDate.setHours(0, 0, 0, 0);
            }

            let whereClause = {
                [Op.and]: [
                    term && { name: { [Op.like]: `%${term}%` } },
                    searchEmail && { email: { [Op.like]: `%${searchEmail}%` } },
                    searchNumber && { number: { [Op.like]: `%${searchNumber}%` } },
                ].filter(Boolean),
            };

            if (fromDate && toDate) {
                whereClause.createdAt = {
                    [Op.between]: [fromDate.toISOString(), startCheckDate.toISOString()],
                };
            } else if (fromDate) {
                whereClause.createdAt = { [Op.gte]: fromDate.toISOString() };
            } else if (toDate) {
                whereClause.createdAt = { [Op.lte]: startCheckDate.toISOString() };
            }

            const options = {
                where: whereClause,
                order: [["createdAt", "DESC"]],
            };

            await Paginate(ContactUsForm, options, req, res, Op);
        } catch (error) {
            console.error("Error fetching ContactUsForms:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }

    // Find One
    async findOne(req, res) {
        const t = await sequelize.transaction();
        try {
            const result = await CheckExits(ContactUsForm, { id: req.params.id }, t);
            if (!result) {
                await t.rollback();
                return Base.sendError(res, HTTPS.NOT_FOUND, "ContactUsForm not found");
            }
            await t.commit();
            return Base.sendResponse(res, HTTPS.OK, result);
        } catch (error) {
            await t.rollback();
            console.error("Error fetching ContactUsForm:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }

    // Create
    async create(req, res) {
        const t = await sequelize.transaction();
        try {
            const data = {
                name: req.body?.name?.trim(),
                email: req.body?.email?.trim(),
                number: req.body?.number?.trim(),
                message: req.body?.message?.trim(),
                status: 1
            };

            const newItem = await CreateNew(ContactUsForm, data, t);
            await t.commit();

            return Base.sendResponse(res, HTTPS.CREATED, newItem);
        } catch (error) {
            await t.rollback();
            console.error("Error creating ContactUsForm:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }

    // Update
    async update(req, res) {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;

            const data = {
                name: req.body?.name?.trim(),
                email: req.body?.email?.trim(),
                number: req.body?.number?.trim(),
                message: req.body?.message?.trim(),
            };

            await UpdateData(ContactUsForm, data, { id }, t);
            await t.commit();

            return Base.sendResponse(res, HTTPS.ACCEPTED, "Data updated successfully");
        } catch (error) {
            await t.rollback();
            console.error("Error updating ContactUsForm:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }

    // Delete
    async delete(req, res) {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;
            await ContactUsForm.destroy({ where: { id }, transaction: t });
            await t.commit();

            return Base.sendResponse(res, HTTPS.OK, "ContactUsForm deleted successfully");
        } catch (error) {
            await t.rollback();
            console.error("Error deleting ContactUsForm:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }

    // Toggle Status
    async status(req, res) {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;
            const result = await CheckExits(ContactUsForm, { id }, t);

            await UpdateData(ContactUsForm, { status: !result.status }, { id }, t);
            await t.commit();

            return Base.sendResponse(res, HTTPS.OK, "ContactUsForm status updated successfully");
        } catch (error) {
            await t.rollback();
            console.error("Error updating status:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }

    // Export to Excel
    async getDownloadExcelContactFormList(req, res) {
        const filePath = path.join(__dirname, "Contact_forms.xlsx");

        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Contact Form List");

            const term = req.query.term?.trim() || "";
            const email = req.query.searchEmail?.trim() || "";
            const number = req.query.searchNumber?.trim() || "";

            const fromDate = req.query.from ? new Date(req.query.from.trim()) : null;
            const toDate = req.query.to ? new Date(req.query.to.trim()) : null;

            let whereClause = {
                [Op.and]: [
                    term && { name: { [Op.like]: `%${term}%` } },
                    email && { email: { [Op.like]: `%${email}%` } },
                    number && { number: { [Op.like]: `%${number}%` } },
                ].filter(Boolean),
            };

            if (fromDate && toDate) {
                whereClause.createdAt = {
                    [Op.between]: [fromDate, new Date(toDate.setHours(23, 59, 59, 999))],
                };
            } else if (fromDate) {
                whereClause.createdAt = { [Op.gte]: fromDate };
            } else if (toDate) {
                whereClause.createdAt = { [Op.lte]: new Date(toDate.setHours(23, 59, 59, 999)) };
            }

            const records = await ContactUsForm.findAll({
                where: whereClause,
                order: [["createdAt", "DESC"]],
            });

            worksheet.addRow([
                "Sr No",
                "Customer Name",
                "Email",
                "Contact Number",
                "Message",
                "Created At",
            ]);

            records.forEach((data, index) => {
                worksheet.addRow([
                    index + 1,
                    data?.name || "-",
                    data?.email || "-",
                    data?.number || "-",
                    data?.message || "-",
                    data?.createdAt?.toISOString().split("T")[0] || "-",
                ]);
            });

            await workbook.xlsx.writeFile(filePath);
            res.download(filePath, "Contact_Forms.xlsx", (err) => {
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                if (err) console.error("Download error:", err);
            });
        } catch (error) {
            console.error("Excel generation error:", error);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            res.status(500).send("An error occurred while generating the Excel file.");
        }
    }
}

module.exports = new Contact_usController();