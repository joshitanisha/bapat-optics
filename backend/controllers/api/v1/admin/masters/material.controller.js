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
  Material,
  p_category,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
class MaterialController {
  // Fetch all Material
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";

      const rawCategory = req.query.p_category;
      const categoryId =
        rawCategory && !isNaN(rawCategory) ? Number(rawCategory) : null;

      // Base options
      const options = {
        include: [
          {
            model: p_category,
          },
        ],
        where: {
          name: { [Op.like]: `%${name}%` },
        },
        order: [["createdAt", "DESC"]],
      };

      if (categoryId) {
        options.include = [
          {
            model: p_category,
            where: { id: categoryId },
            // required: true, // INNER JOIN
          },
        ];
      }

      await Paginate(Material, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Material:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single Material by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const include = [
        {
          model: p_category,
        },
      ];
      const result = await CheckExits(
        Material,
        { id: req.params.id },
        t,
        include,
      );

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Material not found");
      }

      const data = {
        name: result?.name,
        image: result?.image,
        website_image: result?.website_image,

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
      console.error("Error fetching Material:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new Material
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        name: req.body?.name?.trim(),
        category_id: req.body?.category_id,
        // image: await File_Uploade(
        //   req.files?.image,
        //   "/uploads/masters/material"
        // ),
      };
      const exists = await CheckExits(
        Material,
        { name: data?.name, category_id: req.body?.category_id },
        t,
      );

      if (exists) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Material already exists",
        );
      }

      const newItem = await CreateNew(Material, data, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newItem);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Material:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a Material by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        name: req.body?.name?.trim(),
        category_id: req.body?.category_id,
      };

      // if (req.files && req.files.image) {
      //   data.image = await File_Uploade(
      //     req.files?.image,
      //     "/uploads/masters/material"
      //   );
      // }

      const exists = await CheckExits(Material, { name: data?.name, category_id: req.body?.category_id, }, t);

      if (exists?.id != id && exists !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Material name already in use",
        );
      }

      const update = await UpdateData(Material, data, { id: id }, t);

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Material updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Material:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete Material by id
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Material, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Material not found");
      }

      await Material.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "Material Deleted Successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Material:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Material, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Material,
        { status: result.status ? false : true },
        { id },
        t,
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Material status updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Material status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new MaterialController();
