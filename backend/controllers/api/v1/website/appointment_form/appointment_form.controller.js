const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CheckExits_T, // ✅ ADDED THIS
  CreateNew,
  UpdateData,
  File_Uploade,
} = require("../../../../../helper/common/utils/dbUtils.js");

const Base = require("../../../../../helper/exception_handling/index.js");
const IDS = require("../../../../../helper/fix_ids.js");
const {
  HTTPS,
} = require("../../../../../helper/https-status-codes/https-status-codes.js");
const { sendWatsapp } = require("../../../../../helper/WhatsAppMessage.js");
const {
  Appointment_Form,
  Appointment_Reason,
  sequelize,
  App_Setup,
  Admin_Notifiction,
  Appointment_Status,
} = require("../../../../../models/index");
const { Op } = require("sequelize");

class Appointment_FormController {
  // Fetch all Appointment_Forms
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const fromDate = req.query.from ? new Date(req.query.from.trim()) : null;
      const toDate = req.query.to ? new Date(req.query.to.trim()) : null;
      let startCheckDate;

      const whereClause = { user_id: req.user.user_id };

      if (toDate) {
        startCheckDate = new Date(toDate);
        startCheckDate.setDate(startCheckDate.getDate() + 1);
        startCheckDate.setHours(0, 0, 0, 0);
      }

      if (fromDate && toDate) {
        whereClause.createdAt = {
          [Op.between]: [fromDate.toISOString(), startCheckDate.toISOString()],
        };
      } else if (fromDate) {
        whereClause.createdAt = {
          [Op.gte]: fromDate.toISOString(),
        };
      } else if (toDate) {
        whereClause.createdAt = {
          [Op.lte]: startCheckDate.toISOString(),
        };
      }

      if (name) {
        const terms = name.trim().split(/\s+/);

        whereClause[Op.or] = terms.flatMap((term) => [
          { name: { [Op.like]: `%${term}%` } },
          { last_name: { [Op.like]: `%${term}%` } },
        ]);
      }

      const options = {
        include: [
          { model: Appointment_Reason, paranoid: false },
          { model: Appointment_Status },
        ],
        where: whereClause,
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Appointment_Form, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching appointment_Form:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single Appointment_Form by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const include = [
        { model: Appointment_Reason },
        { model: Appointment_Status },
      ];

      const appointment_Form = await CheckExits(
        Appointment_Form,
        { id: req.params.id },
        t,
        include,
      );
      if (!appointment_Form) {
        return Base.sendError(
          res,
          HTTPS.NOT_FOUND,
          "appointment_Form not found",
        );
      }
      const data = {
        name: appointment_Form?.name,
        date_of_birth: appointment_Form?.date_of_birth,
        last_name: appointment_Form?.last_name,
        time: appointment_Form?.time,
        appointment_reason_id: {
          name: "appointment_reason_id",
          label: appointment_Form?.Appointment_Reason?.name,
          value: appointment_Form?.Appointment_Reason?.id,
        },
      };
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error fetching appointment_Form:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create Appointment_Form
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const {
        name,
        last_name,
        date_of_birth,
        time,
        appointment_reason_id,
        contact_no,
        date,
      } = req.body;

      if (!name || typeof name !== "string" || name.trim() === "") {
        await t.rollback();
        return Base.sendError(res, HTTPS.BAD_REQUEST, "your name is required");
      }

      const data = {
        name: name.trim(),
        last_name: last_name.trim(),
        date_of_birth,
        time,
        contact_no,
        appointment_reason_id,
        // user_id: req.user.user_id,
        appointment_status_id: IDS.Appointment_Status.Pending,
        status: true,
        date,
      };

      const dataappointment = await CreateNew(Appointment_Form, data, t);
      const appsetup = await App_Setup.findOne({
        transaction: t,
      });

      const appointment = await Appointment_Form.findOne({
        include: [{ model: Appointment_Reason, paranoid: false }],
        where: { id: dataappointment?.id },
        transaction: t,
      });

      const datanotification = {
        message: `A new appointment has been booked by ${name}.`,
        status: true,
        seen_status: false,
      };
      
      await CreateNew(Admin_Notifiction, datanotification, t);

      await t.commit();

      Base.sendResponse(res, HTTPS.OK, "Appointment Booked Successfully");

      const customerMessage = `
📅 𝗬𝗼𝘂𝗿 𝗔𝗽𝗽𝗼𝗶𝗻𝘁𝗺𝗲𝗻𝘁 𝗥𝗲𝗾𝘂𝗲𝘀𝘁 𝗛𝗮𝘀 𝗕𝗲𝗲𝗻 𝗥𝗲𝗰𝗲𝗶𝘃𝗲𝗱 ✅

Hey ${name} 👋

Thank you for booking an appointment with us.
Your request has been successfully submitted.

📋 Appointment Details
📅 Date : ${date || "N/A"}
🕐 Preferred Time: ${time || "N/A"}
📝 Reason: ${appointment?.Appointment_Reason.name || "N/A"}


⏳ Our team will review your request and confirm your appointment shortly.

Need Help?
📞 Contact our support team anytime.

💛 Thanks & Regards,
Bapat Optics
👓 Quality Vision, Trusted Care
`;

      const adminMessage = `
📅 𝗡𝗲𝘄 𝗔𝗽𝗽𝗼𝗶𝗻𝘁𝗺𝗲𝗻𝘁 𝗥𝗲𝗾𝘂𝗲𝘀𝘁 𝗥𝗲𝗰𝗲𝗶𝘃𝗲𝗱

A new appointment request has been submitted.

👤 Customer Details
👨 Name: ${name} ${last_name || ""}
📞 Contact No: ${contact_no}

📋 Appointment Details
📅 Date : ${date || "N/A"}
🕐 Preferred Time: ${time || "N/A"}
📝 Reason: ${appointment?.Appointment_Reason.name || "N/A"}


📅 Submitted On: ${new Date().toLocaleString()}

Please review and confirm the appointment.

— System Notification
`;

      await sendWatsapp(contact_no, customerMessage);
      await sendWatsapp(appsetup?.contact_no, adminMessage);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Appointment_Form:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update Appointment_Form by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const data = {
        name: req.body.name.trim(),
        last_name: req.body.last_name.trim(),
        date_of_birth: req.body.date_of_birth,
        time: req.body.time,
        appointment_reason_id: req.body.appointment_reason_id,
      };

      const exits = await CheckExits(Appointment_Form, { id: id }, t);
      if (exits?.id != id && exits !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Appointment_Form name already in use",
        );
      }

