const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
} = require("../../../../../helper/common");
const bcrypt = require("bcryptjs");
const Base = require("../../../../../helper/exception-handling");
const { HTTPS } = require("../../../../../helper/https-status-codes");
const {
  Users,
  Wallet,
  Bank_Detail,
  Rating_Reviews,
  Delivery_Boy_Detail,
  Gender,
  Store_Detail,
  Vendors_Delivery_Boy,
  s_category,
  Pincode,
  City,
  State,
  Country,
  Kyc_Document,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
const IDS = require("../../../../../helper/fix_ids");
const {
  sendMail,
  DBRegistration,
} = require("../../../../../helper/NodeMailer");
const moment = require("moment");
const { transaction } = require("../wallet/wallet.controller");

class DleviryBoyController {
  // Create a new country
  async Register(req, res) {
    const t = await sequelize.transaction();

    try {
      const userId = req?.body?.id || "";

      const data = {
        name: req?.body?.name,
        email: req?.body?.email,
        contact_no: req?.body?.contact_no,
        role_id: IDS.RoleId.DeliveryBoy,
        // status: false,
      };

      // Hash the password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      data.password = hashedPassword;

      let newUser;

      // Handle image upload
      if (req.files && req.files?.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/user"
        ); // Corrected to 'File_Upload'
      }

      if (userId) {
        await UpdateData(Users, data, { id: userId }, t);
      } else {
        // Check if the contact number already exists
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

        // Create the new user
        newUser = await CreateNew(Users, data, t);
      }

      // Prepare data for the store
      const dataToDetails = {
        user_id: newUser?.id,
        image: data?.image,
        lat: req?.body?.lat,
        long: req?.body?.long,
        country_id: req?.body?.country_id,
        state_id: req?.body?.state_id,
        city_id: req?.body?.city_id,
        pincode_id: req?.body?.pincode_id,
        approval_status_id: IDS.ApprovalStatus.Pending,
      };

      let newDeliveryBoy;

      if (userId) {
        await UpdateData(
          Delivery_Boy_Detail,
          dataToDetails,
          { user_id: userId },
          t
        );
      } else {
        // Create the store details
        newDeliveryBoy = await CreateNew(Delivery_Boy_Detail, dataToDetails, t);
      }

      const dataToDocuments = {
        aadhar_no: req?.body?.aadhar_no,
        driving_license_no: req?.body?.driving_license_no,
        pan_no: req?.body?.pan_no,
        is_verified: false,
        user_id: newUser?.id,
        // aadhar_image: aadharImagePath,  // Store the path string here
        // driving_license_image: drivingLicenseImagePath,  // Store the path string here
        // pan_image: panImagePath,  // Store the path string here
      };

      if (req.files && req.files?.aadhar_image) {
        dataToDocuments.aadhar_image = await File_Uploade(
          req.files?.aadhar_image,
          "/uploads/user_documents"
        );
      }

      if (req.files && req.files?.driving_license_image) {
        dataToDocuments.driving_license_image = await File_Uploade(
          req.files?.driving_license_image,
          "/uploads/user_documents"
        );
      }

      if (req.files && req.files?.pan_image) {
        dataToDocuments.pan_image = await File_Uploade(
          req.files?.pan_image,
          "/uploads/user_documents"
        );
      }

      if (userId) {
        UpdateData(Kyc_Document, dataToDocuments, { user_id: userId }, t);
      } else {
        await CreateNew(Kyc_Document, dataToDocuments, t);
      }

      const dataToBankDetail = {
        user_id: newUser?.id,
        account_no: req?.body?.account_no,
        bank_name: req?.body?.bank_name,
        branch_name: req?.body?.branch_name,
        bank_address: req?.body?.bank_address,
        ifsc: req?.body?.ifsc,
        swift_code: data?.swift_code,
        national_clearing_code: req?.body?.national_clearing_code,
        approval_status_id: IDS.ApprovalStatus.Pending,
      };

      if (userId) {
        await UpdateData(Bank_Detail, dataToBankDetail, { user_id: userId }, t);
      } else {
        // Create the Bank details
        await CreateNew(Bank_Detail, dataToBankDetail, t);
      }

      if (!userId) {

        await CreateNew(Wallet, { user_id: newUser?.id }, t);
      }

      // const mailOptions = {
      //   from: "ankur.jain@profcyma.in",
      //   to: data?.email,
      //   subject: "Delivery Boy Registration Request",
      // };

      // mailOptions.html = `
      //   <b>Thank You for Showing Interest!</b>
      //   <p>We have received your request to become a Delivery Partner with the Moon.</p>
      //   <br>Please wait while your request is being reviewed and approved.
      //   <br>
      //   <h3>We Wish You All the Best!</h3>
      //   <br>
      //   <br>Thanks and Regards,
      //   <br>The Moon
      //   `;

      // await sendMail(mailOptions);

      await DBRegistration(data?.email);

      // Commit the transaction
      await t.commit();

      // Send the response
      return Base.sendResponse(res, HTTPS.CREATED, newUser);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Address:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const include = [
        {
          model: Gender,
        },
        {
          model: Delivery_Boy_Detail,
          include: [
            {
              model: Country,
            },
            {
              model: State,
            },
            {
              model: City,
            },
            {
              model: Pincode,
            },
          ],
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

      const data = {
        delivery_boy_detail_id: result?.Delivery_Boy_Detail?.id,
        user_id: req.user.user_id,
        name: result?.name,
        email: result?.email,
        contact_no: result?.contact_no,
        image: result?.image,
        lat: result?.Delivery_Boy_Detail?.lat,
        long: result?.Delivery_Boy_Detail?.long,
        createdAt: result?.Delivery_Boy_Detail?.createdAt,
        gender_id: {
          value: result?.gender_id,
          name: "gender_id",
          label: result?.Gender?.name,
        },
        country_id: {
          value: result?.Delivery_Boy_Detail?.country_id,
          name: "country_id",
          label: result?.Delivery_Boy_Detail?.Country?.name,
        },
        state_id: {
          value: result?.Delivery_Boy_Detail?.state_id,
          name: "state_id",
          label: result?.Delivery_Boy_Detail?.State?.name,
        },
        city_id: {
          value: result?.Delivery_Boy_Detail?.city_id,
          name: "city_id",
          label: result?.Delivery_Boy_Detail?.City?.name,
        },
        pincode_id: {
          value: result?.Delivery_Boy_Detail?.pincode_id,
          name: "pincode_id",
          label: result?.Delivery_Boy_Detail?.Pincode?.name,
        },
        Kyc_Document: result?.Kyc_Document,
        Bank_Detail: result?.Bank_Detail,
      };

      if (!data) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Store not found");
      }

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
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
        gender_id: req?.body?.gender_id,
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

      const dataToDetails = {
        user_id: newUser?.id,
        image: data?.image,
        lat: req?.body?.lat,
        long: req?.body?.long,
        country_id: req?.body?.country_id,
        state_id: req?.body?.state_id,
        city_id: req?.body?.city_id,
        pincode_id: req?.body?.pincode_id,
        approval_status_id: IDS.ApprovalStatus.Pending,
      };

      await UpdateData(
        Delivery_Boy_Detail,
        dataToDetails,
        { user_id: user_id },
        t
      );

      await t.commit();

      return Base.sendResponse(res, HTTPS.ACCEPTED, newUser, "Details Updated");
    } catch (error) {
      await t.rollback();
      console.error("Error Updating Details:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
  async vendorStore(req, res) {
    const t = await sequelize.transaction();
    try {
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const per_page = req.query.per_page ? parseInt(req.query.per_page) : 10;

      const user_id = req.user.user_id;
      const { count, rows: data } = await Vendors_Delivery_Boy.findAndCountAll({
        include: [
          {
            model: Store_Detail,
            include: [
              {
                model: Users,
              },
            ],
          },
        ],
        where: { delivery_boy_id: user_id },
        transaction: t,
      });

      const total_pages = Math.ceil(count / per_page);

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.OK,
        {
          data: data,
          current_page: page,
          total_pages: total_pages,
          per_page: per_page,
          total: count,
        },
        "All Stores"
      );
    } catch (error) {
      await t.rollback();

      console.error("Error getting Stores:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async createOrupdateKYC(req, res) {
    const t = await sequelize.transaction();
    try {
      const user_id = req?.user?.user_id;


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

      if (req.files && req.files?.aadhar_image) {
        dataToDocuments.aadhar_image = await File_Uploade(
          req.files?.aadhar_image,
          "/uploads/user_documents"
        );
      }

      if (req.files && req.files?.driving_license_image) {
        dataToDocuments.driving_license_image = await File_Uploade(
          req.files?.driving_license_image,
          "/uploads/user_documents"
        );
      }

      if (req.files && req.files?.pan_image) {
        dataToDocuments.pan_image = await File_Uploade(
          req.files?.pan_image,
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
        branch_name: req?.body?.branch_name,
        bank_address: req?.body?.bank_address,
        ifsc: req?.body?.ifsc,
        swift_code: req?.body?.swift_code,
        national_clearing_code: req?.body?.national_clearing_code,
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
}

module.exports = new DleviryBoyController();
