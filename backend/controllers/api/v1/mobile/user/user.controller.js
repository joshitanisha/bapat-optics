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
  Roles,
  Product_Order,
  VerifyOtp,
  Country_Code,
  Wallet,
  Users_Refer,
  App_Setup,
  Order_Refer_History,
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
        name: req?.body?.first_name?.trim(),
        last_name: req?.body?.last_name?.trim(),
        contact_no: req?.body?.contact_no,
        email: req?.body?.email,
        device_key: req?.body?.device_key,
        role_id: IDS.RoleId.Customer,
        country_code_id: req?.body?.country_code_id,
        refer_code: refer_code_generate,
        password: await bcrypt.hash(req.body.password, 10),
      };

      const contactExits = await CheckExits(
        Users,
        { contact_no: data?.contact_no },
        t
      );
      if (contactExits) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Contact No already exists"
        );
      }

      // Check if the email already exists
      const emailExits = await CheckExits(Users, { email: data?.email }, t);
      if (emailExits) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Email ID already exists"
        );
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

        console.log(refered_by, "refered_by");

        if (!refered_by) {
          await t.rollback();
          return Base.sendError(
            res,
            HTTPS.NOT_ACCEPTABLE,
            "Invalid Refer Code"
          );
          // return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, {
          //   refer_by: "Invalid Refer Code",
          // });
        }

        const refercount = await Users_Refer.count({
          where: {
            refer_by: refered_by?.id,
          },
          transaction: t,
        });

        if (appsetup?.customer_limit < refercount) {
          await t.rollback();
          return Base.sendError(
            res,
            HTTPS.NOT_ACCEPTABLE,
            "Customer Limit Reached"
          );
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
            }
          );

          await CreateNew(
            Order_Refer_History,
            {
              order_count:
                Number(refered_by.refer_order_count) +
                Number(appsetup.refer_to_order),
              user_id: refered_by?.id,
              user_by_id: usercreate?.id,
            },
            t
          );

          await UpdateData(
            Users,
            {
              refer_order_count: Number(appsetup.refer_to_order),
            },
            { id: usercreate?.id },
            t
          );

          // await UpdateData(
          //   Users,
          //   {
          //     refer_order_count:
          //       Number(refered_by.refer_order_count) +
          //       Number(appsetup.refer_by_order),
          //   },
          //   { id: refered_by?.id },
          //   t
          // );

          // await Users_coupon_details.create(
          //   {
          //     user_id: newUser?.id,
          //     refer_id: refered_by?.id,
          //     coupon_id: 1,
          //   },
          //   {
          //     transaction: t,
          //   }
          // );

          // await Users_coupon_details.create(
          //   {
          //     user_id: refered_by?.id,
          //     refer_id: newUser?.id,
          //     coupon_id: 2,
          //   },
          //   {
          //     transaction: t,
          //   }
          // );
        }
      }

      const wallet = await CreateNew(
        Wallet,
        { user_id: usercreate.id, amount: 0 },
        t
      );

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
        { expiresIn: "365d" }
      );

      const resdata = {
        token,
        role: user.Role.name || "Unknown",
      };
      await t.commit();
      // await create_User(usercreate.id);
      const newCreatednotification = await CreateNew(Notification, {
        user_id: usercreate.id,
        message: "Congrats! You’ve unlocked a discount on your first order.",
      });

      await AdminNotifications(usercreate?.device_key, newCreatednotification);

      await mailNewUser(usercreate, appsetup?.email);

      return Base.sendResponse(res, HTTPS.OK, resdata);
    } catch (error) {
      console.error("Error in create user:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  };

  LoginUser = async (req, res) => {
    try {
      const { email, contact_no, password } = req.body;

      if (!email && !contact_no) {
        return Base.sendError(
          res,
          HTTPS.BAD_REQUEST,
          "Email or contact number are required."
        );
      }

      // Find user by email or contact number
      const user = await Users.findOne({
        where: {
          status: true,
          role_id: {
            [Op.in]: [IDS.RoleId.Customer, IDS.RoleId.Doctor],
          },
          [Op.or]: [
            ...(email ? [{ email }] : []),
            ...(contact_no ? [{ contact_no }] : []),
          ],
        },
        include: [{ model: Roles }],
      });

      if (!user) {
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found.");
      }

      // Compare password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Invalid password.");
      }

      const updateUser = await UpdateData(
        Users,
        { device_key: req.body.device_key },
        { id: user.id }
      );
      console.log(updateUser, "updateUser");

      // Generate token
      const token = jwt.sign(
        {
          user_id: user.id,
          name: user.name,
          role_id: user.role_id,
          role: user.Role?.name,
        },
        process.env.SECRETKEY,
        { expiresIn: "365d" }
      );

      const resdata = {
        token,
        role: user.Role?.name || "Unknown",
      };

      return Base.sendResponse(res, HTTPS.OK, resdata);
    } catch (error) {
      console.error("Error in login:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  };

  getUser = async (req, res) => {
    try {
      const result = await Users.findOne({
        include: [{ model: Country_Code }],
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
        // gender_id: result?.gender_id,
        gender_id: {
          value: result?.gender_id,
          name: "gender_id",
          label: result?.Gender?.name,
        },
        country_code_id: {
          value: result?.country_code_id,
          name: "country_code_id",
          label: result?.Country_Code?.country_code,
          no_length: result?.Country_Code?.no_length,
        },
      };

      return Base.sendResponse(res, HTTPS.OK, result);
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
        name: req?.body?.first_name?.trim(),
        last_name: req?.body?.last_name?.trim(),
        contact_no: req?.body?.contact_no,
        email: req?.body?.email,
        role_id: IDS.RoleId.Customer,
        country_code_id: req?.body?.country_code_id,
      };
      if (req.files && req.files?.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/user"
        );
      }
      if (req.body.alternate_no) {
        data.alternate_no = req.body.alternate_no;
      }
      // Check if the contact number already exists
      const contactExits = await CheckExits(
        Users,
        { contact_no: data?.contact_no },
        t
      );
      if (contactExits?.id != user_id && contactExits !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Contact No already exists"
        );
      }

      // Check if the email already exists
      const emailExits = await CheckExits(Users, { email: data?.email }, t);
      if (emailExits?.id != user_id && emailExits !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Email ID already exists"
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
          "You cannot delete your account while orders are in progress. Please complete all orders first."
        );
      }

      // Generate OTP and send it
      const otp = await customOtpGen({ length: 4, chars: "0123456789" });
      await mobileotp({ mobile: user.contact_no, otp });

      return Base.sendResponse(
        res,
        HTTPS.OK,
        otp,
        "Enter the OTP to verify delete account"
      );
    } catch (error) {
      console.error("Error in deleteAccount:", error);
      return Base.sendError(
        res,
        HTTPS.INTERNAL_SERVER_ERROR,
        "An error occurred while processing the request."
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

          "Account deleted successfully."
        );
      } else {
        return Base.sendError(res, HTTPS.BAD_REQUEST, "Invalid OTP.");
      }
    } catch (error) {
      console.error("Error in verifyDeleteAccount:", error);
      return Base.sendError(
        res,
        HTTPS.INTERNAL_SERVER_ERROR,
        "An error occurred while deleting the account."
      );
    }
  };
}

module.exports = new UserController();
