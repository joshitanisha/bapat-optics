const Base = require("../../../../../helper/exception_handling");
const {
  HTTPS,
} = require("../../../../../helper/https-status-codes/https-status-codes");
const {
  Store_Banner,
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
        // include:[{model:p_category}],
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
        },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Store_Banner, options, req, res, Op);
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
          model: p_category,
        },
      ];
      const result = await CheckExits(Store_Banner, { id: req.params.id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Store Banner not found");
      }

      const data = {
        name: result?.name,
        image: result?.image,

        // category_id: {
        //     value: result?.category_id,
        //     name: "category_id",
        //     label: result?.p_category?.name,
        //   },
      };

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Store Banner:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new Data
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        name: req.body?.name?.trim(),
        status: 0,
        // category_id: req.body?.category_id,
        image: await File_Uploade(
          req.files?.image,
          "/uploads/masters/store_banner"
        ),
      };

      const esits = await CheckExits(Store_Banner, { name: data?.name }, t);

      if (esits) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Banner already exists"
        );
      }

      const newItem = await CreateNew(Store_Banner, data, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newItem);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Store Banner:", error);
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
        // category_id: req.body?.category_id,
      };

      if (req.files && req.files.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/store_banner"
        );
      }

      const exits = await CheckExits(Store_Banner, { name: data.name }, t);

      if (exits?.id != id && exits !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Store Banner name already in use"
        );
      }

      const update = await UpdateData(Store_Banner, data, { id: id }, t);

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Store Banner updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Store Banner:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a Data by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the Data exists
      const result = await CheckExits(Store_Banner, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Store Banner not found");
      }

      await Store_Banner.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Store Banner Deleted Successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Store Banner:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a Data

  async status(req, res) {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    // 1. Look up the banner
    const banner = await Store_Banner.findByPk(id, { transaction: t });

    if (!banner) {
      await t.rollback();
      return Base.sendError(res, HTTPS.NOT_FOUND, "Banner not found");
    }

    // 2. Compute the new status
    const newStatus = !banner.status;   // toggle

    // 3. If we’re turning this banner ON, turn every other banner OFF
    if (newStatus) {
      await Store_Banner.update(
        { status: false },
        { where: { id: { [Op.ne]: id } }, transaction: t }
      );
    }

    // 4. Update the selected banner
    await Store_Banner.update(
      { status: newStatus },
      { where: { id }, transaction: t }
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

  // async status(req, res) {
  //   const t = await sequelize.transaction();
  //   try {
  //     const { id } = req.params;

  //     const result = await CheckExits(Store_Banner, { id }, t);

  //     if (!result) {
  //       await t.rollback();
  //       return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
  //     }

  //     await UpdateData(Store_Banner, { status: result.status ? false : true }, { id }, t);

  //     await t.commit();

      // return Base.sendResponse(
      //   res,
      //   HTTPS.OK,
      //   "Store Banner status updated successfully"
      // );
  //   } catch (error) {
  //     await t.rollback();
  //     console.error("Error updating Store Banner status:", error);
  //     return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
  //   }
  // }
}

module.exports = new HomeBannerController();
