const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
} = require("../../../../../helper/common/utils/dbUtils");
const Base = require("../../../../../helper/exception_handling");
const {
  HTTPS,
} = require("../../../../../helper/https-status-codes/https-status-codes");
const {
  Coating,
  p_category,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
class CoatingController {
  // Fetch all Coating
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const options = {
      
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
        },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Coating, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Coating:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single Coating by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const include = [
       
      ];
      const result = await CheckExits(
        Coating,
        { id: req.params.id },
        t,
        include
      );

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Coating not found");
      }

      const data = {
        name: result?.name,
        image: result?.image,
        website_image: result?.website_image,

        // category_id: {
        //   value: result?.category_id,
        //   name: "category_id",
        //   label: result?.p_category?.name,
        // },
      };

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Coating:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new Coating
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        name: req.body?.name?.trim(),
        // category_id: req.body?.category_id,
        // image: await File_Uploade(
        //   req.files?.image,
        //   "/uploads/masters/material"
        // ),
      };
      const exists = await CheckExits(Coating, { name: data?.name }, t);

      if (exists) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Coating already exists"
        );
      }

      const newItem = await CreateNew(Coating, data, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newItem);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Coating:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a Coating by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        name: req.body?.name?.trim(),
        // category_id: req.body?.category_id,
      };

      // if (req.files && req.files.image) {
      //   data.image = await File_Uploade(
      //     req.files?.image,
      //     "/uploads/masters/material"
      //   );
      // }

      const exists = await CheckExits(Coating, { name: data?.name }, t);

      if (exists?.id != id && exists !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Coating name already in use"
        );
      }

      const update = await UpdateData(Coating, data, { id: id }, t);

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Coating updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Coating:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete Coating by id
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Coating, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Coating not found");
      }

      await Coating.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "Coating Deleted Successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Coating:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Coating, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Coating,
        { status: result.status ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Coating status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Coating status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new CoatingController();
