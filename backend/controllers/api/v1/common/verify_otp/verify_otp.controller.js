const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Base = require("../../../../../helper/exception_handling");
const {
  HTTPS,
} = require("../../../../../helper/https-status-codes/https-status-codes");
const {
  Users,
  VerifyOtp,
  Roles,
  Roles_Permissions,
  Permissions,
  Store_Detail,
  Country,
  s_category,
  Kyc_Document,
  Bank_Detail,
  Cart,
  Delivery_Boy_Detail,
} = require("../../../../../models/index");
const { customOtpGen } = require("otp-gen-agent");
const { mobileotp, otpmail } = require("../../../../../helper/NodeMailer");
const {
  VerifyAnyOtp,
  CheckExits,
  UpdateData,
} = require("../../../../../helper/common/utils/dbUtils");
const { CustomerLogin, CustomerSignup } = require("../auth/auth.controller");
const IDS = require("../../../../../helper/fix_ids");
const { sequelize } = require("../../../../../models/index");
class VerifyController {
  async sendOtp(req, res) {
    try {
      const { email, contact_no, role_id } = req.body;

      console.log(req.body);

      if (!email && !contact_no) {
        return Base.sendError(
          res,
          HTTPS.BAD_REQUEST,
          "email or contact_no number is required."
        );
      }

      const whereClause = {};

      if (role_id) {
        whereClause.role_id = role_id;
      } else {
        whereClause.role_id = IDS.RoleId.Customer;
      }

      if (email) {
        whereClause.email = email;
      } else if (contact_no) {
        whereClause.contact_no = contact_no;
      }

      const User = await Users.findOne({ where: whereClause });

      if (!User) {
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found.");
      }

       const otp = await customOtpGen({ length: 4, chars: "0123456789" });

      if (email) {
        await otpmail({ userEmail: email, otp });
        return Base.sendResponse(res, HTTPS.OK, {
          message: "OTP sent to email",
          email,
          otp,
        });
      } else {
        await mobileotp({ mobile: contact_no, otp });
        return Base.sendResponse(res, HTTPS.OK, {
          message: "OTP sent to mobile",
          contact_no,
          otp,
        });
      }
    } catch (error) {
      console.error(error);
      return Base.sendError(
        res,
        HTTPS.INTERNAL_SERVER_ERROR,
        "An error occurred while sending OTP."
      );
    }
  }

