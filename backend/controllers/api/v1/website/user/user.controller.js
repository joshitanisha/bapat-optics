const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
  VerifyAnyOtp,
} = require("../../../../../helper/common/utils/dbUtils");
const bcrypt = require("bcryptjs");
const Base = require("../../../../../helper/exception_handling");
const {
  HTTPS,
} = require("../../../../../helper/https-status-codes/https-status-codes");
const {
  Users,
  Gender,
  User_Address,
  Users_Address_Details,
  Roles,
  Product_Order,
  VerifyOtp,
  Country_Code,
  Wallet,
  Users_Refer,
  App_Setup,
  Order_Refer_History,
  Admin_Notifiction,
  Notification,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
const { customOtpGen } = require("otp-gen-agent");
const IDS = require("../../../../../helper/fix_ids");
const {
  mobileotp,
  mailOrder,
  mailNewUser,
} = require("../../../../../helper/NodeMailer");
const jwt = require("jsonwebtoken");
const {
  generateReferralCode,
} = require("../../../../../helper/common/function");
const {
  AdminNotifications,
} = require("../../../../../helper/mobile_notifications");
const { create_User } = require("../../../../../helper/order_notification");

class UserController {
  SignUpUser = async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { refer_code } = req.body;

      const refer_code_generate = await generateReferralCode(5, 4, t);

      const data = {
        name: req?.body?.name?.trim(),
        // last_name: req?.body?.LastNamel?.trim(),
        contact_no: req?.body?.contact_no,
        email: req?.body?.email,
        role_id: IDS.RoleId.Customer,
        refer_code: refer_code_generate,
        password: await bcrypt.hash(req.body.password, 10),
      };

      const contactExits = await CheckExits(
        Users,
        { contact_no: data?.contact_no },
        t,
      );
      if (contactExits) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, {
          contact_no: "Contact No already exists",
        });
      }

      // Check if the email already exists
      const emailExits = await CheckExits(Users, { email: data?.email }, t);
      if (emailExits) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, {
          email: "Email already exists",
        });
      }
      const appsetup = await App_Setup.findOne({
        transaction: t,
      });

      if (refer_code) {
        const refered_by = await Users.findOne({
          where: {
            refer_code: refer_code,
          },
          transaction: t,
        });

        if (!refered_by) {
          await t.rollback();
          return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, {
            refer_code: "Invalid Refer Code",
          });
        }
      }

      const usercreate = await CreateNew(Users, data, t);

      if (refer_code) {
        const refered_by = await Users.findOne({
          where: {
            refer_code: refer_code,
          },
          transaction: t,
        });
        if (refered_by && usercreate) {
          await Users_Refer.create(
            {
              refer_by: refered_by?.id,
              refer_to: usercreate?.id,
            },
            {
              transaction: t,
            },
          );

          await CreateNew(
            Order_Refer_History,
            {
              user_id: refered_by?.id,
              user_by_id: usercreate?.id,
            },
            t,
          );
        }
      }

      const wallet = await CreateNew(
        Wallet,
        { user_id: usercreate.id, amount: 0 },
        t,
      );

      const datanotification = {
        message: `A new customer, ${req.body.name}, has successfully registered.`,
        status: true,
        seen_status: false,
      };
      await CreateNew(Admin_Notifiction, datanotification, t);

      const user = await Users.findOne({
        include: [
          {
            model: Roles,
          },
        ],
        where: {
          id: usercreate.id,
        },
        transaction: t,
      });
      const token = jwt.sign(
        {
          user_id: user.id,
          name: user.name,
          role_id: user.role_id,
          role: user.Role?.name,
        },
        process.env.SECRETKEY,
        { expiresIn: "365d" },
      );

      const resdata = {
        token,
        role: user.Role.name || "Unknown",
      };
      await t.commit();

      await mailNewUser(usercreate, appsetup?.email);

      return Base.sendResponse(res, HTTPS.OK, resdata);
    } catch (error) {
      console.error("Error in create user:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  };

  LoginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      // console.log(req.body, "req.body req.body");

      const user = await Users.findOne({
        where: {
          [Op.or]: [{ email: email }, { contact_no: email }],
          role_id: IDS.RoleId.Customer,
          status: true,
        },
      });

      if (!user) {
        return Base.sendError(res, HTTPS.ALREADY_REPORTED, {
          email: "User not found",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password || "");
      if (isMatch) {
        const token = jwt.sign(
          {
            user_id: user.id,
            name: user.name,
            role_id: user.role_id,
            role: user.Role?.name,
          },
          process.env.SECRETKEY,
          { expiresIn: "365d" },
        );

        const resdata = {
          token,
          role: user.Role?.name || "Unknown",
        };

        return Base.sendResponse(res, HTTPS.OK, resdata);
      } else {
        return Base.sendError(res, HTTPS.ALREADY_REPORTED, {
          password: "Incorrect password.",
        });
        // return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Incorrect password.");
      }
    } catch (error) {
      console.error("Error in login:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  };

  getUser = async (req, res) => {
    try {
      const result = await Users.findOne({
        include: [{ model: Country_Code }, { model: Gender }],
        where: { id: req.user.user_id },
      });

      if (!result) {
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found.");
      }
      const data = {
        name: result?.name,
        last_name: result?.last_name,
        contact_no: result?.contact_no,
        email: result?.email,
        image: result?.image,
        refer_code: result?.refer_code,
        date_of_birth: result?.date_of_birth,
        // gender_id: result?.gender_id,

        country_code_id: {
          value: result?.country_code_id,
          name: "country_code_id",
          label: result?.Country_Code?.country_code,
          no_length: result?.Country_Code?.no_length,
        },
      };

      if (result?.Gender) {
        data.gender_id = {
          value: result?.gender_id,
          name: "gender_id",
          label: result?.Gender?.name,
        };
      }

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in adminDetails:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  };

  updateProfile = async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const user_id = req.user.user_id;
      const data = {
        name: req?.body?.name?.trim(),
        // last_name: req?.body?.last_name?.trim(),
        contact_no: req?.body?.contact_no,
        email: req?.body?.email,
        gender_id: req?.body?.gender_id,
        role_id: IDS.RoleId.Customer,
        date_of_birth: req?.body?.date_of_birth,
        country_code_id: req?.body?.country_code_id,
      };
      if (req.files && req.files?.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/user",
        );
      }
      if (req.body.alternate_no) {
        data.alternate_no = req.body.alternate_no;
      }
      // Check if the contact number already exists
      const contactExits = await CheckExits(
        Users,
        { contact_no: data?.contact_no },
        t,
      );
      if (contactExits?.id != user_id && contactExits !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Contact No already exists",
        );
      }

      // Check if the email already exists
      const emailExits = await CheckExits(Users, { email: data?.email }, t);
      if (emailExits?.id != user_id && emailExits !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Email ID already exists",
        );
      }

      // Create the new user
      const newUser = await UpdateData(Users, data, { id: user_id }, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.ACCEPTED, newUser);
    } catch (error) {
      console.error("Error in adminDetails:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  };

  deleteAccount = async (req, res) => {
    try {
      const user = await Users.findOne({ where: { id: req.user.user_id } });

      if (!user) {
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found.");
      }

      // Await the order query to ensure it completes properly
      const order = await Product_Order.findOne({
        where: {
          user_id: req.user.user_id,
          order_status_id: { [Op.lte]: IDS.order_status.Delivered },
        },
      });

      // Check if any order was found in progress
      if (order) {
        return Base.sendError(
          res,
          HTTPS.BAD_REQUEST,
          "You cannot delete your account while orders are in progress. Please complete all orders first.",
        );
      }

      // Generate OTP and send it
      const otp = await customOtpGen({ length: 4, chars: "0123456789" });
      await mobileotp({ mobile: user.contact_no, otp });

      return Base.sendResponse(
        res,
        HTTPS.OK,
        otp,
        "Enter the OTP to verify delete account",
      );
    } catch (error) {
      console.error("Error in deleteAccount:", error);
      return Base.sendError(
        res,
        HTTPS.INTERNAL_SERVER_ERROR,
        "An error occurred while processing the request.",
      );
    }
  };

  verifyDeleteAccount = async (req, res) => {
    try {
      const user = await Users.findOne({ where: { id: req.user.user_id } });

      if (!user) {
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found.");
      }

      const otpRecord = await VerifyOtp.findOne({
        where: {
          contact_no: user.contact_no,
          otp: req?.body?.otp,
        },
      });

      console.log(otpRecord, "otpRecord");

      if (otpRecord) {
        // Deleting the user and OTP record
        await Users.destroy({ where: { id: req.user.user_id } });
        await VerifyOtp.destroy({
          where: {
            contact_no: user.contact_no,
            otp: req?.body?.otp,
          },
        });

        return Base.sendResponse(
          res,
          HTTPS.OK,

          "Account deleted successfully.",
        );
      } else {
        return Base.sendError(res, HTTPS.BAD_REQUEST, "Invalid OTP.");
      }
    } catch (error) {
      console.error("Error in verifyDeleteAccount:", error);
      return Base.sendError(
        res,
        HTTPS.INTERNAL_SERVER_ERROR,
        "An error occurred while deleting the account.",
      );
    }
  };

  updateNumber = async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const userId = req.params.id;

      // console.log(userId, '22222222222222222');
      // console.log(req.body.type, '1111111111111111111111111111111111111');

      if (req.body.type === "contact_no") {
        // console.log("ddddddddddddd");
        const data = { contact_no: "" };
        const update = await UpdateData(
          Users,
          { name: "qwertyui" },
          { id: userId },
          t,
        );
        console.log(update, "contact_no");
      } else {
        const data = { alternate_no: "" };
        // console.log(data, 'alternate_nodata');
        const update = await UpdateData(Users, data, { id: userId }, t);
        // console.log(update, 'alternate_no');
      }

      if (!userId) {
        return Base.sendError(res, HTTPS.NOT_FOUND, "user not found.");
      }

      return Base.sendResponse(
        res,
        HTTPS.OK,

        "Number deleted successfully.",
      );
    } catch (error) {
      console.error("Error in deleting number:", error);
      return Base.sendError(
        res,
        HTTPS.INTERNAL_SERVER_ERROR,
        "An error occurred while deleting the number.",
      );
    }
  };

  ChangePassword = async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const user_id = req.user.user_id;

      const data = {
        old_password: req?.body?.old_password?.trim(),
        password: req?.body?.password?.trim(),
      };

      const user = await Users.findOne({ where: { id: user_id } });

      if (!user) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found");
      }

      const isMatch = await bcrypt.compare(data.old_password, user.password);
      if (!isMatch) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Old password is incorrect",
        );
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const updatedUser = await Users.update(
        { password: hashedPassword },
        { where: { id: user_id }, transaction: t },
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Password updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error in ChangePassword:", error);
      return Base.sendError(
        res,
        HTTPS.INTERNAL_SERVER_ERROR,
        "Something went wrong",
      );
    }
  };
}

module.exports = new UserController();
