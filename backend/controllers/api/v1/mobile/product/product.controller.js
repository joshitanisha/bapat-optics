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
  p_category,
  p_sub_category,
  Users,

  Product_Images,
  Brand,
  Unit,
  Rating_Reviews,
  Subscription,
  Product_Variant,
  Discount_Type,
  p_child_category,
  Product_Farmer,
  Offered_Product,
  Product_Pack_Type,
  Product_Delivery_Type,
  Pack_Type,
  Farmer,
  Delivery_Type,
  Product_Stock,
  Farmer_Detail,
  Farmer_Images,
  Product_Variant_Stock,
  Country,
  State,
  City,
  Crop,
  Collection_Center,
  Product_Serach_History,
  sequelize,
} = require("../../../../../models/index");

const { Op, where } = require("sequelize");
const { ItemType } = require("../../../../../helper/fix_ids");
const IDS = require("../../../../../helper/fix_ids");

class HomeController {
  async allProducts(req, res) {
    const name = req?.query?.name || "";
    const p_category_id = req?.query?.p_category_id || "";
    const p_sub_category_id = req?.query?.p_sub_category_id || "";
    const p_child_category_id = req?.query?.p_child_category_id || "";
    const brand_id = req?.query?.brand_id || "";

    const priceOrder = req?.query?.priceOrder || "ASC";

    const whereClause = {
      status: true,
      approval_status_id: IDS.ApprovalStatus.Approved,
    };

    if (name) {
      whereClause.name = { [Op.like]: `%${name}%` };
    }

    if (brand_id) {
      whereClause.brand_id = brand_id;
    }

    let orderClause = [];
    if (priceOrder) {
      orderClause = [[{ model: Product_Variant }, "price", priceOrder]];
    } else {
      orderClause = [["sort_order", "ASC"]];
    }
    try {
      const result = await Product.findAll({
        include: [
          {
            model: p_category,
            where: p_category_id ? { id: p_category_id } : { status: true },
          },
          // {
          //   model: p_sub_category,
          //   where: p_sub_category_id
          //     ? { id: p_sub_category_id }
          //     : { status: true },
          // },
          // {
          //   model: p_child_category,
          //   where: p_child_category_id
          //     ? { id: p_child_category_id }
          //     : { status: true },
          // },
          {
            model: Product_Variant,
            // order: [["price", priceOrder]],
          },
          {
            model: Product_Variant_Stock,
          },
          {
            model: Product_Farmer,
            include: [
              {
                model: Farmer,
                include: [
                  {
                    model: Farmer_Detail,
                  },
                  {
                    model: Farmer_Images,
                  },
                ],
              },
            ],
          },
          // {
          //   model: Product_Delivery_Type,
          //   include: [
          //     {
          //       model: Delivery_Type,
          //     },
          //   ],
          // },
          // {
          //   model: Product_Pack_Type,
          //   include: [
          //     {
          //       model: Pack_Type,
          //     },
          //   ],
          // },

          {
            model: Brand,
            where: brand_id ? { id: brand_id } : {},
            required: false,
          },
          {
            model: Unit,
          },
        ],
        where: whereClause,
        order: orderClause,
      });

      if (result.length === 0) {
        return Base.sendResponse(res, HTTPS.OK, result);
      }

      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      console.error("Error in Units:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllAddOnProducts(req, res) {
    const name = req?.query?.name || "";
    const p_category_id = req?.query?.p_category_id || "";
    const p_sub_category_id = req?.query?.p_sub_category_id || "";
    const p_child_category_id = req?.query?.p_child_category_id || "";
    const brand_id = req?.query?.brand_id || "";

    const priceOrder = req?.query?.priceOrder || "ASC";

    const whereClause = {
      is_replaceble: true,
      status: true,
      // approval_status_id: IDS.ApprovalStatus.Approved,
    };

    if (name) {
      whereClause.name = { [Op.like]: `%${name}%` };
    }

    if (brand_id) {
      whereClause.brand_id = brand_id;
    }

    try {
      const result = await Product.findAll({
        include: [
          {
            model: p_category,
            where: p_category_id ? { id: p_category_id } : { status: true },
          },
          {
            model: p_sub_category,
            where: p_sub_category_id
              ? { id: p_sub_category_id }
              : { status: true },
          },
          {
            model: p_child_category,
            where: p_child_category_id
              ? { id: p_child_category_id }
              : { status: true },
          },
          {
            model: Product_Variant,
          },
          {
            model: Product_Variant_Stock,
          },
          {
            model: Product_Farmer,
            include: [
              {
                model: Farmer,
                include: [
                  {
                    model: Farmer_Images,
                  },
                ],
              },
            ],
          },
          // {
          //   model: Product_Delivery_Type,
          //   include: [
          //     {
          //       model: Delivery_Type,
          //     },
          //   ],
          // },
          // {
          //   model: Product_Pack_Type,
          //   include: [
          //     {
          //       model: Pack_Type,
          //     },
          //   ],
          // },

          {
            model: Brand,
            where: brand_id ? { id: brand_id } : {},
            required: false,
          },
          {
            model: Unit,
          },
        ],
        where: whereClause,
        order: [["price", priceOrder]],
      });

      if (result.length === 0) {
        return Base.sendResponse(res, HTTPS.OK, result);
      }

      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      console.error("Error in Units:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllSeasonableProducts(req, res) {
    const name = req?.query?.name || "";
    const p_category_id = req?.query?.p_category_id || "";
    const p_sub_category_id = req?.query?.p_sub_category_id || "";
    const p_child_category_id = req?.query?.p_child_category_id || "";
    const brand_id = req?.query?.brand_id || "";

    const priceOrder = req?.query?.priceOrder || "ASC";

    const whereClause = {
      seasonable_status: true,
      status: true,
      // approval_status_id: IDS.ApprovalStatus.Approved,
    };

    if (name) {
      whereClause.name = { [Op.like]: `%${name}%` };
    }

    if (brand_id) {
      whereClause.brand_id = brand_id;
    }

    try {
      const result = await Product.findAll({
        include: [
          {
            model: p_category,
            where: p_category_id ? { id: p_category_id } : { status: true },
          },
         
          {
            model: Product_Variant,
          },
          {
            model: Product_Variant_Stock,
          },
          {
            model: Product_Farmer,
            required: false,
            include: [
              {
                model: Farmer,
                required: false,
                include: [
                  {
                    model: Farmer_Images,
                    required: false,
                  },
                ],
              },
            ],
          },
          // {
          //   model: Product_Delivery_Type,
          //   include: [
          //     {
          //       model: Delivery_Type,
          //     },
          //   ],
          // },
          // {
          //   model: Product_Pack_Type,
          //   include: [
          //     {
          //       model: Pack_Type,
          //     },
          //   ],
          // },

          {
            model: Brand,
            where: brand_id ? { id: brand_id } : {},
            required: false,
          },
          {
            model: Unit,
          },
        ],
        where: whereClause,
        order: [["price", priceOrder]],
      });

      if (result.length === 0) {
        return Base.sendResponse(res, HTTPS.OK, result);
      }

      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      console.error("Error in Units:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async singleProducts(req, res) {
    try {
      const result = await Product.findOne({
        include: [
          {
            model: p_category,
          },
        
          {
            model: Product_Variant,
            // include: [
            //   {
            //     model: Product_Variant_Stock,
            //   },
            // ],
          },
          // {
          //   model: Product_Delivery_Type,
          //   include: [
          //     {
          //       model: Delivery_Type,
          //     },
          //   ],
          // },
          // {
          //   model: Product_Pack_Type,
          //   include: [
          //     {
          //       model: Pack_Type,
          //     },
          //   ],
          // },

          {
            model: Brand,
          },

          {
            model: Unit,
          },
          {
            model: Rating_Reviews,
            include: [
              {
                model: Users,
              },
            ],
          },
          {
            model: Product_Farmer,
            include: [
              {
                model: Farmer,
                where: { status: true },
                include: [
                  {
                    model: Farmer_Detail,
                    include: [
                      { model: Country },
                      { model: State },
                      { model: City },
                      { model: Crop },
                      { model: Collection_Center },
                    ],
                  },
                  {
                    model: Farmer_Images,
                  },
                ],
              },
            ],
          },
          {
            model: Product_Images,
          },
        ],
        where: {
          id: req?.params?.id,
          status: true,
        },
      });

      if (!result) {
        return Base.sendResponse(res, HTTPS.NOT_FOUND, {
          message: "Product not found",
        });
      }

      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      console.error("Error in Units:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allProductsGroupByCategory(req, res) {
    try {
      const brand_id = req.query.brand_id || "";
      const product_name = req.query.product_name || "";
      const whereClause = {
        status: true,
        approval_status_id: IDS.ApprovalStatus.Approved,
      };
      if (product_name) {
        whereClause.name = { [Op.like]: `%${product_name}%` };
      }
      const products = await p_category.findAll({
        include: [
          {
            model: Product,
            where: whereClause,
            include: [
              {
                model: Product_Variant,
              },
              {
                model: Brand,
                where: brand_id ? { id: brand_id } : {},
                required: false,
              },
              {
                model: Product_Variant_Stock,
              },
              {
                model: Unit,
              },
            ],
          },
        ],
        where: { status: true },
        order: [["sort_order", "ASC"]],
      });

      // if (products.length === 0) {
      //   return Base.sendResponse(res, HTTPS.OK, "No Products");
      // }

      return Base.sendResponse(res, HTTPS.OK, products);
    } catch (error) {
      console.error("Error in fetching products:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllOfferedProducts(req, res) {
    try {
      const name = req?.query?.name || "";
      const price_order = req?.query?.price_order || "ASC";

      const data = await Offered_Product.findAll({
        include: [
          {
            model: Discount_Type,
          },
          {
            model: Product,
            include: [
              {
                model: Product_Variant,
              },
              {
                model: Product_Variant_Stock,
              },
              {
                model: Unit,
              },
            ],
            where: {
              [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
              status: true,
            },
          },
        ],
        where: {
          status: true,
        },

        distinct: true,
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error(error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async SearchHistory(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        // user_id: req.user.user_id,
        name: req.body?.name,
      };

      // const exists = await CheckExits(Rating_Reviews, { name: data?.name }, t);

      // if (exists) {
      //     await t.rollback();
      //     return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "rating already exists");
      // }

      const newItem = await CreateNew(Product_Serach_History, data, t);

      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newItem);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Review:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new HomeController();
