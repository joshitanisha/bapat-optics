const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
} = require("../../../../../helper/common");
const Base = require("../../../../../helper/exception-handling");
const { HTTPS } = require("../../../../../helper/https-status-codes");
const cart_detail = require("../../../../../models/cart_detail");
const { Users, Store_Detail, Favourite_Store, sequelize } = require("../../../../../models/index");
const { Op } = require("sequelize");
class WishlistController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const result = await Favourite_Store.findAll({
        include: [
          {
            model: Store_Detail,
          },
        ],
        where: { user_id: req.user.user_id },
        order: [["createdAt", "DESC"]]
      });

      if (result) {
        return Base.sendResponse(res, HTTPS.OK, result);
      } else {
        return Base.sendResponse(res, HTTPS.OK, []);
      }

    } catch (error) {
      // Log the full error to help with debugging
      console.error("Error fetching favourites:", error.stack);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async favStoreArray(req, res) {
    try {
      const result = await Favourite_Store.findAll({
        include: [
          {
            model: Store_Detail,
          },
        ],
        where: { user_id: req.user.user_id },
        order: [["createdAt", "DESC"]]
      });

      if (result.length > 0) {
        const data = result.map((item) => item.store_id);
        return Base.sendResponse(res, HTTPS.OK, data);
      } else {
        return Base.sendResponse(res, HTTPS.OK, []);
      }

    } catch (error) {
      // Log the full error to help with debugging
      console.error("Error fetching favourites:", error.stack);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new country
  async AddOrRemoveFavourite(req, res) {
    const t = await sequelize.transaction();
    try {
      const store = await CheckExits(Store_Detail, { id: req.params.id }, t);

      if (!store) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Store Not Found");
      }

      const data = {
        user_id: req?.user?.user_id,
        store_id: req.params.id,
      };

      const existsFavourite = await CheckExits(Favourite_Store, {
        user_id: req?.user?.user_id,
        store_id: req.params.id
      }, t);

      if (existsFavourite) {
        // Store is already in favourites, remove it
        const removed = await Favourite_Store.destroy({ where: { id: existsFavourite?.id }, transaction: t });
        if (removed) {
          await t.commit();
          return Base.sendResponse(res, HTTPS.OK, { message: "Store Removed Successfully" });
        }
      } else {
        // Store not in favourites, add it
        const newItem = await CreateNew(Favourite_Store, data, t);
        await t.commit();
        return Base.sendResponse(res, HTTPS.OK, newItem);
      }
    } catch (error) {
      await t.rollback();
      console.error("Error managing favourite store:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async CheckStoreInFavourite(req, res) {
    const t = await sequelize.transaction();
    try {

      const user_id = req.user.user_id;

      const storeData = await CheckExits(Favourite_Store, {
        store_id: req.params.id,
        user_id: user_id
      }, t);

      await t.commit();

      if (storeData) {
        return Base.sendResponse(res, HTTPS.OK, { is_favourite: true });
      } else {
        return Base.sendResponse(res, HTTPS.OK, { is_favourite: false });
      }

    } catch (error) {
      await t.rollback();
      console.error("Error getting Favourite:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }


}

module.exports = new WishlistController();
