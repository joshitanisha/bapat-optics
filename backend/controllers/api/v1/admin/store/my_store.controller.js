const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
} = require("../../../../../helper/common");
const Base = require("../../../../../helper/exception-handling");
const { HTTPS } = require("../../../../../helper/https-status-codes");
const {
  Users,
  Store_Detail,
  Store_Payment_Method,
  Store_Product_Category,
  S_P_Sub_Category,
  s_category,
  Roles,
  Wallet,
  Gender,
  Store_Brand,
  Brand,
  State,
  Country,
  City,
  Pincode,
  sequelize,
  p_category,
  p_sub_category,
  Payment_Type,
  Vendor_Restaurant_Service,
  Restaurant_Service,
  Restaurant_Category,
  Store_Social_Media,
  Social_Link,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");
const IDS = require("../../../../../helper/fix_ids");
const bcrypt = require("bcrypt");
class MyStore {
  // Fetch a single country by ID
  async findOne(req, res) {
    // if (req.user.user_id === IDS.RoleId.Admin) {
    //     return false
    // }
    const t = await sequelize.transaction();
    try {
      const include = [
        {
          model: Gender,
        },
        {
          model: Store_Detail,
          include: [
            {
              model: s_category,
            },
            {
              model: Restaurant_Category,
            },
            {
              model: Store_Product_Category,
              include: [
                {
                  model: p_category,
                },
              ],
            },
           
            {
              model: Store_Payment_Method,
              include: [
                {
                  model: Payment_Type,
                },
              ],
            },
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
            {
              model: Vendor_Restaurant_Service,
              include: [
                {
                  model: Restaurant_Service,
                },
              ],
            },
            {
              model: Store_Brand,
              include: [
                {
                  model: Brand,
                },
              ],
            },
            {
              model: Store_Social_Media,
              include: [
                {
                  model: Social_Link,
                },
              ],
            },
          ],
        },
      ];

      const result = await CheckExits(
        Users,
        { id: req.user.user_id },
        t,
        include
      );

      let p_category_id = [];

      for (const item of result?.Store_Detail?.Store_Product_Categories) {
        p_category_id.push({
          value: item?.p_category_id,
          name: "p_category_id",
          label: item?.p_category?.name,
        });
      }

      let p_sub_category_id = [];

      for (const item of result?.Store_Detail?.S_P_Sub_Categories) {
        p_sub_category_id.push({
          value: item?.p_sub_category_id,
          name: "p_sub_category_id",
          label: item?.p_sub_category?.name,
          p_category_id: item?.Store_Product_Category?.p_category_id,
        });
      }

      let payment_type_id = [];
      for (const item of result?.Store_Detail?.Store_Payment_Methods) {
        payment_type_id.push({
          value: item?.payment_type_id,
          name: "payment_type_id",
          label: item?.Payment_Type?.name,
        });
      }

      let service_id = [];
      for (const item of result?.Store_Detail?.Vendor_Restaurant_Services) {
        service_id.push({
          value: item?.service_id,
          name: "service_id",
          label: item?.Restaurant_Service?.name,
        });
      }

      let brand_id = [];

      for (const item of result?.Store_Detail?.Store_Brands) {
        brand_id.push({
          value: item?.brand_id,
          name: "brand_id",
          label: item?.Brand?.name,
        });
      }

      let social_medias = [];

      for (const item of result?.Store_Detail?.Store_Social_Media) {
        social_medias.push({
          social_link_id: {
            value: item?.social_link_id,
            name: "social_link_id",
            label: item?.Social_Link?.name,
          },
          url: item?.url,
        });
      }

      const data = {
        store_id: result?.Store_Detail?.id,
        user_id: req.user.user_id,
        s_category_id: result?.Store_Detail?.s_category_id,
        name: result?.name,
        email: result?.email,
        contact_no: result?.contact_no,
        image: result?.image,
        banner_image: result?.Store_Detail?.banner_image,
        store_name: result?.Store_Detail?.store_name,
        legal_name: result?.Store_Detail?.legal_name,
        website: result?.Store_Detail?.website,
        lat: result?.Store_Detail?.lat,
        long: result?.Store_Detail?.long,
        area: result?.Store_Detail?.area,
        open_time: result?.Store_Detail?.open_time,
        close_time: result?.Store_Detail?.close_time,
        processing_time: result?.Store_Detail?.processing_time,
        delivery_range: result?.Store_Detail?.delivery_range,
        delivery_time: result?.Store_Detail?.delivery_time,
        address: result?.Store_Detail?.address,
        commission: result?.Store_Detail?.commission,
        tax_no: result?.Store_Detail?.tax_no,
        minimum_order_value: result?.Store_Detail?.minimum_order_value,
        qr_code: result?.Store_Detail?.qr_code,
        is_restaurant_flow:
          result?.Store_Detail?.s_category?.is_restaurant_flow,

        createdAt: result?.Store_Detail?.createdAt,
        gender_id: {
          value: result?.gender_id,
          name: "gender_id",
          label: result?.Gender?.name,
        },
        country_id: {
          value: result?.Store_Detail?.country_id,
          name: "country_id",
          label: result?.Store_Detail?.Country?.name,
        },
        state_id: {
          value: result?.Store_Detail?.state_id,
          name: "state_id",
          label: result?.Store_Detail?.State?.name,
        },
        city_id: {
          value: result?.Store_Detail?.city_id,
          name: "city_id",
          label: result?.Store_Detail?.City?.name,
        },
        pincode_id: {
          value: result?.Store_Detail?.pincode_id,
          name: "pincode_id",
          label: result?.Store_Detail?.Pincode?.name,
        },
        s_category_id: {
          value: result?.Store_Detail?.s_category_id,
          name: "s_category_id",
          label: result?.Store_Detail?.s_category?.name,
        },
        restaurant_category_id: {
          value: result?.Store_Detail?.restaurant_category_id,
          name: "restaurant_category_id",
          label: result?.Store_Detail?.Restaurant_Category?.name,
        },
        p_category_id: p_category_id,
        p_sub_category_id: p_sub_category_id,
        payment_type_id: payment_type_id,
        service_id: service_id,
        brand_id: brand_id,
        social_medias: social_medias,
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
      };

      if (req.body.password) {
        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        data.password = hashedPassword;
      }

      // Handle image upload
      if (req.files && req.files?.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/user"
        );
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

      // Prepare data for the store
      const dataToStore = {
        store_name: req?.body?.store_name,
        legal_name: req?.body?.legal_name,
        website: req?.body?.website,
        image: data?.image,
        lat: req?.body?.lat,
        long: req?.body?.long,
        country_id:
          req?.body?.country_id != "null" ? req?.body?.country_id : null,
        state_id: req?.body?.state_id != "null" ? req?.body?.state_id : null,
        city_id: req?.body?.city_id != "null" ? req?.body?.city_id : null,
        pincode_id:
          req?.body?.pincode_id != "null" ? req?.body?.pincode_id : null,
        restaurant_category_id: req?.body?.restaurant_category_id,

        area: req?.body?.area,
        address: req?.body?.address,
        open_time: req?.body?.open_time,
        close_time: req?.body?.close_time,
        processing_time: req?.body?.processing_time,
        delivery_time: req?.body?.delivery_time,
        commission: req?.body?.commission,
        tax_no: req?.body?.tax_no,
        minimum_order_value: req?.body?.minimum_order_value,
      };

      // Handle image upload
      if (req.files && req.files?.banner_image) {
        dataToStore.banner_image = await File_Uploade(
          req.files?.banner_image,
          "/uploads/masters/banner_image"
        );
      }

      // Create the store details
      await UpdateData(Store_Detail, dataToStore, { user_id: user_id }, t);
      const store_detail = await CheckExits(
        Store_Detail,
        { user_id: user_id },
        t
      );

      if (req?.body?.p_category_id) {
        const pCategoryIds = Array.isArray(req.body.p_category_id)
          ? req.body.p_category_id
          : [req.body.p_category_id];

        const categories = await CheckExits(
          Store_Product_Category,
          { store_detail_id: store_detail?.id },
          t
        );

        if (categories) {
          await Store_Product_Category.destroy({
            where: { store_detail_id: store_detail?.id },
            transaction: t,
          });
        }

        for (const item of pCategoryIds) {
          await CreateNew(
            Store_Product_Category,
            { store_detail_id: store_detail?.id, p_category_id: item },
            t
          );
        }
      }

      if (req?.body?.p_sub_category_id) {
        const p_sub_category_id = JSON.parse(req.body.p_sub_category_id);
        if (Array.isArray(p_sub_category_id)) {
          await S_P_Sub_Category.destroy({
            where: { store_detail_id: store_detail?.id },
            transaction: t,
          });

          for (const subCategory of p_sub_category_id) {
            const sProductCategory = await CheckExits(
              Store_Product_Category,
              {
                store_detail_id: store_detail?.id,
                p_category_id: subCategory?.p_category_id,
              },
              t
            );

            await CreateNew(
              S_P_Sub_Category,
              {
                store_detail_id: store_detail?.id,
                p_sub_category_id: subCategory?.value,
                s_p_category_id: sProductCategory?.id,
              },
              t
            );
          }
        }
      }

      if (req?.body?.payment_type_id) {
        const paymentTypeIds = Array.isArray(req.body.payment_type_id)
          ? req.body.payment_type_id
          : [req.body.payment_type_id];

        const paymentTypes = await CheckExits(
          Store_Payment_Method,
          { store_detail_id: store_detail?.id },
          t
        );

        if (paymentTypes) {
          await Store_Payment_Method.destroy({
            where: { store_detail_id: store_detail?.id },
            transaction: t,
          });
        }

        for (const item of paymentTypeIds) {
          await CreateNew(
            Store_Payment_Method,
            { store_detail_id: store_detail?.id, payment_type_id: item },
            t
          );
        }
      }

      if (req?.body?.service_id) {
        const serviceIds = Array.isArray(req.body.service_id)
          ? req.body.service_id
          : [req.body.service_id];

        const service = await CheckExits(
          Vendor_Restaurant_Service,
          { store_id: store_detail?.id },
          t
        );

        if (service) {
          await Vendor_Restaurant_Service.destroy({
            where: { store_id: store_detail?.id },
            transaction: t,
          });
        }

        for (const item of serviceIds) {
          await CreateNew(
            Vendor_Restaurant_Service,
            { store_id: store_detail?.id, service_id: item },
            t
          );
        }
      }

      if (req?.body?.brand_id) {
        const brandId = Array.isArray(req.body.brand_id)
          ? req.body.brand_id
          : [req.body.brand_id];

        const brands = await CheckExits(
          Store_Brand,
          { store_id: store_detail?.id },
          t
        );

        if (brands) {
          await Store_Brand.destroy({
            where: { store_id: store_detail?.id },
            transaction: t,
          });
        }

        for (const item of brandId) {
          await CreateNew(
            Store_Brand,
            { store_id: store_detail?.id, brand_id: item },
            t
          );
        }
      }

      if (req?.body?.social_medias) {
        const social_medias = JSON.parse(req.body.social_medias);
        if (Array.isArray(social_medias)) {
          await Store_Social_Media.destroy({
            where: { store_id: store_detail?.id },
            transaction: t,
          });
          for (const media of social_medias) {
            await CreateNew(
              Store_Social_Media,
              {
                store_id: store_detail?.id,
                social_link_id: media?.social_link_id,
                url: media?.url,
              },
              t
            );
          }
        }
      }

      await t.commit();

      // Send the response
      return Base.sendResponse(res, HTTPS.ACCEPTED, newUser);
    } catch (error) {
      await t.rollback();
      console.error("Error Updating Details:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async getYourCategories(req, res) {
    const t = await sequelize.transaction();
    try {
      // const country = await Paginate(p_category, { user_id: req.user.user_id }, t);
      const categories = await p_category.findAll({
        where: { user_id: req.user.user_id },
        transaction: t,
      });
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, categories);
    } catch (error) {
      await t.rollback();
      console.error("Error getting Category", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async getYourSubCategories(req, res) {
    try {
      // const country = await Paginate(p_category, { user_id: req.user.user_id }, t);
      const categories = await p_sub_category.findAll({
        include: [{ model: p_category }],
        where: { user_id: req.user.user_id },
      });

      return Base.sendResponse(res, HTTPS.OK, categories);
    } catch (error) {
      console.error("Error getting Category", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async updatePassword(req, res) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await Users.update(
        {
          password: hashedPassword,
        },
        {
          where: {
            id: req?.user?.user_id,
          },
        }
      );
      if (user[0] === 0) {
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found");
      }

      return Base.sendResponse(res, HTTPS.OK, {
        message: "Password updated successfully",
      });
    } catch (error) {
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async setDeliveryRange(req, res) {
    const t = await sequelize.transaction();
    try {
      const store = await CheckExits(
        Store_Detail,
        { id: req.user.store_id },
        t
      );

      if (!store) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "store not found");
      }

      const delivery_range = req?.body?.delivery_range;

      const update = await UpdateData(
        Store_Detail,
        { delivery_range: parseFloat(delivery_range) },
        { id: req.user.store_id },
        t
      );
      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, update);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching State:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new MyStore();
