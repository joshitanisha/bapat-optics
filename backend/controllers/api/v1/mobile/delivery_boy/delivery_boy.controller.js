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
const { Users, Delivery_Boy_Detail, Store_Payment_Method, Store_Product_Category, Wallet, Product, Vendor_Restaurant_Service, Restaurant_Service,
  s_category, Pincode, City, State, Country, S_P_Sub_Category, Approval_Status, sequelize } = require("../../../../../models/index");
const { Op, where } = require("sequelize");
const IDS = require("../../../../../helper/fix_ids")

class DeliveryBoyController {
  // Create a new country
  async Register(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        name: req?.body?.name,
        email: req?.body?.email,
        contact_no: req?.body?.contact_no,
        gender_id: req?.body?.gender_id,
        role_id: IDS.RoleId.DeliveryBoy,
        status: false,
      };

      // Hash the password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      data.password = hashedPassword;

      // Handle image upload
      if (req.files && req.files?.image) {
        data.image = await File_Uploade(req.files?.image, "/uploads/masters/user"); // Corrected to 'File_Upload'
      }

      // Check if the contact number already exists
      const contactExits = await CheckExits(Users, { contact_no: data?.contact_no }, t);
      if (contactExits) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Contact No already exists");
      }

      // Check if the email already exists
      const emailExits = await CheckExits(Users, { email: data?.email }, t);
      if (emailExits) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Email ID already exists");
      }

      // Create the new user
      const newUser = await CreateNew(Users, data, t);

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

      // Create the store details
      const newDetails = await CreateNew(Delivery_Boy_Detail, dataToDetails, t);

      await CreateNew(Wallet, dataToDetails, t);

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

  async getAllDeliveryBoy(req, res) {
    try {

      // const storeCategory = req?.query?.s_category_id || "";
      // const city_id = req?.query?.city_id || "";
      // const p_category_id = req?.query?.p_category_id || "";
      // const p_sub_category_id = req?.query?.p_sub_category_id || "";
      // const service_id = req?.query?.service_id || "";

      const data = await Users.findAll({
        include: [
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
              }
            ],
            where: { approval_status_id: IDS.ApprovalStatus.Approved }
          },
        ],
        where: { role_id: IDS.RoleId.DeliveryBoy }
      });

      return Base.sendResponse(res, HTTPS.FOUND, data);
    } catch (error) {
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async getDeliveryBoy(req, res) {
    try {
      const data = await Users.findOne({
        include: [
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
              }
            ],
          },
        ],
        where: { id: req?.params?.id }
      });

      return Base.sendResponse(res, HTTPS.FOUND, data);
    } catch (error) {
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }


}

module.exports = new DeliveryBoyController();
