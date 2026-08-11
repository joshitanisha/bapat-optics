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
  Store_Detail,
  Store_Payment_Method,
  Store_Product_Category,
  Wallet,
  Product,
  Product_Variant,
  Vendor_Restaurant_Service,
  Restaurant_Service,
  Bank_Detail,
  Rating_Reviews,
  s_category,
  Pincode,
  City,
  State,
  Country,
  Offered_Product,
  S_P_Sub_Category,
  Discount_Type,
  Kyc_Document,
  p_category,
  Store_Brand,
  Brand,
  Subscription,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
const IDS = require("../../../../../helper/fix_ids");
const { status } = require("../cart/cart.controller");
const { sendMail } = require("../../../../../helper/NodeMailer");

class UserAddressController {
  // Create a new country
  async Register(req, res) {
    const t = await sequelize.transaction();

    try {
      const userId = req?.body?.id || "";

      const data = {
        name: req?.body?.name,
        email: req?.body?.email,
        contact_no: req?.body?.contact_no,
        role_id: IDS.RoleId.Vendor,
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

      // const drivingLicenseImagePath = await File_Uploade(req.files?.driving_license_image, "/uploads/user_documents");
      // const panImagePath = await File_Uploade(req.files?.pan_image, "/uploads/user_documents");

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

      if (req.files && req.files?.aadhar_image) {
        dataToDocuments.driving_license_image = await File_Uploade(
          req.files?.driving_license_image,
          "/uploads/user_documents"
        );
      }

      if (req.files && req.files?.aadhar_image) {
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

      // Prepare data for the store
      const dataToStore = {
        user_id: newUser?.id,
        s_category_id: req?.body?.s_category_id,
        restaurant_category_id: req?.body?.restaurant_category_id,
        store_name: req?.body?.store_name,
        legal_name: req?.body?.legal_name,
        website: req?.body?.website,
        image: data?.image,
        lat: req?.body?.lat,
        long: req?.body?.long,
        country_id: req?.body?.country_id,
        state_id: req?.body?.state_id,
        city_id: req?.body?.city_id,
        pincode_id: req?.body?.pincode_id,
        approval_status_id: IDS.ApprovalStatus.Pending,
      };

      let newStore;

      if (userId) {
        await UpdateData(Store_Detail, dataToStore, { user_id: userId }, t);
      } else {
        // Create the store details
        newStore = await CreateNew(Store_Detail, dataToStore, t);
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
        await CreateNew(Wallet, dataToStore, t);
      }

      const mailOptions = {
        from: "ankur.jain@profcyma.in",
        to: data?.email,
        subject: "Vendor Registration Request",
      };

      mailOptions.html = `
      <b>Thank You for Showing Interest!</b>
      <p>We have received your request to become a partner with the Moon.</p>
      <br>Please wait while your request is being reviewed and approved.
      <br>
      <h3>We Wish You All the Best!</h3>
      <br>
      <br>Thanks and Regards,
      <br>Ankur Jain
      <br>Backend Developer
      <br>Profcyma
      <br>
      <img src="https://profcyma.com/assets/images/logo/Profcyma-logotwo.png" alt="Profcyma Logo" style="width: 200px; height: 100px;">
  `;

      await sendMail(mailOptions);

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

  async getAllStore(req, res) {
    try {
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const per_page = req.query.per_page ? parseInt(req.query.per_page) : 10;
      const s_category_id = req?.query?.s_category_id || "";
      const restaurant_category_id = req?.query?.restaurant_category_id || "";
      const city_id = req?.query?.city_id || "";
      const p_category_id = req?.query?.p_category_id || "";
      const p_sub_category_id = req?.query?.p_sub_category_id || "";
      const service_id = req?.query?.service_id || "";
      const country_id = req?.query?.country_id || "";
      const country_name = req?.query?.country_name || "";
      const city_name = req?.query?.city_name || "";

      const { count, rows: data } = await Store_Detail.findAndCountAll({
        include: [
          {
            model: Users,
            include: [
              {
                model: Subscription,
                where: { status: true },
              },
            ],
          },
          {
            model: s_category,
          },
          {
            model: Country,
            where: {
              [Op.or]: [{ name: { [Op.like]: `%${country_name}%` } }],
            },
          },
          {
            model: City,
            where: {
              [Op.or]: [{ name: { [Op.like]: `%${city_name}%` } }],
            },
          },
          {
            model: Product,
            // required: false,
            where: {
              ...(p_category_id ? { p_category_id: p_category_id } : {}),
              ...(p_sub_category_id
                ? { p_sub_category_id: p_sub_category_id }
                : {}),
            },
          },
          {
            model: Store_Product_Category,
            include: [
              {
                model: p_category,
              },
            ],
          },
        ],
        where: {
          approval_status_id: IDS.ApprovalStatus.Approved,
          ...(s_category_id ? { s_category_id } : {}),
          ...(restaurant_category_id ? { restaurant_category_id } : {}),
          ...(city_id ? { city_id } : {}),
          ...(country_id ? { country_id } : {}),
          status: true,
        },
        offset: (page - 1) * per_page,
        limit: per_page,
        distinct: true,
      });

      const total_pages = Math.ceil(count / per_page);

      for (let item of data) {
        const ratings = await Rating_Reviews.findAll({
          include: [
            {
              model: Product,
              where: {
                store_id: item?.id,
              },
            },
          ],
        });

        const totalRatings = ratings.length;
        let sumRatings = 0;

        ratings.forEach((rating) => {
          sumRatings += rating.ratings;
        });
        const avgRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
        item.dataValues.avgRating = avgRating;
      }

      return Base.sendResponse(res, HTTPS.OK, {
        data: data,
        current_page: page,
        total_pages: total_pages,
        per_page: per_page,
        total: count,
      });
    } catch (error) {
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async getStore(req, res) {
    try {
      // Fetching store details with related models
      const data = await Store_Detail.findOne({
        include: [
          { model: Users },
          { model: s_category },
          { model: Country },
          { model: State },
          { model: City },
          { model: Pincode },
          {
            model: Vendor_Restaurant_Service,
            include: [{ model: Restaurant_Service }],
          },
          {
            model: Store_Product_Category,
            include: [{ model: p_category }],
          },
          {
            model: Store_Brand,
            include: [{ model: Brand }],
          },
        ],
        where: {
          approval_status_id: IDS.ApprovalStatus.Approved,
          id: req?.params?.id,
        },
      });

      // Fetch ratings for products in this store
      const ratings = await Rating_Reviews.findAll({
        include: [
          {
            model: Product,
            where: {
              store_id: req?.params?.id, // Filter by store_id
            },
          },
        ],
      });

      // Aggregate ratings
      const totalRatings = ratings.length;
      let sumRatings = 0;

      ratings.forEach((rating) => {
        sumRatings += Number(rating.ratings); // Ensure rating is treated as a number
      });

      const avgRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

      // Convert data to plain object and add avgRating
      const plainData = data.get({ plain: true });
      plainData.avgRating = avgRating;

      // Return the response with store details and avgRating
      return Base.sendResponse(res, HTTPS.OK, plainData);
    } catch (error) {
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async getAllOfferedProducts(req, res) {
    try {
      const name = req?.query?.name || "";
      const price_order = req?.query?.price_order || "ASC";

      const data = await Offered_Product.findAll({
        include: [
          {
            model: Discount_Type,
          },
          {
            model: Product,
            include: [
              {
                model: Product_Variant,
              },
            ],
            where: {
              [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
              status: true,
            },
          },
          {
            model: Store_Detail,
          },
        ],
        where: {
          store_id: req?.params?.id,
          status: true,
        },
        order: [[sequelize.col("Product.Product_Variants.price"), price_order]],
        distinct: true,
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error(error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new UserAddressController();
