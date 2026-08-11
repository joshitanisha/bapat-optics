const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Base = require("../../../../../helper/exception_handling");
const {
  HTTPS,
} = require("../../../../../helper/https-status-codes/https-status-codes");
const {
  Users,
  Logs,
  Roles,
  Roles_Permissions,
  Store_Detail,
  Permissions,
  Delivery_Boy_Detail,
  VerifyOtp,
  Bank_Detail,
  Wallet,
  Kyc_Document,
  sequelize,
} = require("../../../../../models/index");
const IDS = require("../../../../../helper/fix_ids");
const {
  VerifyAnyOtp,
  CheckExits,
  UpdateData,
  CreateNew,
  File_Uploade,
} = require("../../../../../helper/common/utils/dbUtils");
const { customOtpGen } = require("otp-gen-agent");
const { mobileotp, otpmail } = require("../../../../../helper/NodeMailer");
const {
  ApprovalStatus,
} = require("../../admin/delivery_boy/delivery_boy.controller");

class AuthController {
  async Login(req, res) {
    const t = await sequelize.transaction(); // Assuming you're using transactions
    try {
      const { contact_no, email, password } = req.body;

      if (!email && !contact_no) {
        return Base.sendError(
          res,
          HTTPS.BAD_REQUEST,
          "Email or contact_no are required."
        );
      }

      // Build dynamic where condition
      const whereCondition = {
        role_id: IDS.RoleId.DeliveryBoy,
        status: true,

      };

      if (email) {
        whereCondition.email = email.trim();
      } else if (contact_no) {
        whereCondition.contact_no = contact_no.trim();
      }

      const user = await Users.findOne({
        include: [
          { model: Roles },
          {
            model: Delivery_Boy_Detail,
            where: { approval_status_id: IDS.ApprovalStatus.Approved },
          },
        ],
        where: whereCondition,
      });

      if (!user) {
        return Base.sendError(res, HTTPS.NOT_FOUND, "User Not Found.");
      }

      const isMatch = await bcrypt.compare(password.trim(), user.password);
      if (!isMatch) {
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Incorrect password.");
      }

      const details = {
        user_id: user.id,
        lat: req.body?.lat,
        long: req.body?.long,
        area: req.body?.area,
        address: req.body?.address,
      };

      const existingDetail = await Delivery_Boy_Detail.findOne({
        where: { user_id: user.id },
        transaction: t,
      });

      if (existingDetail) {
        await UpdateData(Delivery_Boy_Detail, details, { user_id: user.id }, t);
      } else {
        await Delivery_Boy_Detail.create(
          { user_id: user.id, ...details },
          { transaction: t }
        );
      }

      await UpdateData(
        Users,
        { device_key: req.body.device_key },
        { id: user.id },
        t
      );

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

      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, {
        token,
        role: user.Role?.name || "Unknown",
      });
    } catch (error) {
      await t.rollback();
      console.error("Error in logindelivery:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  SignUpUser = async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const data = {
        name: req?.body?.name?.trim(),

        contact_no: req?.body?.contact_no,
        email: req?.body?.email,
        role_id: IDS.RoleId.DeliveryBoy,
        country_code_id: req?.body?.country_code_id,
        // refer_code: refer_code_generate,
        password: await bcrypt.hash(req.body.password, 10),
        status: false,
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

      const usercreate = await CreateNew(Users, data, t);

      const wallet = await CreateNew(
        Wallet,
        { user_id: usercreate.id, amount: 0 },
        t
      );

      const Delivery_boy = await CreateNew(
        Delivery_Boy_Detail,
        {
          user_id: usercreate.id,
          approval_status_id: IDS.ApprovalStatus.Pending,
        },
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
      // const newCreatednotification = await CreateNew(Notification, {
      //   user_id: usercreate.id,
      //   message: "Congrats! You’ve unlocked a discount on your first order.",
      // });

      // await AdminNotifications(usercreate?.device_key, newCreatednotification);

      // await mailNewUser(usercreate, appsetup?.email);

      return Base.sendResponse(res, HTTPS.OK, usercreate);
    } catch (error) {
      console.error("Error in create user:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  };

  async verifyLoginContact(req, res) {
    try {
      let result;
      const { contact_no } = req.body;
      if (contact_no) {
        result = await VerifyAnyOtp(VerifyOtp, req, res, IDS.ContactType.Phone);
      }

      if (!result) {
        return Base.sendError(res, HTTPS.INVALIDOTP);
      }

      const whereCondition = {
        role_id: IDS.RoleId.DeliveryBoy,
        status: true,
      };

      if (contact_no) {
        whereCondition.contact_no = contact_no.trim();
      }

      const user = await Users.findOne({
        include: [{ model: Roles }],
        where: whereCondition,
      });

      if (!user) {
        return Base.sendError(
          res,
          HTTPS.NOT_FOUND_USER,
          "Your account is deactivated. Please contact support for assistance"
        );
      }

      const details = {
        user_id: user.id,
        lat: req.body?.lat,
        long: req.body?.long,
        area: req.body?.area,
        address: req.body?.address,
      };

      const devicekey = {
        device_key: req.body.device_key,
      };

      const existingDetail = await Delivery_Boy_Detail.findOne({
        where: { user_id: user.id },
        // transaction: t,
      });

      if (existingDetail) {
        await UpdateData(
          Delivery_Boy_Detail,
          details,
          { user_id: user.id }
          //  t
        );
        await UpdateData(
          Users,
          devicekey,
          { id: user.id }
          //  t
        );
      } else {
        await Delivery_Boy_Detail.create(
          { user_id: user.id, ...details }
          // { transaction: t }
        );
        await UpdateData(
          Users,
          devicekey,
          { id: user.id }
          //  t
        );
      }

      // Generate JWT token
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

      const data = {
        token,
        role: user.Role?.name || "Unknown",
      };

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error(error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyLoginEmail(req, res) {
    try {
      let result;
      const { contact_no, email } = req.body;

      if (email) {
        result = await VerifyAnyOtp(VerifyOtp, req, res, IDS.ContactType.Email);
      }

      if (!result) {
        return Base.sendError(res, HTTPS.INVALIDOTP);
      }

      const whereCondition = {
        role_id: IDS.RoleId.DeliveryBoy,
        status: true,
      };

      if (email) {
        whereCondition.email = email.trim();
      }

      const user = await Users.findOne({
        include: [{ model: Roles }],
        where: whereCondition,
      });

      if (!user) {
        return Base.sendError(
          res,
          HTTPS.NOT_FOUND_USER,
          "Your account is deactivated. Please contact support for assistance"
        );
      }
      const details = {
        user_id: user.id,
        lat: req.body?.lat,
        long: req.body?.long,
        area: req.body?.area,
        address: req.body?.address,
      };

      const existingDetail = await Delivery_Boy_Detail.findOne({
        where: { user_id: user.id },
        // transaction: t,
      });

      const devicekey = {
        device_key: req.body.device_key,
      };

      if (existingDetail) {
        await UpdateData(
          Delivery_Boy_Detail,
          details,
          { user_id: user.id }
          // t
        );
        await UpdateData(
          Users,
          devicekey,
          { id: user.id }
          //  t
        );
      } else {
        await Delivery_Boy_Detail.create(
          { user_id: user.id, ...details }
          // { transaction: t }
        );
        await UpdateData(
          Users,
          devicekey,
          { id: user.id }
          //  t
        );
      }

      // Generate JWT token
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

      const data = {
        token,
        role: user.Role?.name || "Unknown",
      };

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error(error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  checkEmailExist = async (req, res) => {
    try {
      const data = await Users.findOne({
        include: [
          {
            model: Roles,
          },
        ],
        where: { email: req.body.email, role_id: IDS.RoleId.DeliveryBoy },
      });

      if (!data) {
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found.");
      }

      const data1 = await Users.findOne({
        include: [
          {
            model: Roles,
          },
        ],
        where: {
          email: req.body.email,
          role_id: IDS.RoleId.DeliveryBoy,
          status: true,
        },
      });

      if (!data1) {
        return Base.sendError(res, HTTPS.NOT_FOUND_USER, "User not found.");
      }

      const otp = await customOtpGen({ length: 6, chars: "0123456789" });

      await otpmail({ userEmail: req.body.email, otp: otp });

      return Base.sendResponse(
        res,
        HTTPS.OK,
        { otp: otp },
        "OTP Sent Successfully"
      );
    } catch (error) {
      console.error("Error in Vendor Details:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  };

  checkContactExist = async (req, res) => {
    try {
      const data = await Users.findOne({
        where: {
          contact_no: req.body.contact_no,
          role_id: IDS.RoleId.DeliveryBoy,
        },
      });

      if (!data) {
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found.");
      }

      const data1 = await Users.findOne({
        where: {
          contact_no: req.body.contact_no,
          role_id: IDS.RoleId.DeliveryBoy,
          status: true,
        },
      });

      if (!data1) {
        return Base.sendError(res, HTTPS.NOT_FOUND_USER, "User not found.");
      }
      const otp = await customOtpGen({ length: 6, chars: "0123456789" });
      await mobileotp({ mobile: req.body.contact_no, otp: otp, res });

      return Base.sendResponse(
        res,
        HTTPS.OK,
        { otp: otp },
        "OTP Sent Successfully"
      );
    } catch (error) {
      console.error("Error in Vendor Details:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  };

  UpdatePasswordWL = async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const data = await CheckExits(
        Users,
        { email: req.body.email, role_id: IDS.RoleId.DeliveryBoy },
        t
      );

      if (!data) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found.");
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      await UpdateData(
        Users,
        { password: hashedPassword },
        { email: req.body.email },
        t
      );

      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error in adminDetails:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  };

  async createOrupdateKYC(req, res) {
    const t = await sequelize.transaction();
    try {
      const user_id = req?.body?.id;

      const user = await CheckExits(Users, { id: user_id }, t);

      if (!user) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found");
      }

      const dataToDocuments = {
        aadhar_no: req?.body?.aadhar_no,
        driving_license_no: req?.body?.driving_license_no,
        pan_no: req?.body?.pan_no,
        is_verified: false,
        user_id: user_id,
      };

      console.log(req.files, "req.files req.files");

      if (req.files && req.files?.aadhar_image) {
        dataToDocuments.aadhar_image = await File_Uploade(
          req.files?.aadhar_image,
          "/uploads/user_documents"
        );
      }
      if (req.files && req.files?.aadhar_back_image) {
        dataToDocuments.aadhar_back_image = await File_Uploade(
          req.files?.aadhar_back_image,
          "/uploads/user_documents"
        );
      }

      if (req.files && req.files?.driving_license_image) {
        dataToDocuments.driving_license_image = await File_Uploade(
          req.files?.driving_license_image,
          "/uploads/user_documents"
        );
      }

      if (req.files && req.files?.driving_license_back_image) {
        dataToDocuments.driving_license_back_image = await File_Uploade(
          req.files?.driving_license_back_image,
          "/uploads/user_documents"
        );
      }

      if (req.files && req.files?.pan_image) {
        dataToDocuments.pan_image = await File_Uploade(
          req.files?.pan_image,
          "/uploads/user_documents"
        );
      }

      if (req.files && req.files?.pan_back_image) {
        dataToDocuments.pan_back_image = await File_Uploade(
          req.files?.pan_back_image,
          "/uploads/user_documents"
        );
      }

      const kyc_details = await CheckExits(
        Kyc_Document,
        { user_id: user_id },
        t
      );

      if (kyc_details) {
        UpdateData(Kyc_Document, dataToDocuments, { user_id: user_id }, t);
      } else {
        await CreateNew(Kyc_Document, dataToDocuments, t);
      }

      const dataToBankDetail = {
        user_id: user_id,
        account_no: req?.body?.account_no,
        bank_name: req?.body?.bank_name,
        // branch_name: req?.body?.branch_name,
        // bank_address: req?.body?.bank_address,
        ifsc: req?.body?.ifsc,
        // swift_code: req?.body?.swift_code,
        // national_clearing_code: req?.body?.national_clearing_code,
        approval_status_id: IDS.ApprovalStatus.Pending,
      };

      const bank_details = await CheckExits(
        Bank_Detail,
        { user_id: user_id },
        t
      );

      if (bank_details) {
        await UpdateData(
          Bank_Detail,
          dataToBankDetail,
          { user_id: user_id },
          t
        );
      } else {
        // Create the Bank details
        await CreateNew(Bank_Detail, dataToBankDetail, t);
      }

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Store KYC/Bank Details updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Category status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const include = [
        // {
        //   model: Gender,
        // },
        {
          model: Delivery_Boy_Detail,
          // include: [
          //   {
          //     model: Country,
          //   },
          //   {
          //     model: State,
          //   },
          //   {
          //     model: City,
          //   },
          //   {
          //     model: Pincode,
          //   },
          // ],
        },
        {
          model: Kyc_Document,
        },
        {
          model: Bank_Detail,
        },
      ];

      const result = await CheckExits(
        Users,
        { id: req.user.user_id },
        t,
        include
      );

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found");
      }

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Users:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const user_id = req.user.user_id;
      const data = {
        name: req?.body?.name,
        email: req?.body?.email,
        contact_no: req?.body?.contact_no,
      };

      if (req?.body?.password) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        data.password = hashedPassword;
      }

      if (req.files && req.files?.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/user"
        );
      }

      if (req?.body?.contact_no) {
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
      }

      if (req?.body?.email) {
        const emailExits = await CheckExits(Users, { email: data?.email }, t);
        if (emailExits?.id != user_id && emailExits !== null) {
          await t.rollback();
          return Base.sendError(
            res,
            HTTPS.NOT_ACCEPTABLE,
            "Email ID already exists"
          );
        }
      }

      const newUser = await UpdateData(Users, data, { id: user_id }, t);

      // const dataToDetails = {
      //   user_id: newUser?.id,
      //   image: data?.image,
      //   lat: req?.body?.lat,
      //   long: req?.body?.long,
      //   country_id: req?.body?.country_id,
      //   state_id: req?.body?.state_id,
      //   city_id: req?.body?.city_id,
      //   pincode_id: req?.body?.pincode_id,
      //   approval_status_id: IDS.ApprovalStatus.Pending,
      // };

      // await UpdateData(
      //   Delivery_Boy_Detail,
      //   dataToDetails,
      //   { user_id: user_id },
      //   t
      // );

      await t.commit();

      return Base.sendResponse(res, HTTPS.ACCEPTED, newUser, "Details Updated");
    } catch (error) {
      await t.rollback();
      console.error("Error Updating Details:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new AuthController();