      await UpdateData(Appointment_Form, data, { id: id }, t);
      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        {},
        "Appointment_Form updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Appointment_Form:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete Appointment_Form by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const appointment_Form = await CheckExits(Appointment_Form, { id }, t);
      if (!appointment_Form) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_FOUND,
          "appointment_Form not found",
        );
      }

      await Appointment_Form.destroy({ where: { id }, transaction: t });
      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        {},
        "Appointment_Form deleted successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error deleting Appointment_Form:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update Appointment_Form status
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Appointment_Form, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Appointment_Form,
        { status: result.status ? false : true },
        { id },
        t,
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Appointment_Form status updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Appointment_Form status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async getDownloadExcelCustomerList(req, res) {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Customer List");
      const filePath = path.join(__dirname, "Customer_List.xlsx");

      const term = req.query.term || "";
      const fromDate = req.query.from
        ? new Date(req.query.from.trim()).setHours(0, 0, 0, 0)
        : null;
      const toDate = req.query.to
        ? new Date(req.query.to.trim()).setHours(23, 59, 59, 999)
        : null;

      let whereClause = {
        role_id: IDS.RoleId.Customer,
      };

      // Date filter
      if (fromDate && toDate) {
        whereClause.createdAt = {
          [Op.between]: [fromDate, toDate],
        };
      } else if (fromDate) {
        whereClause.createdAt = {
          [Op.gte]: fromDate,
        };
      } else if (toDate) {
        whereClause.createdAt = {
          [Op.lte]: toDate,
        };
      }

      // Term filter
      if (term) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${term}%` } },
          { email: { [Op.like]: `%${term}%` } },
          { contact_no: { [Op.like]: `%${term}%` } },
        ];
      }

      const customerRecords = await Users.findAll({
        where: whereClause,
        order: [["createdAt", "DESC"]],
      });

      worksheet.addRow([
        "Sr No",
        "Date of Birth",
        "Time",
        "Reason",
        "Created At",
      ]);

      let DataArray = [];

      customerRecords.forEach((data, index) => {
        const result = {
          name: data?.name + " " + data?.last_name || "-",
          dob: data?.date_of_birth || "-",
          time: data?.time || "-",
          reason: data?.Appointment_Reason?.name,
          createdAt: data?.createdAt?.toISOString().split("T")[0] || "-",
        };

        DataArray.push(result);
      });

      DataArray.forEach((record, index) => {
        worksheet.addRow([
          index + 1,
          record.name,
          record.dob,
          record.time,
          record.reason,
          record.createdAt,
        ]);
      });

      await workbook.xlsx.writeFile(filePath);

      res.download(filePath, "Customer_List.xlsx", (err) => {
        if (err) {
          console.error(err);
          res
            .status(500)
            .send("An error occurred while generating the Excel file.");
        }

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    } catch (error) {
      console.error(error);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      res
        .status(500)
        .send("An error occurred while generating the Excel file.");
    }
  }
}

module.exports = new Appointment_FormController();
