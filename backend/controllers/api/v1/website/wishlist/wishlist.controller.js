const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
} = require("../../../../../helper/common/utils/dbUtils");
const Base = require("../../../../../helper/exception_handling");
const { HTTPS } = require("../../../../../helper/https-status-codes/https-status-codes");
const cart_detail = require("../../../../../models/cart_detail");
const {
  Users,
  Product,
  Product_Variant, Unit, Frame_Type, Face_Width,
  Wishlist, Colour,
  Product_Stock,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
class WishlistController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const { count, rows: data } = await Wishlist.findAndCountAll({
        include: [
          {
            model: Users,
          },
          {
            model: Product,
            required:true,
            include: [
              {
                model: Frame_Type,
              },
              {
                model: Face_Width,
              },
            ],
          },
        ],
        where: { user_id: req.user.user_id },
        order: [["createdAt", "DESC"]],
        distinct: true,
      });

      // if (data.length > 0) {
        return Base.sendResponse(res, HTTPS.OK, {
          data: data,
          total: count,
        });
      // } else {
      //   return Base.sendResponse(res, HTTPS.OK, []);
      // }
    } catch (error) {
      console.error("Error fetching Brands:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async WishlistArray(req, res) {
    try {
      const result = await Wishlist.findAll({
        include: [
          {
            model: Store_Detail,
          },
        ],
        where: { user_id: req.user.user_id },
        order: [["createdAt", "DESC"]],
      });

      if (result.length > 0) {
        const data = result.map((item) => item.store_id);
        return Base.sendResponse(res, HTTPS.OK, data);
      } else {
        return Base.sendResponse(res, HTTPS.OK, []);
      }
    } catch (error) {
      // Log the full error to help with debugging
      console.error("Error wishlist favourites:", error.stack);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new country
  async AddOrRemoveWishlist(req, res) {
    const t = await sequelize.transaction();
    try {


      const product = await CheckExits(Product, { id: req.params.id }, t);

      if (!product) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Product Not Found");
      }

      const data = {
        user_id: req?.user?.user_id,
        product_id: req.params.id,
      };

      const existsFavourite = await CheckExits(
        Wishlist,
        {
          user_id: req?.user?.user_id,
          product_id: req.params.id,
        },
        t
      );

      if (existsFavourite) {
        // Store is already in favourites, remove it
        const removed = await Wishlist.destroy({
          where: { id: existsFavourite?.id },
          transaction: t,
        });
        if (removed) {
          await t.commit();
          return Base.sendResponse(
            res,
            HTTPS.OK,
            "Product Removed from Wishlist"
          );
        }
      } else {
        // Store not in favourites, add it
        const newItem = await CreateNew(Wishlist, data, t);
        await t.commit();
        return Base.sendResponse(res, HTTPS.OK, newItem);
      }
    } catch (error) {
      await t.rollback();
      console.error("Error creating Cart:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async CheckProductInWishlist(req, res) {
    const t = await sequelize.transaction();
    try {
      const user_id = req.user.user_id;

      const wishlistItem = await CheckExits(
        Wishlist,
        {
          product_id: req.params.id,
          user_id: user_id,
        },
        t
      );

      await t.commit();

      if (wishlistItem) {
        return Base.sendResponse(res, HTTPS.OK, { is_wishlisted: true });
      } else {
        return Base.sendResponse(res, HTTPS.OK, { is_wishlisted: false });
      }
    } catch (error) {
      await t.rollback();
      console.error("Error getting cart:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new WishlistController();
