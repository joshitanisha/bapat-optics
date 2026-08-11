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
  Users,
  User_Address,
  Address_Type,
  Country_Code,
  Users_Address_Details,
  Country,
  State,
  City,
  Pincode,
  Area,
  Roles,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");

class UserAddressController {
  async findAll(req, res) {
    try {
      const addresses = await User_Address.findAll({
        include: [
          {
            model: Address_Type,
          },
          {
            model: Country_Code,
          },
          {
            model: Users_Address_Details,
            include: [
              { model: Country },
              { model: State },
              { model: City },
              { model: Pincode },

              { model: Area },
            ],
          },
        ],
        where: { user_id: req.user.user_id },
      });

      return Base.sendResponse(res, HTTPS.OK, addresses);
    } catch (error) {
      console.error("Error fetching Address:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const include = [
        {
          model: Address_Type,
        },
        {
          model: Country_Code,
        },
        {
          model: Users_Address_Details,
          include: [
            { model: Country },
            { model: State },
            { model: City },
            { model: Pincode },

            { model: Area },
          ],
        },
      ];
      const result = await CheckExits(
        User_Address,
        { id: req.params.id },
        t,
        include
      );

      const data = {
        name: result?.first_name,
        address_type_id: result?.address_type_id,
        contact_no: result?.contact_no,
        street: result?.street,
        building: result?.building,
        apartment: result?.apartment,
        street: result?.street,
        direction: result?.direction,
        floor: result?.floor,
        area: result?.area,
        country_id: {
          name: "country_id",
          label: result?.Users_Address_Detail?.Country?.name,
          value: result?.Users_Address_Detail?.Country?.id,
        },
        state_id: {
          name: "state_id",
          label: result?.Users_Address_Detail?.State?.name,
          value: result?.Users_Address_Detail?.State?.id,
        },
        city_id: {
          name: "city_id",
          label: result?.Users_Address_Detail?.City?.name,
          value: result?.Users_Address_Detail?.City?.id,
        },
        pincode_id: {
          name: "pincode_id",
          label: result?.Users_Address_Detail?.Pincode?.name,
          value: result?.Users_Address_Detail?.Pincode?.id,
        },
      };

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Address not found");
      }
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Address:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new country
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const {
        building,
        floor,
        apartment,
        street,
        direction,
        contact_no,
        lat,
        long,
        address_type_id,
        area,
        // country_code_id,
        country_id,
        city_id,
        pincode_id,
        state_id,
        area_id,
      } = req.body;

      const user_id = req.user.user_id;

      const addressData = {
        user_id,
        building,
        floor,
        apartment,
        street,
        direction,
        contact_no,
        lat,
        long,
        address_type_id,
        area,
        // country_code_id,
      };

      const newAddress = await CreateNew(User_Address, addressData, t);

      await CreateNew(
        Users_Address_Details,
        {
          user_address_id: newAddress.id,
          city_id,
          pincode_id,
          // area_id,
          state_id,
          country_id,
        },
        t
      );

      await t.commit();
      return Base.sendResponse(res, HTTPS.CREATED, newAddress);
    } catch (error) {
      await t.rollback();
      console.error("Error creating/updating address:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a country by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const {
        city_id,
        pincode_id,
        area_id,
        state_id,
        country_id,
        area,
        address_type_id,
      } = req.body;
      const data = {
        // first_name: req?.body?.first_name,
        // last_name: req?.body?.last_name,
        building: req?.body?.building,
        floor: req?.body?.floor,
        apartment: req?.body?.apartment,
        street: req?.body?.street,
        direction: req?.body?.direction,
        contact_no: req?.body?.contact_no,
        area,
        address_type_id,
        // lat: req?.body?.lat,
        // long: req?.body?.long,
        // address_type_id: req?.body?.address_type_id,
        // country_code_id: req?.body?.country_code_id,s
      };

      const update = await UpdateData(User_Address, data, { id: id }, t);

      const exitsUser = await CheckExits(
        Users_Address_Details,
        {
          user_address_id: id,
        },
        t
      );

      if (exitsUser) {
        await UpdateData(
          Users_Address_Details,
          {
            user_address_id: id,
            city_id,
            pincode_id,
            // area_id,
            state_id,
            country_id,
          },
          { user_address_id: id },
          t
        );
      } else {
        await CreateNew(
          Users_Address_Details,
          {
            user_address_id: id,
            city_id,
            pincode_id,
            area_id,
            state_id,
            country_id,
          },
          t
        );
      }

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Address updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Address:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a country by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(User_Address, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Address not found");
      }

      await User_Address.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "Address Deleted Successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Address:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(User_Address, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        User_Address,
        { status: result.status ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Address status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Address status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new UserAddressController();
