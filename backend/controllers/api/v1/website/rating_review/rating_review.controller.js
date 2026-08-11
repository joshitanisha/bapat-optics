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
  Product,
  Users,
  Rating_Reviews,
  Review_Images,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");

class RatingReviewsController {
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        user_id: req.user.user_id,
        ratings: req.body?.ratings,
        title: req.body?.title?.trim(),
        review: req.body?.review?.trim(),
        product_id: req.body?.product_id,
        reason_id: req.body?.reason_id,
        order_id: req.body?.order_id,
        order_detail_id: req.body?.order_detail_id,
      };
      const newItem = await CreateNew(Rating_Reviews, data, t);

      if (req?.files?.images) {
        const images = Array.isArray(req.files.images)
          ? req.files.images
          : [req.files.images];

        for (let image of images) {
          await CreateNew(
            Review_Images,
            {
              rating_id: newItem?.id,
              image: await File_Uploade(
                image,
                "/uploads/masters/rating_review"
              ),
            },
            t
          );
        }
      }
      // if (req.files && req.files?.image) {
      //   data.image = await File_Uploade(
      //     req.files?.image,
      //     "/uploads/masters/rating_review"
      //   );
      // }
      // const exists = await CheckExits(Rating_Reviews, { name: data?.name }, t);

      // if (exists) {
      //     await t.rollback();
      //     return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "rating already exists");
      // }

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newItem);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Review:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async getProductRatings(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = await Rating_Reviews.findAll({
        required: true,
        include: [
          {
            model: Users,
          },
        ],
        where: {
          product_id: req.params.id,
        },
      });

      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error getting Reviews:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async getAllRatings(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = await Rating_Reviews.findAll({
        required: true,
        include: [
          {
            model: Users,
          },
        ],
      });

      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error getting Reviews:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async getProductAvgRatings(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = await Rating_Reviews.findAll({
        required: true,
        include: [
          {
            model: Users,
          },
        ],
        where: {
          product_id: req.params.id,
        },
      });

      const top_users = [];

      data.forEach((rating) => {
        const existingUserIndex = top_users.findIndex(
          (user) => user.id === rating.id
        );

        if (existingUserIndex === -1) {
          top_users.push(rating);
        } else {
          if (rating.ratings > top_users[existingUserIndex].ratings) {
            top_users[existingUserIndex].ratings = rating.ratings;
          }
        }
      });

      top_users.sort((a, b) => b.ratings - a.ratings);
      const top_three_users = top_users.slice(0, 25);

      const formattedRatingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

      let total_counts = 0;
      let sum_of_ratings = 0;

      data.forEach((rating) => {
        formattedRatingCounts[rating.ratings]++;
        total_counts++;
        sum_of_ratings += rating.ratings; // Sum up all ratings
      });

      // Calculate rating percentages
      const ratingPercentagesArray = Object.entries(formattedRatingCounts).map(
        ([rating, count]) => {
          return {
            name: rating,
            percentage:
              total_counts > 0 ? ((count / total_counts) * 100).toFixed(0) : 0,
          };
        }
      );

      // Calculate average rating
      const averageRating =
        total_counts > 0 ? (sum_of_ratings / total_counts).toFixed(2) : 0;

      const response = {
        // data: data,
        top_users: top_three_users,
        total_counts: total_counts,
        average_rating: averageRating,
        rating_counts: ratingPercentagesArray.reverse(),
      };

      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, response);
    } catch (error) {
      await t.rollback();
      console.error("Error getting Reviews:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new RatingReviewsController();
