const Base = require("../../../../../helper/exception_handling");
const {
  HTTPS,
} = require("../../../../../helper/https-status-codes/https-status-codes");
const {
  Trending_Product,
  Product,
  Gender,
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
        include: [
          {
            model: Product,
            where: {
              [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
            },
          },
          {
            model: Gender,
          },
        ],
        // where: {
        //   [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
        // },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Trending_Product, options, req, res, Op);
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
          model: Product,
        },
        {
          model: Gender,
        },
      ];
      const result = await CheckExits(
        Trending_Product,
        { id: req.params.id },
        t,
        include
      );

      if (!result) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_FOUND,
          "Trending Product not found"
        );
      }

      const data = {
        name: result?.name,
        image: result?.image,

        product_id: {
          value: result?.product_id,
          name: "product_id",
          label: result?.Product?.name,
        },

        gender_id: {
          value: result?.gender_id,
          name: "gender_id",
          label: result?.Gender?.name,
        },
      };

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Trending Product:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new Data
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        // name: req.body?.name?.trim(),
        product_id: req.body?.product_id,
        gender_id: req.body?.gender_id,

        image: await File_Uploade(
          req.files?.image,
          "/uploads/masters/trending_product"
        ),
      };

      const esits = await CheckExits(
        Trending_Product,
        { product_id: data?.product_id, gender_id: data?.gender_id },
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

      const newItem = await CreateNew(Trending_Product, data, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newItem);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Trending Product:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a Data by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        gender_id: req.body?.gender_id,
        // name: req.body?.name?.trim(),
        product_id: req.body?.product_id,
      };

      if (req.files && req.files.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/trending_product"
        );
      }

      const exits = await CheckExits(
        Trending_Product,
        { product_id: data?.product_id, gender_id: data?.gender_id },
        t
      );

      if (exits?.id != id && exits !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Trending Product name already in use"
        );
      }

      const update = await UpdateData(Trending_Product, data, { id: id }, t);

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Trending Product updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Trending Product:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a Data by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the Data exists
      const result = await CheckExits(Trending_Product, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_FOUND,
          "Trending Product not found"
        );
      }

      await Trending_Product.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Trending Product Deleted Successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Trending Product:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a Data

  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Trending_Product, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Trending_Product,
        { status: result.status ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Trending Product status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Trending Product status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new HomeBannerController();
