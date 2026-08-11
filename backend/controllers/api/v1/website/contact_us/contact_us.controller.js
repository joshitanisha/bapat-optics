const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
} = require("../../../../../helper/common/utils/dbUtils");
const bcrypt = require("bcryptjs");
const Base = require("../../../../../helper/exception_handling");
const {
  HTTPS,
} = require("../../../../../helper/https-status-codes/https-status-codes");
const {
  Contact_us,
  App_Setup,
  Admin_Notifiction,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
const {
  sendWatsappMessage,
  sendWatsapp,
} = require("../../../../../helper/WhatsAppMessage");

class Contact_usController {
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const { name, message, email, number } = req.body;
      const data = {
        name: req.body?.name?.trim(),
        email: req.body?.email?.trim(),
        number: req.body?.number?.trim(),
        message: req.body?.message?.trim(),
        status: 1,
      };

      const appsetup = await App_Setup.findOne({
        transaction: t,
      });

      const newItem = await CreateNew(Contact_us, data, t);

      const datanotification = {
        message: `A new enquiry has been booked by ${name}.`,
        status: true,
        seen_status: false,
      };

      await CreateNew(Admin_Notifiction, datanotification, t);
      const customerMessage = `
📩 𝗬𝗼𝘂𝗿 𝗥𝗲𝗾𝘂𝗲𝘀𝘁 𝗛𝗮𝘀 𝗕𝗲𝗲𝗻 𝗥𝗲𝗰𝗲𝗶𝘃𝗲𝗱 ✅

Hey ${name} 👋

Thank you for contacting Bapat Optics.
We have successfully received your message.

📝 Your Query:
"${message}"

⏳ Our support team will get back to you shortly.

Need urgent help?
📞 Contact our support team anytime.

💛 Thanks & Regards,
Bapat Optics
👓 Quality Vision, Trusted Care
`;
      const adminMessage = `
📩 𝗡𝗲𝘄 𝗖𝗼𝗻𝘁𝗮𝗰𝘁 𝗥𝗲𝗾𝘂𝗲𝘀𝘁 𝗥𝗲𝗰𝗲𝗶𝘃𝗲𝗱

A new customer inquiry has been submitted.

👤 Customer Details
👨 Name: ${name}
📧 Email: ${email}
📞 Mobile: ${number || "N/A"}

💬 Message:
${message}

📅 Submitted On: ${new Date().toLocaleString()}

Please review and respond to the customer.

— System Notification
`;

      await t.commit();

      Base.sendResponse(res, HTTPS.CREATED, newItem);

      sendWatsapp(number, customerMessage);
      sendWatsapp(appsetup?.contact_no, adminMessage);
    } catch (error) {
      await t.rollback();
      console.error("Error Posting Contact us form :", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}
module.exports = new Contact_usController();
