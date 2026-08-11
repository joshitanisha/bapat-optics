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
  Brand,
  Brand_Category,
  p_category,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
class BrandController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const options = {
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
        },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Brand, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Brands:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const include = [
        {
          model: Brand_Category,
          include: [{ model: p_category }],
        },
      ];
      const result = await CheckExits(Brand, { id: req.params.id }, t, include);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Brand not found");
      }

      const data = {
        name: result?.name,
        image: result?.image,

        category_id:
          result.Brand_Categories?.map((val) => ({
            value: val.category_id,
            name: "category_id",
            label: val.p_category?.name,
          })) ?? [],
      };
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Brand:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new country
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        name: req.body?.name?.trim(),
        image: await File_Uploade(req.files?.image, "/uploads/masters/brand"),
      };
      const exists = await CheckExits(Brand, { name: data?.name }, t);

      if (exists) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Brand already exists"
        );
      }

      const newItem = await CreateNew(Brand, data, t);

      if (req.body.category_id) {
        const Category = JSON.parse(req.body.category_id);
        console.log(Category, "Category");

        for (const add of Category) {
          const data = {
            brand_id: newItem?.id,
            category_id: add,
          };
          if (add.id) {
            await UpdateData(Brand_Category, data, { id: add.id }, t);
          } else {
            await CreateNew(Brand_Category, data, t);
          }
        }
      }
      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newItem);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Brand:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a country by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        name: req.body?.name?.trim(),
      };

      if (req.files && req.files.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/brand"
        );
      }

      const exists = await CheckExits(Brand, { name: data?.name }, t);

      if (exists?.id != id && exists !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Brand name already in use"
        );
      }

      const update = await UpdateData(Brand, data, { id: id }, t);

      if (req.body.category_id) {
        const Category = JSON.parse(req.body.category_id); 

        await Brand_Category.destroy({
          where: { brand_id: id },
          transaction: t,
        });

        for (const add of Category) {
          await CreateNew(
            Brand_Category,
            {
              brand_id: id,
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
        "Brand updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Brand:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a country by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Brand, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Brand not found");
      }

      await Brand.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "Brand Deleted Successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Brand:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Brand, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Brand,
        { status: result.status ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Brand status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Brand status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  
  async statusCustomer(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const country = await CheckExits(Brand, { id }, t);

      if (!country) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Category not found");
      }

      await UpdateData(
        Brand,
        { customer_view: country.customer_view ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Category customer_view updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Category status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new BrandController();
