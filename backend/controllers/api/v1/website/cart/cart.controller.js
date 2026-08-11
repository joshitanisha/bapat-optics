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
  AdminNotifications,
} = require("../../../../../helper/mobile_notifications");
const cart_detail = require("../../../../../models/cart_detail");
const {
  Users,
  Product,

  Cart,

  Product_Variant,
  Brand,
  Material,
  Frame_Type,
  Colour,
  LensType,
  Prescriptions,
  Addon,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
class CartController {
  async findAll(req, res) {
    try {
      const options = {
        include: [
          {
            model: Users,
          },
          {
            model: Prescriptions,
            required: false,
            include: [
              { model: Addon },
              {
                model: Product,
                as: "Lense",
                include: [{ model: Material }, { model: Brand }, { model: LensType },],
              },
             
            ],
          },
          {
            model: Product,
            include: [
              { model: Frame_Type },
              { model: Colour },
              { model: Material },
              { model: Brand },
            ],
            paranoid: true,
          },
        ],
        where: {
          user_id: req.user.user_id,
        },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Cart, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Brands:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async findAllWithoutLogin(req, res) {
    let data = req.body;
    let cartData;
    try {
      if (typeof data === "string") {
        cartData = JSON.parse(data);
      } else {
        cartData = data;
      }

      const dataToRes = [];
      const dataToIndex = [];

      for (const [index, item] of cartData.entries()) {
        const variant = await Product_Variant.findOne({
          paranoid: true,
          where: { id: item.variant_id },
          include: [
            {
              model: Product,
            },
          ],
        });

        if (variant) {
          dataToRes.push({
            product_id: item?.product_id,
            variant_id: item?.variant_id,
            quantity: item?.quantity,
            Product: variant?.Product,
            Product_Variant: variant,
          });
        } else {
          dataToIndex.push(index);
        }
      }

      const result = {
        data: dataToRes,
        dataToIndex: dataToIndex,
        total: dataToRes ? dataToRes?.length : 0,
      };

      return Base.sendResponse(res, HTTPS.OK, result);
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
          model: Users,
        },
        {
          model: Prescriptions,
          required: false,
          include: [{ model: Addon }, { model: LensType }],
        },
        {
          model: Product,
        },
        // {
        //   model: Product_Variant,
        //   paranoid: true,
        // },
      ];
      const result = await CheckExits(Cart, { id: req.params.id }, t, include);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Cart not found");
      }
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Brand:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new country
  async AddToCart(req, res) {
    const t = await sequelize.transaction();
    try {
      const product = await CheckExits(
        Product,
        { id: req?.body?.product_id },
        t
      );

      if (!product) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Product not found");
      }

      const data = {
        user_id: req?.user?.user_id,
        product_id: req?.body?.product_id,
        // variant_id: req?.body?.variant_id,
        quantity: req.body.quantity || 1,
        prescription_id: req.body.prescription_id || null,
      };

      let newItem;
      newItem = await CreateNew(Cart, data, t);

      // const exists = await CheckExits(
      //   Cart,
      //   {
      //     user_id: data?.user_id,
      //     product_id: data?.product_id,
      //     // variant_id: data?.variant_id,
      //   },
      //   t
      // );

      //
      // if (exists) {
      //   newItem = await UpdateData(
      //     Cart,
      //     {
      //       quantity: Number(exists?.quantity) + Number(req.body.quantity),
      //       prescription_id: req.body.prescription_id || null,
      //     },
      //     { id: exists?.id },
      //     t
      //   );
      // } else {

      // }

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, newItem);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Cart:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async cartQuantity(req, res) {
    const t = await sequelize.transaction();
    try {
      const { cart_id, type } = req?.body;

      const cartItem = await CheckExits(Cart, { id: cart_id }, t);

      if (!cartItem) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND);
      }

      if (type === "add") {
        cartItem.quantity = parseInt(cartItem.quantity) + 1;
      } else if (type === "minus") {
        if (parseInt(cartItem.quantity) === 1) {
          await cartItem.destroy();
          await t.commit();
          return Base.sendResponse(
            res,
            HTTPS.OK,
            "Cart item deleted because quantity is 1"
          );
        } else {
          cartItem.quantity = parseInt(cartItem.quantity) - 1;
        }
      } else if (type === "delete") {
        await cartItem.destroy();
        await t.commit();
        return Base.sendResponse(res, HTTPS.OK, "Cart item deleted.");
      } else {
        await t.rollback();
        return Base.sendError("Invalid type");
      }

      // Save the updated cart item
      const data1 = await cartItem.save();

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Cart quantity updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating cart:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async CheckProductInCart(req, res) {
    const t = await sequelize.transaction();
    try {
      const user_id = req.user.user_id;

      const cartItem = await CheckExits(
        Cart,
        {
          product_id: Number(req.query.product_id),
          variant_id: Number(req.query.variant_id),
          user_id: user_id,
        },
        t
        // include
      );

      await t.commit();

      if (cartItem) {
        return Base.sendResponse(res, HTTPS.OK, {
          success: true,
          cart_item: cartItem,
        });
      } else {
        return Base.sendResponse(res, HTTPS.OK, {
          success: false,
          cart_item: cartItem,
        });
      }
    } catch (error) {
      await t.rollback();
      console.error("Error getting cart:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a country by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Cart, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Cart not found");
      }

      await Cart.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "Cart Deleted Successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Cart:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async Lensedelete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Prescriptions, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Cart not found");
      }

      await Prescriptions.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "Cart Deleted Successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Cart:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async deleteAllCart(req, res) {
    const t = await sequelize.transaction();
    try {
      const result = await CheckExits(Cart, { user_id: req?.user?.user_id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Cart not found");
      }

      await Cart.destroy({
        where: { user_id: req?.user?.user_id },
        transaction: t,
      });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "Cart Deleted Successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Cart:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Cart, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Cart,
        { status: result.status ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Cart status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Cart status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new CartController();
