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
  Colour,
  p_category,
  Color_Category,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
class ColourController {
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const options = {
        include: [{ model: p_category }],
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
        },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Colour, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Colour:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single Colour by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const include = [
        {
          model: Color_Category,
          include: [
            {
              model: p_category,
            },
          ],
        },
      ];
      const result = await CheckExits(
        Colour,
        { id: req.params.id },
        t,
        include
      );

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Colour not found");
      }

      const data = {
        name: result?.name,
        first_color: result?.first_color,
        category_id:
          result.Color_Categories?.map((val) => ({
            value: val.category_id,
            name: "category_id",
            label: val.p_category?.name,
          })) ?? [],

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
      console.error("Error fetching Colour:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new Colour
  // async create(req, res) {
  //   const t = await sequelize.transaction();
  //   try {
  //     const data = {
  //       name: req.body?.name?.trim(),
  //       // category_id: req.body?.category_id,
  //       first_color: req.body?.first_color?.trim(),
  //       // second_color: req.body?.second_color?.trim(),
  //       // image: await File_Uploade(req.files?.image, "/uploads/masters/colour")
  //     };
  //     const exists = await CheckExits(Colour, { name: data?.name }, t);

  //     if (exists) {
  //       await t.rollback();
  //       return Base.sendError(
  //         res,
  //         HTTPS.NOT_ACCEPTABLE,
  //         "Colour already exists"
  //       );
  //     }

  //     const newItem = await CreateNew(Colour, data, t);

  //     if (req.body.category_id) {
  //       const Category = JSON.parse(req.body.category_id);

  //       for (const add of Category) {
  //         const data = {
  //           color_id: newItem?.id,
  //           category_id: add,
  //         };
  //         if (add.id) {
  //           await UpdateData(Color_Category, data, { id: add.id }, t);
  //         } else {
  //           await CreateNew(Color_Category, data, t);
  //         }
  //       }
  //     }

  //     await t.commit();

  //     return Base.sendResponse(res, HTTPS.CREATED, newItem);
  //   } catch (error) {
  //     await t.rollback();
  //     console.error("Error creating Colour:", error);
  //     return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
  //   }
  // }

  async create(req, res) {
  const t = await sequelize.transaction();
  try {
    const data = {
      name: req.body?.name?.trim(),
      first_color: req.body?.first_color?.trim(),
    };

    // ✅ find or create colour
    let colour = await Colour.findOne({
      where: { name: data.name },
      transaction: t,
    });

    if (!colour) {
      colour = await Colour.create(data, { transaction: t });
    }

    // ✅ handle categories
    if (req.body.category_id) {
      const categories = JSON.parse(req.body.category_id); // [1,2] or [{id:1},{id:2}]

      for (const add of categories) {
        const categoryId = add.id || add;

        // ✅ check mapping exists
        const existsMap = await Color_Category.findOne({
          where: {
            color_id: colour.id,
            category_id: categoryId,
          },
          transaction: t,
        });

        // ✅ only create if not exists
        if (!existsMap) {
          await Color_Category.create(
            {
              color_id: colour.id,
              category_id: categoryId,
            },
            { transaction: t }
          );
        }
      }
    }

    await t.commit();

    return Base.sendResponse(res, HTTPS.CREATED, colour);
  } catch (error) {
    await t.rollback();
    console.error("Error creating Colour:", error);
    return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
  }
}


  // Update a Colour by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        name: req.body?.name?.trim(),
        first_color: req.body?.first_color?.trim(),
        // category_id: req.body?.category_id,
        // second_color: req.body?.second_color?.trim(),
      };

      if (req.files && req.files.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/colour"
        );
      }

      const exists = await CheckExits(Colour, { name: data?.name }, t);

      if (exists?.id != id && exists !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Colour name already in use"
        );
      }

      const update = await UpdateData(Colour, data, { id: id }, t);

      if (req.body.category_id) {
        const Category = JSON.parse(req.body.category_id);

        await Color_Category.destroy({
          where: { color_id: id },
          transaction: t,
        });

        for (const add of Category) {
          await CreateNew(
            Color_Category,
            {
              color_id: id,
              category_id: add,
            },
            t
          );
        }
      }

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Colour updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Colour:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete Colour by id
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Colour, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Colour not found");
      }

      await Colour.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "Colour Deleted Successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Colour:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Colour, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Colour,
        { status: result.status ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Colour status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Colour status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new ColourController();
