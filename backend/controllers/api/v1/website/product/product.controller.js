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
  Gender,
  Face_Width,
  Frame_Type,
  Material,
  Shape,
  Admin_Notifiction,
  Colour,
  App_Setup,
  sequelize,
} = require("../../../../../models/index");

const { Op, where } = require("sequelize");
const { ItemType } = require("../../../../../helper/fix_ids");
const IDS = require("../../../../../helper/fix_ids");
const app_setup = require("../../../../../models/app_setup");
const {
  sendWatsappMessage,
  sendWatsapp,
} = require("../../../../../helper/WhatsAppMessage");

function get3CharCombos(str) {
  let s = str.replace(/\s+/g, "");
  let arr = [];
  for (let i = 0; i < s.length - 2; i++) {
    arr.push(s.substring(i, i + 3));
  }
  return arr;
}

// function similarity(a, b) {
//   const longer = a.length >= b.length ? a : b;
//   const shorter = a.length < b.length ? a : b;

//   const longerLength = longer.length;
//   if (longerLength === 0) return 1.0;

//   const distance = levenshtein(longer, shorter);
//   return (longerLength - distance) / longerLength;
// }

// function levenshtein(a, b) {
//   const matrix = [];

//   for (let i = 0; i <= b.length; i++) matrix[i] = [i];
//   for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

//   for (let i = 1; i <= b.length; i++) {
//     for (let j = 1; j <= a.length; j++) {
//       matrix[i][j] =
//         b.charAt(i - 1) === a.charAt(j - 1)
//           ? matrix[i - 1][j - 1]
//           : Math.min(
//               matrix[i - 1][j - 1] + 1,
//               matrix[i][j - 1] + 1,
//               matrix[i - 1][j] + 1
//             );
//     }
//   }

//   return matrix[b.length][a.length];
// }

function similarity(a, b) {
  const longer = a.length >= b.length ? a : b;
  const shorter = a.length < b.length ? a : b;
  const longerLength = longer.length;
  if (longerLength === 0) return 1.0;

  const distance = levenshtein(longer, shorter);
  return (longerLength - distance) / longerLength;
}

function levenshtein(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] =
        b.charAt(i - 1) === a.charAt(j - 1)
          ? matrix[i - 1][j - 1]
          : Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1,
          );
    }
  }

  return matrix[b.length][a.length];
}

