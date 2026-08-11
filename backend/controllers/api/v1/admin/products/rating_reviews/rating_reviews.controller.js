const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
} = require("../../../../../../helper/common/utils/dbUtils");
const Base = require("../../../../../../helper/exception_handling");
const { RoleId } = require("../../../../../../helper/fix_ids");
const { HTTPS } = require("../../../../../../helper/https-status-codes/https-status-codes");
const { Product, Users, Rating_Reviews, Store_Detail, Review_Reason,Brand, sequelize } = require("../../../../../../models/index");
const { Op } = require("sequelize");
class RatingReviewsController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const product_id = req.query.product_id || "";
      const searchRating = req.query.searchRating || "";

      const options = {
        include: [
          {
            model: Product,
           
          },
          {
            model: Users,
          },
           {
            model: Review_Reason,
          },
        ],
        where: {
          ...product_id ? { product_id: product_id } : {},
          ...searchRating ? { ratings: searchRating } : {},
        },
        order: [["createdAt", "DESC"]],
      };

      await Paginate(Rating_Reviews, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Rating Reviews:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }


  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const include = [
        {
          model: Product,
          include: [
          
            {
              model: Brand
            }
          ]
        },
        {
          model: Users,
        }
      ];
      const result = await CheckExits(Rating_Reviews, { id: req.params.id }, t, include);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Reviews not found");
      }
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Reviews:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }



  // Delete a country by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Rating_Reviews, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Rating & Reviews not found");
      }

      await Rating_Reviews.destroy({ where: { id }, transaction: t, });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "Rating & Reviews Deleted Successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Rating & Reviews:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }


  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Rating_Reviews, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(Rating_Reviews, { status: result.status ? false : true }, { id }, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, "Rating & Reviews status updated successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error updating Rating & Reviews status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new RatingReviewsController();
