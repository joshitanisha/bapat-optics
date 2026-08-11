const Base = require("../../../../../helper/exception_handling");
const {
  HTTPS,
} = require("../../../../../helper/https-status-codes/https-status-codes");
const {
  All_Banner,
  Banner_Type,
  p_category,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
} = require("../../../../../helper/common/utils/dbUtils");

class HomeBannerController {
  // Fetch all Data
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const options = {
        include: [{ model: Banner_Type }, { model: p_category }],
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
        },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(All_Banner, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching countries:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single Data by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const include = [
        {
          model: Banner_Type,
        },
        { model: p_category },
      ];
      const result = await CheckExits(
        All_Banner,
        { id: req.params.id },
        t,
        include
      );

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Home Banner not found");
      }

      const data = {
        name: result?.name,
        image: result?.image,
        website_image: result?.website_image,

        banner_type_id: {
          value: result?.banner_type_id,
          name: "banner_type_id",
          label: result?.Banner_Type?.name,
        },
        category_id: {
          value: result?.category_id,
          name: "category_id",
          label: result?.p_category?.name,
        },
      };

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Home Banner:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new Data
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        name: req.body?.name?.trim(),
        banner_type_id: req.body?.banner_type_id,

        image: await File_Uploade(
          req.files?.image,
          "/uploads/masters/all_banner"
        ),
      };

      if (req.body?.category_id) {
        data.category_id = req.body?.category_id;
      }

      const esits = await CheckExits(
        All_Banner,
        { banner_type_id: req.body?.banner_type_id },
        t
      );

      if (esits) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Banner already exists"
        );
      }

      const newItem = await CreateNew(All_Banner, data, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newItem);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Home Banner:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a Data by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        name: req.body?.name?.trim(),
        banner_type_id: req.body?.banner_type_id,
      };

      if (req.body?.category_id) {
        data.category_id = req.body?.category_id;
      }

      if (req.files && req.files.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/all_banner"
        );
      }

      const exits = await CheckExits(
        All_Banner,
        { banner_type_id: req.body?.banner_type_id },
        t
      );

      if (exits?.id != id && exits !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Home Banner name already in use"
        );
      }

      const update = await UpdateData(All_Banner, data, { id: id }, t);

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Home Banner updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Home Banner:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a Data by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the Data exists
      const result = await CheckExits(All_Banner, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Home Banner not found");
      }

      await All_Banner.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Home Banner Deleted Successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Home Banner:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a Data

  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(All_Banner, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        All_Banner,
        { status: result.status ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Home Banner status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Home Banner status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new HomeBannerController();