class HomeController {
  async allProducts(req, res) {
    try {
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const per_page = req.query.per_page ? parseInt(req.query.per_page) : 20;
      const name = req?.query?.name || "";
      const p_category_id = req?.query?.category
        ? req?.query?.category.split(",").map((id) => parseInt(id, 10))
        : "";
      const brand_id = req?.query?.brands
        ? req?.query?.brands.split(",").map((id) => parseInt(id, 10))
        : "";
      const gender_id = req?.query?.gender
        ? req?.query?.gender.split(",").map((id) => parseInt(id, 10))
        : "";
      const material_id = req?.query?.material
        ? req?.query?.material.split(",").map((id) => parseInt(id, 10))
        : "";
      const frame_type_id = req?.query?.frameType
        ? req?.query?.frameType.split(",").map((id) => parseInt(id, 10))
        : "";
      const color_id = req?.query?.colour
        ? req?.query?.colour.split(",").map((id) => parseInt(id, 10))
        : "";
      const shape_id = req?.query?.frameShape
        ? req?.query?.frameShape.split(",").map((id) => parseInt(id, 10))
        : "";
      const priceBetween = req?.query?.priceRange
        ? req?.query?.priceRange.split(",").map(Number)
        : "";
      const face_width_id = req?.query?.faceWidth
        ? req?.query?.faceWidth.split(",").map((id) => parseInt(id, 10))
        : "";

      // 1. Parse is_vto into an array of 1s and 0s safely
      const is_vto = req?.query?.is_vto
        ? req.query.is_vto.split(",").map((val) => {
          const cleanVal = val.trim().toLowerCase();
          // Accepts "true" or "1" as True (1), otherwise returns False (0)
          return (cleanVal === "true" || cleanVal === "1") ? 1 : 0;
        })
        : null; // Use null instead of "" for easier evaluation
      console.log("is_vto-1", is_vto);
      const sortBy = req?.query?.sortBy;

      const whereClause = {
        status: true,
        customer_view: true,
        approval_status_id: IDS.ApprovalStatus.Approved,
      };

      const categoryClause = { status: true, customer_view: true };
      const brandClause = {};

      if (priceBetween) {
        whereClause.price = {
          [Op.between]: [priceBetween],
        };
        whereClause.price = {
          [Op.gt]: priceBetween[0],
          [Op.lt]: priceBetween[1],
        };
      }

      if (p_category_id) {
        categoryClause.id = {
          [Op.in]: p_category_id,
        };
      }

      if (material_id) {
        whereClause.material_id = {
          [Op.in]: material_id,
        };
      }
      if (gender_id) {
        whereClause.gender_id = {
          [Op.in]: gender_id,
        };
      }
      if (brand_id) {
        whereClause.brand_id = {
          [Op.in]: brand_id,
        };
      }
      if (frame_type_id) {
        whereClause.frame_type_id = {
          [Op.in]: frame_type_id,
        };
      }
      if (color_id) {
        whereClause.color_id = {
          [Op.in]: color_id,
        };
      }

      if (face_width_id) {
        whereClause.face_width_id = {
          [Op.in]: face_width_id,
        };
      }

      if (Array.isArray(is_vto) && is_vto.length > 0) {
        console.log("VTO Filter Applied:", is_vto);
        whereClause.vto_enable = {
          [Op.in]: is_vto,
        };
      }

      if (shape_id) {
        whereClause.shape_id = {
          [Op.in]: shape_id,
        };
      }

      // if (name) {
      //   whereClause[Op.or] = [
      //     { name: { [Op.like]: `%${name}%` } },
      //     { "$p_category.name$": { [Op.like]: `%${name}%` } },
      //   ];
      // }

      if (name && name?.length < 2) {
        const firstLetter = name[0].toLowerCase();
        whereClause.name = where(fn("LOWER", col("Product.name")), {
          [Op.like]: `${firstLetter}%`,
        });
      }

      let order = [["createdAt", "ASC"]];
      if (sortBy === "NEW") {
        order = [["createdAt", "DESC"]];
      } else if (sortBy === "POPULAR") {
        order = [["tranding_status", "ASC"]];
      } else if (sortBy === "default") {
      } else if (sortBy) {
        order = [["price", sortBy]];
      } else {
        order = [
          [sequelize.literal("gender_id IS NULL"), "ASC"],
          ["gender_id", "ASC"],
        ];
      }
      const eyegalss_status = req?.query?.eyegalss_status || "";
      if (eyegalss_status) {
        whereClause.tranding_status = true;
      }
      let result;
      const { count, rows: data } = await Product.findAndCountAll({
        include: [
          {
            model: p_category,
            where: categoryClause,
          },

          {
            model: Brand,
            required: false,
            // where: brandClause ? brandClause : "",
          },
          {
            model: Gender,
            required: false,
            // where: genderWhereClause,
          },
          {
            model: Face_Width,
            required: false,
            // where: faceWidthWhereClause,
          },
          {
            model: Frame_Type,
            required: false,
            // where: frameTypeWhereClause,
          },
          {
            model: Material,
            required: false,
            // where: materialWhereClause,
          },
          {
            model: Shape,
            required: false,
            // where: shapeWhereClause,
          },
          {
            model: Product_Images,
          },
        ],
        where: whereClause,
        order,
        // offset: (page - 1) * per_page,
        // limit: per_page,
        distinct: true,
        // order: [["createdAt", "DESC"]],
      });

      if (name) {
        const searchWords = name.toLowerCase().split(/[\s\/\-\|]+/);

        result = data
          .map((p) => {
            const plain = p.get({ plain: true });

            const productWords =
              plain.name?.toLowerCase().split(/[\s\/\-\|]+/) || [];
            const categoryWords =
              plain?.tag?.toLowerCase().split(/[\s\/\-\|]+/) || [];

            const allWords = [...productWords, ...categoryWords];

            let bestScore = 0;
            let exactMatch = false;

            for (let sWord of searchWords) {
              if (allWords.includes(sWord)) {
                exactMatch = true;
                bestScore = Math.max(bestScore, 2);
              }

              for (let word of allWords) {
                if (word.toLowerCase().startsWith(sWord[0].toLowerCase())) {
                  bestScore = Math.max(bestScore, similarity(word, sWord));
                  // console.log(bestScore, word, "word");
                }
              }
            }

            plain._score = bestScore;
            plain._exact = exactMatch;
            return plain;
          })
          .filter((p) => (name?.length < 2 ? p._score >= 0.2 : p._score >= 0.4))
          .sort((a, b) => {
            if (a._exact && !b._exact) return -1;
            if (b._exact && !a._exact) return 1;

            return b._score - a._score;
          });
      } else {
        result = data;
      }
      const total_pages = Math.ceil(result.length / per_page);

      const start = (page - 1) * per_page;
      const end = start + per_page;
      console.log("result", result);
      const paginatedResult = result.slice(start, end);
      return Base.sendResponse(res, HTTPS.OK, {
        data: paginatedResult,
        current_page: page,
        total_pages: total_pages,
        per_page: per_page,
        total: count,
      });

      // await Paginate(Product, options, req, res, Op);
    } catch (error) {
      console.error("Error in home products:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }
  // async allProducts(req, res) {
  //   try {
  //     const name = req?.query?.name || "";
  //     const p_category_id = req?.query?.category
  //       ? req?.query?.category.split(",").map((id) => parseInt(id, 10))
  //       : "";
  //     const brand_id = req?.query?.brands
  //       ? req?.query?.brands.split(",").map((id) => parseInt(id, 10))
  //       : "";
  //     const gender_id = req?.query?.gender
  //       ? req?.query?.gender.split(",").map((id) => parseInt(id, 10))
  //       : "";
  //     const material_id = req?.query?.material
  //       ? req?.query?.material.split(",").map((id) => parseInt(id, 10))
  //       : "";
  //     const frame_type_id = req?.query?.frameType
  //       ? req?.query?.frameType.split(",").map((id) => parseInt(id, 10))
  //       : "";
  //     const color_id = req?.query?.colour
  //       ? req?.query?.colour.split(",").map((id) => parseInt(id, 10))
  //       : "";
  //     const shape_id = req?.query?.frameShape
  //       ? req?.query?.frameShape.split(",").map((id) => parseInt(id, 10))
  //       : "";
  //     const priceBetween = req?.query?.priceRange
  //       ? req?.query?.priceRange.split(",").map(Number)
  //       : "";
  //     const face_width_id = req?.query?.faceWidth
  //       ? req?.query?.faceWidth.split(",").map((id) => parseInt(id, 10))
  //       : "";

  //     const sortBy = req?.query?.sortBy;

  //     const whereClause = {
  //       status: true,
  //       customer_view: true,
  //       approval_status_id: IDS.ApprovalStatus.Approved,
  //     };

  //     const categoryClause = { status: true, customer_view: true };
  //     const brandClause = {};
  //     // const genderWhereClause = gender_id ? { id: { [Op.in]: gender_id } } : {};
  //     // const faceWidthWhereClause = faceWidth
  //     //   ? { id: { [Op.in]: faceWidth } }
  //     //   : {};
  //     // const frameTypeWhereClause = frame_type_id
  //     //   ? { id: { [Op.in]: frame_type_id } }
  //     //   : {};
  //     // const materialWhereClause = material_id
  //     //   ? { id: { [Op.in]: material_id } }
  //     //   : {};
  //     // const shapeWhereClause = shape_id ? { id: { [Op.in]: shape_id } } : {};

  //     // if (brand_id) {
  //     //   whereClause.brand_id = brand_id;
  //     // }

  //     if (priceBetween) {
  //       whereClause.price = {
  //         [Op.between]: [priceBetween],
  //       };
  //       whereClause.price = {
  //         [Op.gt]: priceBetween[0],
  //         [Op.lt]: priceBetween[1],
  //       };
  //     }

  //     if (p_category_id) {
  //       categoryClause.id = {
  //         [Op.in]: p_category_id,
  //       };
  //     }

  //     if (material_id) {
  //       whereClause.material_id = {
  //         [Op.in]: material_id,
  //       };
  //     }
  //     if (gender_id) {
  //       whereClause.gender_id = {
  //         [Op.in]: gender_id,
  //       };
  //     }
  //     if (brand_id) {
  //       whereClause.brand_id = {
  //         [Op.in]: brand_id,
  //       };
  //     }
  //     if (frame_type_id) {
  //       whereClause.frame_type_id = {
  //         [Op.in]: frame_type_id,
  //       };
  //     }
  //     if (color_id) {
  //       whereClause.color_id = {
  //         [Op.in]: color_id,
  //       };
  //     }

  //     if (face_width_id) {
  //       whereClause.face_width_id = {
  //         [Op.in]: face_width_id,
  //       };
  //     }

  //     if (shape_id) {
  //       whereClause.shape_id = {
  //         [Op.in]: shape_id,
  //       };
  //     }

  //     // if (name) {
  //     //   whereClause.name = { [Op.like]: `%${name}%` };
  //     //   categoryClause.name = { [Op.like]: `%${name}%` };
  //     //   // brandClause.name = { [Op.like]: `%${name}%` };
  //     //   // genderWhereClause.name = { [Op.like]: `%${name}%` };
  //     //   // faceWidthWhereClause.name = { [Op.like]: `%${name}%` };
  //     //   // frameTypeWhereClause.name = { [Op.like]: `%${name}%` };
  //     //   // materialWhereClause.name = { [Op.like]: `%${name}%` };
  //     //   // shapeWhereClause.name = { [Op.like]: `%${name}%` };

  //     // }

  //     if (name) {
  //       whereClause[Op.or] = [
  //         { name: { [Op.like]: `%${name}%` } },
  //         { "$p_category.name$": { [Op.like]: `%${name}%` } },
  //       ];
  //     }

  //     let order = [["createdAt", "ASC"]];
  //     if (sortBy === "NEW") {
  //       order = [["createdAt", "DESC"]];
  //     } else if (sortBy === "POPULAR") {
  //       order = [["tranding_status", "ASC"]];
  //     } else if (sortBy === "default") {
  //     } else if (sortBy) {
  //       order = [["price", sortBy]];
  //     } else {
  //       order = [
  //         [sequelize.literal("gender_id IS NULL"), "ASC"],
  //         ["gender_id", "ASC"],
  //       ];
  //     }
  //     const eyegalss_status = req?.query?.eyegalss_status || "";
  //     if (eyegalss_status) {
  //       whereClause.tranding_status = true;
  //     }
  //     const options = {
  //       include: [
  //         {
  //           model: p_category,
  //           where: categoryClause,
  //         },

  //         {
  //           model: Brand,
  //           required: false,
  //           // where: brandClause ? brandClause : "",
  //         },
  //         {
  //           model: Gender,
  //           required: false,
  //           // where: genderWhereClause,
  //         },
  //         {
  //           model: Face_Width,
  //           required: false,
  //           // where: faceWidthWhereClause,
  //         },
  //         {
  //           model: Frame_Type,
  //           required: false,
  //           // where: frameTypeWhereClause,
  //         },
  //         {
  //           model: Material,
  //           required: false,
  //           // where: materialWhereClause,
  //         },
  //         {
  //           model: Shape,
  //           required: false,
  //           // where: shapeWhereClause,
  //         },
  //         {
  //           model: Product_Images,
  //         },
  //       ],
  //       where: whereClause,
  //       order,
  //       // order: [["createdAt", "DESC"]],
  //     };

  //     await Paginate(Product, options, req, res, Op);
  //   } catch (error) {
  //     console.error("Error in home products:", error);
  //     return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
  //   }
  // }

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
      console.error("Error in home products:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllTopProducts(req, res) {
    const name = req?.query?.name || "";
    const p_category_id = req?.query?.p_category_id || "";
    const p_sub_category_id = req?.query?.p_sub_category_id || "";
    const p_child_category_id = req?.query?.p_child_category_id || "";
    const brand_id = req?.query?.brand_id || "";

    const priceOrder = req?.query?.priceOrder || "ASC";

    const whereClause = {
      top_status: true,
      status: true,
      customer_view: true,
      approval_status_id: IDS.ApprovalStatus.Approved,
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
            model: Offered_Product,
            required: false,
            include: [
              {
                model: Discount_Type,
              },
            ],
          },
          {
            model: Gender,
          },
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
          // {
          //   model: Product_Variant,
          // },

          {
            model: Brand,
            where: brand_id ? { id: brand_id } : {},
            required: false,
          },
        ],
        where: whereClause,
        order: [["createdAt", "DESC"]],
      });

      if (result.length === 0) {
        return Base.sendResponse(res, HTTPS.OK, result);
      }

      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      console.error("Error in home products:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllEyeglassesProducts(req, res) {
    try {
      console.log("gggggggggggggggg");

      const name = req?.query?.name || "";
      const p_category_id = req?.query?.category
        ? req?.query?.category.split(",").map((id) => parseInt(id, 10))
        : "";
      const brand_id = req?.query?.brands
        ? req?.query?.brands.split(",").map((id) => parseInt(id, 10))
        : "";
      const gender_id = req?.query?.gender
        ? req?.query?.gender.split(",").map((id) => parseInt(id, 10))
        : "";
      const material_id = req?.query?.material
        ? req?.query?.material.split(",").map((id) => parseInt(id, 10))
        : "";
      const frame_type_id = req?.query?.frameType
        ? req?.query?.frameType.split(",").map((id) => parseInt(id, 10))
        : "";
      const color_id = req?.query?.colour
        ? req?.query?.colour.split(",").map((id) => parseInt(id, 10))
        : "";
      const shape_id = req?.query?.frameShape
        ? req?.query?.frameShape.split(",").map((id) => parseInt(id, 10))
        : "";
      const priceBetween = req?.query?.priceRange
        ? req?.query?.priceRange.split(",").map(Number)
        : "";
      const face_width_id = req?.query?.faceWidth
        ? req?.query?.faceWidth.split(",").map((id) => parseInt(id, 10))
        : "";

      const sortBy = req?.query?.sortBy;

      const whereClause = {
        status: true,
        customer_view: true,
        tranding_status: true,
        approval_status_id: IDS.ApprovalStatus.Approved,
      };

      const categoryClause = { status: true, customer_view: true };
      const brandClause = {};
      // const genderWhereClause = gender_id ? { id: { [Op.in]: gender_id } } : {};
      // const faceWidthWhereClause = faceWidth
      //   ? { id: { [Op.in]: faceWidth } }
      //   : {};
      // const frameTypeWhereClause = frame_type_id
      //   ? { id: { [Op.in]: frame_type_id } }
      //   : {};
      // const materialWhereClause = material_id
      //   ? { id: { [Op.in]: material_id } }
      //   : {};
      // const shapeWhereClause = shape_id ? { id: { [Op.in]: shape_id } } : {};

      // if (brand_id) {
      //   whereClause.brand_id = brand_id;
      // }

      if (priceBetween) {
        whereClause.price = {
          [Op.between]: [priceBetween],
        };
        whereClause.price = {
          [Op.gt]: priceBetween[0],
          [Op.lt]: priceBetween[1],
        };
      }

      if (p_category_id) {
        categoryClause.id = {
          [Op.in]: p_category_id,
        };
      }

      if (material_id) {
        whereClause.material_id = {
          [Op.in]: material_id,
        };
      }
      if (gender_id) {
        whereClause.gender_id = {
          [Op.in]: gender_id,
        };
      }
      if (brand_id) {
        whereClause.brand_id = {
          [Op.in]: brand_id,
        };
      }
      if (frame_type_id) {
        whereClause.frame_type_id = {
          [Op.in]: frame_type_id,
        };
      }
      if (color_id) {
        whereClause.color_id = {
          [Op.in]: color_id,
        };
      }

      if (face_width_id) {
        whereClause.face_width_id = {
          [Op.in]: face_width_id,
        };
      }

      if (shape_id) {
        whereClause.shape_id = {
          [Op.in]: shape_id,
        };
      }

      // if (name) {
      //   whereClause.name = { [Op.like]: `%${name}%` };
      //   categoryClause.name = { [Op.like]: `%${name}%` };
      //   // brandClause.name = { [Op.like]: `%${name}%` };
      //   // genderWhereClause.name = { [Op.like]: `%${name}%` };
      //   // faceWidthWhereClause.name = { [Op.like]: `%${name}%` };
      //   // frameTypeWhereClause.name = { [Op.like]: `%${name}%` };
      //   // materialWhereClause.name = { [Op.like]: `%${name}%` };
      //   // shapeWhereClause.name = { [Op.like]: `%${name}%` };

      // }

      if (name) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${name}%` } },
          { "$p_category.name$": { [Op.like]: `%${name}%` } },
        ];
      }

      let order = [["createdAt", "ASC"]];
      if (sortBy === "NEW") {
        order = [["createdAt", "DESC"]];
      } else if (sortBy === "POPULAR") {
        order = [["tranding_status", "ASC"]];
      } else if (sortBy === "default") {
      } else if (sortBy) {
        order = [["price", sortBy]];
      }
      const options = {
        include: [
          {
            model: p_category,
            where: categoryClause,
          },

          {
            model: Brand,
            required: false,
            // where: brandClause ? brandClause : "",
          },
          {
            model: Gender,
            required: false,
            // where: genderWhereClause,
          },
          {
            model: Face_Width,
            required: false,
            // where: faceWidthWhereClause,
          },
          {
            model: Frame_Type,
            required: false,
            // where: frameTypeWhereClause,
          },
          {
            model: Material,
            required: false,
            // where: materialWhereClause,
          },
          {
            model: Shape,
            required: false,
            // where: shapeWhereClause,
          },
          {
            model: Product_Images,
          },
        ],
        where: whereClause,
        order,
        // order: [["createdAt", "DESC"]],
      };

      await Paginate(Product, options, req, res, Op);
    } catch (error) {
      console.error("Error in home products:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }
  async getAllTrandingProducts(req, res) {
    const name = req?.query?.name || "";
    const p_category_id = req?.query?.p_category_id || "";
    const p_sub_category_id = req?.query?.p_sub_category_id || "";
    const p_child_category_id = req?.query?.p_child_category_id || "";
    const brand_id = req?.query?.brand_id || "";

    const priceOrder = req?.query?.priceOrder || "ASC";

    const whereClause = {
      customer_view: true,
      tranding_status: true,
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
            model: Offered_Product,
            required: false,
            include: [
              {
                model: Discount_Type,
              },
            ],
          },
          {
            model: Gender,
          },
          {
            model: p_category,
            where: p_category_id ? { id: p_category_id } : { status: true },
          },

          // {
          //   model: Product_Variant,
          // },

          {
            model: Brand,
            where: brand_id ? { id: brand_id } : {},
            required: false,
          },
        ],
        where: whereClause,
        order: [["createdAt", "DESC"]],
      });

      if (result.length === 0) {
        return Base.sendResponse(res, HTTPS.OK, result);
      }

      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      console.error("Error in home products:", error);
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
            model: Brand,
          },
          {
            model: Product_Images,
          },
          {
            model: Gender,
            required: false,
          },
          {
            model: Face_Width,
            required: false,
          },
          {
            model: Shape,
            required: false,
          },
          {
            model: Material,
            required: false,
          },
          {
            model: Frame_Type,
            required: false,
          },
          {
            model: Colour,
            required: false,
          },
          {
            model: Colour,
            as: "lens_color",
            required: false,
          },

          {
            model: Rating_Reviews,
            include: [
              {
                model: Users,
              },
            ],
          },
        ],
        where: {
          id: req?.params?.id,
        },
      });

      if (!result) {
        return Base.sendResponse(res, HTTPS.NOT_FOUND, {
          message: "Product not found",
        });
      }

      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      console.error("Error in home products:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
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

  async SendWhatapp(req, res) {
    try {
      const { product_id } = req.body;

      // Get logged in user
      const customer = await Users.findOne({
        where: { id: req.user.user_id },
      });

      if (!customer) {
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found");
      }

      // Get product
      const product = await Product.findOne({
        where: { id: product_id },
      });

      if (!product) {
        return Base.sendError(res, HTTPS.NOT_FOUND, "Product not found");
      }

      const datanotification = {
        message: `A customer send enquiry for the "${product.name}" on the website.`,
        status: true,
        seen_status: false,
      };
      await Admin_Notifiction.create(datanotification);

      // Get admin whatsapp number from app setup
      const appset = await App_Setup.findOne();

      const adminPhone = appset?.contact_no;
      const customerPhone = customer?.contact_no;

      // Product Inquiry Message
      const message = `
🔎 *New Product Inquiry — Bapat Optics*

👤 Customer: ${customer.name}
📞 Mobile: ${customer.mobile}

🛍️ Product: ${product.name}
🆔 Product ID: ${product.id}

Customer is interested in this product. Please contact them.
`;

      // Send to Admin
      if (adminPhone) {
        await sendWatsapp(adminPhone, message);
      }

      // Optional — send confirmation to customer
      const customerMessage = `
👋 Hello ${customer.name},

Thank you for your interest in *${product.name}*.

Our team will contact you shortly with more details.

💛 Bapat Optics
`;

      if (customerPhone) {
        await sendWatsapp(customerPhone, customerMessage);
      }

      return Base.sendResponse(res, HTTPS.CREATED, {
        message: "Inquiry sent successfully",
      });
    } catch (error) {
      console.error("WhatsApp Error:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async SendWhatappContactUs(req, res) {
    try {
      // Get logged in user
      const customer = await Users.findOne({
        where: { id: req.user.user_id },
      });

      if (!customer) {
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found");
      }

      const datanotification = {
        message: `A new enquiry has been submitted by customer "${customer.name}".`,
        status: true,
        seen_status: false,
      };

      await Admin_Notifiction.create(datanotification);

      // Get admin whatsapp number from app setup
      const appset = await App_Setup.findOne();

      const adminPhone = appset?.contact_no;
      const customerPhone = customer?.contact_no;

      // Product Inquiry Message
      const message = `
🔎Hello, I visited your website and would like to get more information. 
Please assist me with my enquiry. Thank you.
`;

      // Send to Admin
      if (adminPhone) {
        await sendWatsapp(adminPhone, message);
      }

      // Optional — send confirmation to customer
      const customerMessage = `
Hello ${customer?.name},

Thank you for contacting us. We have received your enquiry and our team will get back to you shortly.

If you have any additional information to share, please feel free to reply to this message.

Best regards,
Support Team
`;

      if (customerPhone) {
        await sendWatsapp(customerPhone, customerMessage);
      }

      return Base.sendResponse(res, HTTPS.CREATED, {
        message: "Inquiry sent successfully",
      });
    } catch (error) {
      console.error("WhatsApp Error:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async allProductsGroupByCategory(req, res) {
    try {
      const brand_id = req.query.brand_id || "";
      const product_name = req.query.product_name || "";
      const p_category_id = req.query.p_category_id || "";
      const whereClause = {
        status: true,
        approval_status_id: IDS.ApprovalStatus.Approved,
      };
      if (product_name) {
        whereClause.name = { [Op.like]: `%${product_name}%` };
      }
      let whereCategory = { status: true };
      if (p_category_id) {
        whereCategory.id = p_category_id;
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
        where: whereCategory,
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
              // {
              //   model: Product_Variant_Stock,
              // },
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

  async getSuggestions(req, res) {
    console.log("IN");
    try {
      const { categoryId, keyword } = req.query;
      
      // 1. Return empty array if keyword is missing
      if (!keyword || keyword.trim().length === 0) {
        return Base.sendResponse(res, HTTPS.OK, []);
      }

      // 2. Parse categoryId to integer or pass null so the procedure searches all categories
      const catId = categoryId ? parseInt(categoryId, 10) : null;

      // 3. Prepare the CALL statement
      const results = await sequelize.query(
        "CALL SearchProductsByCategoryAndName(:keyword)",
        {
          replacements: {
            keyword: keyword.trim(),
          },
          type: sequelize.QueryTypes.RAW,
        }
      );

      // 4. Return formatted response consistent with the controller
      return Base.sendResponse(res, HTTPS.OK, results);
    } catch (err) {
      console.error("Error in getSuggestions stored procedure:", err);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, err);
    }
  }
  
}

module.exports = new HomeController();