  async checkAndSendMobileOtp(req, res) {
    try {
      const otp = await customOtpGen({ length: 4, chars: "0123456789" });
      const User = await Users.findOne({
        include: [
          {
            model: Store_Detail,
            include: [
              {
                model: Country,
              },
              {
                model: s_category,
              },
            ],
          },
          {
            model: Kyc_Document,
          },
          {
            model: Bank_Detail,
          },
        ],
        where: {
          contact_no: req.body.contact_no,
        },
      });

      if (User && User?.role_id != IDS.RoleId.Vendor) {
      }

      if (
        User?.role_id == IDS.RoleId.Vendor &&
        User?.Store_Detail?.approval_status_id != IDS.ApprovalStatus.Rejected
      ) {
        return Base.sendError(
          res,
          HTTPS.ALREADY_REPORTED,
          "Vendor Already Exists "
        );
      }

      let user = null;
      if (User) {
        user = {
          id: User?.id,
          name: User?.name,
          contact_no: User?.contact_no,
          email: User?.email,
          store_name: User?.Store_Detail?.store_name,
          account_no: User?.Bank_Detail?.account_no,
          ifsc: User?.Bank_Detail?.ifsc,
          bank_name: User?.Bank_Detail?.bank_name,
          aadhar_image: User?.Kyc_Document?.aadhar_image,
          driving_license_image: User?.Kyc_Document?.driving_license_image,
          pan_image: User?.Kyc_Document?.pan_image,
          country_id: {
            value: User?.Store_Detail?.country_id,
            name: "country_id",
            label: User?.Store_Detail?.Country?.name,
          },
          s_category_id: {
            value: User?.Store_Detail?.s_category_id,
            name: "s_category_id",
            label: User?.Store_Detail?.s_category?.name,
          },
        };
      }

      await mobileotp(req.body.contact_no, otp);
      // return Base.sendResponse(res, HTTPS.OK, user);
      return Base.sendResponse(res, HTTPS.OK, user);
    } catch (error) {
      console.error(error);
      // return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyOtp(req, res) {
    try {
      const { email, contact_no, otp } = req.body;
      if (!otp || (!email && !contact_no)) {
        return Base.sendError(
          res,
          HTTPS.BAD_REQUEST,
          "OTP and either email or contact number are required."
        );
      }

      let contactType;

      if (email) {
        contactType = IDS.ContactType.Email;
      } else if (contact_no) {
        contactType = IDS.ContactType.Phone;
      }

      const result = await VerifyAnyOtp(VerifyOtp, req, res, contactType);

      if (result) {
        return Base.sendResponse(res, HTTPS.OTPVERIFIED);
      } else {
        return Base.sendError(res, HTTPS.ALREADY_REPORTED, "Invalid OTP");
      }
    } catch (error) {
      console.error(error);
      return Base.sendError(
        res,
        HTTPS.INTERNAL_SERVER_ERROR,
        "Error verifying OTP."
      );
    }
  }

  UpdatePassword = async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { email, contact_no, password } = req.body;

      if (!password || (!email && !contact_no)) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.BAD_REQUEST,
          "Password and either email or contact number are required."
        );
      }

      const whereClause = {};
      if (email) {
        whereClause.email = email;
      } else {
        whereClause.contact_no = contact_no;
      }

      const data = await CheckExits(Users, whereClause, t);

      if (!data) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found.");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await UpdateData(Users, { password: hashedPassword }, whereClause, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, "Password updated successfully.");
    } catch (error) {
      await t.rollback();
      console.error("Error in UpdatePassword:", error);
      return Base.sendError(
        res,
        HTTPS.INTERNAL_SERVER_ERROR,
        "Error updating password."
      );
    }
  };

  async verifyLogin(req, res) {
    try {
      const result = await VerifyAnyOtp(
        VerifyOtp,
        req,
        res,
        IDS.ContactType.Phone
      );

      if (result) {
        const User = await Users.findOne({
          where: {
            contact_no: req.body.contact_no,
            role_id: IDS.RoleId.Customer,
          },
        });
        if (User) {
          // Login
          await CustomerLogin(req, res);
          await Cart.destroy({
            where: { user_id: User.id },
          });
        } else {
          // Sign-up
          await CustomerSignup(req, res);
        }
      } else {
        return Base.sendError(res, HTTPS.ALREADY_REPORTED, "Invalid OTP");
      }
    } catch (error) {
      console.error(error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async sendEmailOtp(req, res) {
    try {
      const otp = await customOtpGen({ length: 4, chars: "0123456789" });
      await otpmail({ userEmail: req.body.email, otp: otp });
      return Base.sendResponse(res, HTTPS.OK, { email: req.body.email });
    } catch (error) {
      console.error(error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyEmailOtp(req, res) {
    try {
      const result = await VerifyAnyOtp(
        VerifyOtp,
        req,
        res,
        IDS.ContactType.Email
      );
      if (result) {
        return Base.sendResponse(res, HTTPS.OTPVERIFIED);
      } else {
        return Base.sendError(res, HTTPS.INVALIDOTP);
      }
    } catch (error) {
      console.error(error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async sendVendorMobileOtp(req, res) {
    try {
      const otp = await customOtpGen({ length: 4, chars: "0123456789" });
      const User = await Users.findOne({
        where: {
          contact_no: req.body.contact_no,
          role_id: IDS.RoleId.Vendor,
        },
      });
      if (User) {
        await mobileotp(req.body.contact_no, otp);
        return Base.sendResponse(res, HTTPS.OK, "OTP Sent Successfully");
      } else {
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found.");
      }
    } catch (error) {
      console.error(error);
      // return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async sendDeliveryBoyMobileOtp(req, res) {
    try {
      const otp = await customOtpGen({ length: 4, chars: "0123456789" });
      const User = await Users.findOne({
        include: [
          {
            model: Delivery_Boy_Detail,
            where: { approval_status_id: IDS.ApprovalStatus.Approved },
          },
        ],
        where: {
          contact_no: req.body.contact_no,
          role_id: IDS.RoleId.DeliveryBoy,
        },
      });

      if (User) {
        await mobileotp(req.body.contact_no, otp);
        return Base.sendResponse(res, HTTPS.OK, "OTP Sent Successfully");
      } else {
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found.");
      }
    } catch (error) {
      console.error(error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async sendVendorEmailOtp(req, res) {
    try {
      const User = await Users.findOne({
        where: {
          email: req.body.email,
          role_id: IDS.RoleId.Vendor,
        },
      });
      if (User) {
        const otp = await customOtpGen({ length: 4, chars: "0123456789" });
        await otpmail({ userEmail: req.body.email, otp: otp });
        return Base.sendResponse(res, HTTPS.OK, {
          email: req.body.email,
          otp: otp,
        });
      } else {
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found.");
      }
    } catch (error) {
      console.error(error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteMobileOtp(req, res) {
    try {
      const deletedOtp = await VerifyOtp.destroy({
        where: { contact_no: req.body.contact_no },
      });

      if (deletedOtp) {
        return Base.sendResponse(res, HTTPS.OK, "OTP Deleted successfully");
      } else {
        return Base.sendError(res, HTTPS.NOT_FOUND, "OTP not found.");
      }
    } catch (error) {
      console.error("Error deleting OTP:", error);
      return Base.sendError(
        res,
        HTTPS.INTERNAL_SERVER_ERROR,
        "An error occurred while deleting OTP."
      );
    }
  }
}

module.exports = new VerifyController();
