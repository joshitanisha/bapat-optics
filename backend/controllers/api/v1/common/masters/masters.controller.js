const { Sequelize, Op, where } = require("sequelize");
const Base = require("../../../../../helper/exception_handling");
const {
  HTTPS,
} = require("../../../../../helper/https-status-codes/https-status-codes");
const IDS = require("../../../../../helper/fix_ids");
const {
  InvoiceGenerater,
  InvoiceGeneraterNormal,
  InvoiceGeneraterReturn,
  InvoiceGeneraterCancel,
} = require("../../../../../helper/invoice_generater");
const {
  Users,
  Country,
  State,
  City,
  Appointment_Reason,
  Pincode,
  Area,
  p_category,
  p_sub_category,
  p_child_category,
  Permissions,
  Roles,
  Store_Detail,
  Unit,
  Brand,
  Payment_Type,
  Home_Banner,
  Product,
  Order_status,
  Product_Order,
  Time_Slot,
  Image_Gallery,
  Delivery_Boy_Detail,
  Vendors_Delivery_Boy,
  Store_Payment_Method,
  Cancel_Reason,
  Return_Reason,
  Store_Brand,
  Faq_Category,
  Return_Order,
  About_Us,
  Terms_And_Condition,
  Privacy_Policy,
  Faq,
  Product_Variant,
  Stock_Type,
  Pack_Type,
  App_Setup,
  Social_Link,
  Reject_Reason,
  Discount_Type,
  Country_Code,
  RefundOrders,
  Replace_Order,
  Delivery_Type,
  Doctor_Details,
  Farmer,
  Plan_Feture,
  Address_Type,
  Payment_Method,
  Days,
  Review_Reason,
  Help,
  Collection_Center,
  Crop,
  Supplier,
  Colour,
  Frame_Type,
  Face_Width,
  Material,
  Shape,
  Gender,
  Lens_Option,
  Miscellaneous_Reason,
  Career,
  Shift,
  JobType,
  Language,
  Qualification,
  Product_Order_Detail,
  Offer,
  Coupon_Type,
  LensCategory,
  LensType,
  Addon,
  Stocks,
  Banner_Type,
  Brand_Category,
  Coating,
  Color_Category,
  Prescription_Master,
  Coupon,
  sequelize,
} = require("../../../../../models/index");
const pincode = require("../../../../../models/pincode");
const cancel_reason = require("../../../../../models/cancel_reason");
const { status } = require("../../admin/role_and_prmissions/roles.controller");
const { Paginate } = require("../../../../../helper/common/utils/dbUtils");
const axios = require("axios");
class MasterController {
  async allPermissions(req, res) {
    try {
      const data = await Permissions.findAll({
        where: {
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Permissions:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allRoles(req, res) {
    try {
      const data = await Roles.findAll({
        where: {
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Roles:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allCountry(req, res) {
    try {
      const data = await Country.findAll({
        where: { status: true },
      });
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in countryDetails:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async CountryByName(req, res) {
    try {
      const data = await Country.findOne({
        where: {
          name: {
            [Op.like]: `%${req?.body?.name}%`,
          },
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in allCountryByName:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async CityByName(req, res) {
    try {
      const data = await City.findOne({
        where: {
          name: {
            [Op.like]: `%${req?.body?.name}%`,
          },
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in CityByName:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allState(req, res) {
    try {
      const data = await State.findAll({
        where: {
          status: true,
          country_id: req.params.id,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in countryDetails:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allStateWithputId(req, res) {
    try {
      const data = await State.findAll({
        where: {
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in countryDetails:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allCity(req, res) {
    try {
      const data = await City.findAll({
        where: {
          status: true,
          state_id: req.params.id,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in countryDetails:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allCityWithOutId(req, res) {
    try {
      const data = await City.findAll({
        where: {
          status: true,
          // state_id: req.params.id,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in countryDetails:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allCareer(req, res) {
    try {
      const data = await Career.findAll({
        // where: {
        //   status: true,
        //   job_type_id: req.params.job_type_id,
        //   shift_type_id:req.params.shift_type_id,
        // },
        // include: [
        //   {
        //     model: JobType,
        //   },
        //   {
        //     model: Shift,
        //   }
        // ],
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in countryDetails:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allShift(req, res) {
    try {
      const data = await Shift.findAll({
        attribute: ["id", "name"],
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in countryDetails:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allJobType(req, res) {
    try {
      const data = await JobType.findAll({
        attribute: ["id", "name"],
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in countryDetails:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allLanguage(req, res) {
    try {
      const data = await Language.findAll({
        attribute: ["id", "name"],
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in countryDetails:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allQualification(req, res) {
    try {
      const data = await Qualification.findAll({
        attribute: ["id", "name"],
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in countryDetails:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allCityByCountry(req, res) {
    try {
      const data = await City.findOne({
        include: [
          {
            model: Store_Detail,
            where: { status: true },
          },
        ],
        where: {
          status: true,
          country_id: req.params.id,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in countryDetails:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allPincode(req, res) {
    try {
      const data = await Pincode.findAll({
        where: {
          status: true,
          city_id: req.params.id,
        },
      });
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in countryDetails:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allArea(req, res) {
    try {
      const data = await Area.findAll({
        where: {
          status: true,
          pincode_id: req.params.id,
        },
      });
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in countryDetails:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allFarmer(req, res) {
    try {
      const data = await Farmer.findAll({
        // include: [
        //   {
        //     model: Store_Detail,
        //     where: { approval_status_id: IDS.ApprovalStatus.Approved },
        //   },
        // ],
        where: { status: true },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Vendors List:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }
  async allDoctor(req, res) {
    const category_id = req.query.category_id || "";
    try {
      // const data = await Users.findAll({
      //   // include: [
      //   //   {
      //   //     model: Store_Detail,
      //   //     where: { approval_status_id: IDS.ApprovalStatus.Approved },
      //   //   },
      //   // ],
      //   where: { status: true, role_id: IDS.RoleId.Doctor },
      // });

      // return Base.sendResponse(res, HTTPS.OK, data);
      const options = {
        include: [
          {
            model: Doctor_Details,
            ...(category_id && {
              where: { category_id: category_id },
            }),
          },
        ],
        where: {
          status: true,
          role_id: IDS.RoleId.Doctor,
        },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Users, options, req, res, Op);
    } catch (error) {
      console.error("Error in Vendors List:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allsingleDoctor(req, res) {
    try {
      const data = await Users.findOne({
        include: [{ model: Doctor_Details }],

        where: { id: req.params.id },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Vendors List:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allCustomers(req, res) {
    try {
      const data = await Users.findAll({
        where: {
          status: true,
          role_id: IDS.RoleId.Customer,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Vendors List:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allDeliveryBoys(req, res) {
    try {
      const data = await Users.findAll({
        include: [
          {
            model: Delivery_Boy_Detail,
            where: {
              approval_status_id: IDS.ApprovalStatus.Approved,
            },
          },
        ],
        where: {
          status: true,
          role_id: IDS.RoleId.DeliveryBoy,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Vendors List:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allPCategory(req, res) {
    try {
      const whereCondition = {
        status: true,
      };

      if (!req.query.admin) {
        // Only apply customer_view filter for non-admin
        whereCondition.customer_view = true;
      }

      const data = await p_category.findAll({
        where: whereCondition,
        order: [["sort_order", "ASC"]],
        // order: sequelize.literal("RAND()"),
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Products Category Details:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allLensType(req, res) {
    try {
      const whereCondition = {
        status: true,
      };

      const data = await LensType.findAll({
        where: whereCondition,
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Products Category Details:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allLensCategory(req, res) {
    try {
      const whereCondition = {
        status: true,
      };

      const data = await LensCategory.findAll({
        where: whereCondition,
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Products Category Details:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allPSubCategory(req, res) {
    try {
      const data = await p_sub_category.findAll({
        where: {
          status: true,
          p_category_id: req.params.id,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Products Category Details:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }
  async getAllDays(req, res) {
    try {
      const data = await Days.findAll({
        // where: {
        //   status: true,
        // },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Products Category Details:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }
  async getAllPlanFeture(req, res) {
    try {
      const data = await Plan_Feture.findAll({
        where: {
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Products Category Details:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }
  async getAllCollectionCenter(req, res) {
    try {
      const data = await Collection_Center.findAll({
        where: {
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Products Category Details:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async getMiscellaneousReason(req, res) {
    try {
      const data = await Miscellaneous_Reason.findAll({
        where: {
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Products Category Details:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }
  async getAllCrop(req, res) {
    try {
      const data = await Crop.findAll({
        where: {
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Products Category Details:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allPChildCategory(req, res) {
    try {
      const data = await p_child_category.findAll({
        where: {
          status: true,
          p_sub_category_id: req.params.id,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Products Category Details:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allTimeSlot(req, res) {
    try {
      const data = await Time_Slot.findAll({
        where: {
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Products:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allReviewReason(req, res) {
    try {
      const data = await Review_Reason.findAll({
        where: {
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Products:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }
  async allSingleFarmer(req, res) {
    try {
      const data = await Farmer.findOne({
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
        where: { id: req.params.id },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Vendors List:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allLensOption(req, res) {
    try {
      const data = await Lens_Option.findAll({
        where: {
          status: true,
          lens_id: req.params.id,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Products:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allPSubCategories(req, res) {
    try {
      const pCategoryIds = req?.body?.p_category_id;

      if (!Array.isArray(pCategoryIds) || pCategoryIds.length === 0) {
        return Base.sendError(
          res,
          HTTPS.BAD_REQUEST,
          "Product category IDs must be a non-empty array.",
        );
      }

      const data = await p_sub_category.findAll({
        where: {
          status: true,
          p_category_id: { [Op.in]: pCategoryIds },
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Products Category Details:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
  async allProducts(req, res) {
    try {
      const p_category_id = req?.query?.p_category_id || "";

      let whereClause = { status: true };

      if (p_category_id) {
        whereClause.p_category_id = p_category_id;
      }

      const data = await Product.findAll({
        include: [
          { model: Brand },
          { model: Colour },
          { model: Coating },
          {
            model: Colour,
            as: "lens_color",
            required: false,
          },
        ],
        where: whereClause,
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Products:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allProductsStockAvailble(req, res) {
    try {
      const p_category_id = req?.query?.p_category_id || "";

      let whereClause = { status: true };

      if (p_category_id) {
        whereClause.p_category_id = p_category_id;
      }

      const data = await Product.findAll({
        include: [
          { model: Brand },
          {
            model: Stocks,
            where: { stock_status_id: IDS?.StockStatus?.Available },
          },
          { model: Colour },
          { model: Coating },
          {
            model: Colour,
            as: "lens_color",
            required: false,
          },
        ],
        where: whereClause,
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Products:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }
  async allsingleProducts(req, res) {
    try {
      const data = await Product.findAll({
        where: {
          status: true,
          p_category_id: req.params.id,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Products:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allProductsVarient(req, res) {
    try {
      const data = await Product_Variant.findAll({
        where: {
          status: true,
          product_id: req.params.id,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Products:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allUnits(req, res) {
    try {
      const data = await Unit.findAll({
        where: {
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Units:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allAddressType(req, res) {
    try {
      const data = await Address_Type.findAll({
        where: {
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Units:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allBrands(req, res) {
    try {
      const category_id = req.query.category_id || "";

      const whereClause = {};

      if (category_id) {
        const ids = category_id
          .split(",")
          .map((id) => Number(id))
          .filter((id) => !isNaN(id)); // ✅ remove NaN

        if (ids.length > 0) {
          whereClause.category_id = { [Op.in]: ids };
        }
      }

      const data = await Brand.findAll({
        include: [
          {
            model: Brand_Category,
            where: whereClause,
            required: Object.keys(whereClause).length > 0, // ✅ inner join only if filter exists
          },
        ],
        where: {
          status: true,
        },
        order: [["name", "ASC"]],
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in allBrands:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allBrandsCustomerView(req, res) {
    try {
      const category_id = req.query.category_id || "";
      const whereClause = {};
      if (category_id) {
        const ids = category_id.split(",").map(Number);

        whereClause.category_id = { [Op.in]: ids };
      }
      const data = await Brand.findAll({
        include: [{ model: Brand_Category, where: whereClause }],
        where: {
          customer_view: true,
          status: true,
        },
        order: [["name", "ASC"]],
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Units:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allBrandsWeb(req, res) {
    try {
      const category_id = req.query.category_id || "";
      const whereClause = {};
      if (category_id) {
        const ids = category_id.split(",").map(Number);

        whereClause.category_id = { [Op.in]: ids };
      }
      const data = await Brand.findAll({
        include: [{ model: Brand_Category, where: whereClause }],
        where: {
          customer_view: true,
          status: true,
        },
        order: [["name", "ASC"]],
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Units:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allPaymentMethods(req, res) {
    try {
      const data = await Payment_Method.findAll({
        where: {
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Payment Methods:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allPackTypes(req, res) {
    try {
      const data = await Pack_Type.findAll({
        where: {
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Pack Type:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allStockTypes(req, res) {
    try {
      const data = await Stock_Type.findAll({
        where: {
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Pack Type:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async getallCountsStoreStatus(req, res) {
    try {
      const Pending = await Store_Detail.count({
        where: {
          approval_status_id: IDS.ApprovalStatus.Pending,
        },
      });

      const Approved = await Store_Detail.count({
        where: {
          approval_status_id: IDS.ApprovalStatus.Approved,
        },
      });

      const Rejected = await Store_Detail.count({
        where: {
          approval_status_id: IDS.ApprovalStatus.Rejected,
        },
      });

      const OnHold = await Store_Detail.count({
        where: {
          approval_status_id: IDS.ApprovalStatus.OnHold,
        },
      });

      const UnderReview = await Store_Detail.count({
        where: {
          approval_status_id: IDS.ApprovalStatus.UnderReview,
        },
      });

      const data = {
        Pending: Pending,
        Approved: Approved,
        Rejected: Rejected,
        OnHold: OnHold,
        UnderReview: UnderReview,
      };

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Store Category Details:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async getallCountsProducts(req, res) {
    try {
      const type = req?.query?.type || "";
      const store_id = req?.query?.store_id || "";

      const Pending = await Product.count({
        include: [
          {
            model: Store_Detail,
            where: {
              ...(req?.user?.role_id === IDS.RoleId.Vendor
                ? { id: req?.user?.store_id }
                : {}),
              ...(type === "Food"
                ? { s_category_id: 1 }
                : { s_category_id: { [Op.ne]: 1 } }),
              ...(store_id ? { id: store_id } : {}),
            },
          },
        ],
        where: {
          approval_status_id: IDS.ApprovalStatus.Pending,
        },
      });

      const Approved = await Product.count({
        include: [
          {
            model: Store_Detail,
            where: {
              ...(req?.user?.role_id === IDS.RoleId.Vendor
                ? { id: req?.user?.store_id }
                : {}),
              ...(type === "Food"
                ? { s_category_id: 1 }
                : { s_category_id: { [Op.ne]: 1 } }),
              ...(store_id ? { id: store_id } : {}),
            },
          },
        ],
        where: {
          approval_status_id: IDS.ApprovalStatus.Approved,
        },
      });

      const Rejected = await Product.count({
        include: [
          {
            model: Store_Detail,
            where: {
              ...(type === "Food"
                ? { s_category_id: 1 }
                : { s_category_id: { [Op.ne]: 1 } }),
              ...(req?.user?.role_id === IDS.RoleId.Vendor
                ? { id: req?.user?.store_id }
                : {}),
              ...(store_id ? { id: store_id } : {}),
            },
          },
        ],
        where: {
          approval_status_id: IDS.ApprovalStatus.Rejected,
        },
      });

      const data = {
        Pending: Pending,
        Approved: Approved,
        Rejected: Rejected,
      };

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Product Details:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allPCategoryVendor(req, res) {
    try {
      const data = await p_category.findAll({
        // include: [
        //   {
        //     model: Store_Product_Category,
        //     where: {
        //       store_detail_id: req?.user?.store_id,
        //     },
        //   },
        // ],
        where: { status: true },
      });

      // Send success response
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in fetching Vendors Product Category:", error);

      // Send detailed error response (optional)
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, {
        message: "An error occurred while Vendors Product Category.",
        error: error.message, // Send the actual error message for debugging (optional, but can help)
      });
    }
  }

  async allPSubCategoryVendor(req, res) {
    try {
      const data = await p_sub_category.findAll({
        // include: [
        //   {
        //     model: S_P_Sub_Category,
        //     where: {
        //       store_detail_id: req?.user?.store_id,
        //     },
        //     include: [
        //       {
        //         model: Store_Product_Category,
        //         where: { p_category_id: req?.params?.id, status: true },
        //       },
        //     ],
        //   },
        // ],
        where: { p_category_id: req?.params?.id, status: true },
      });

      // Send success response
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in fetching Vendors Product Category:", error);

      // Send detailed error response (optional)
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, {
        message: "An error occurred while Vendors Product Category.",
        error: error.message, // Send the actual error message for debugging (optional, but can help)
      });
    }
  }

  async allOrderStatus(req, res) {
    try {
      const data = await Order_status.findAll({
        where: {
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Payment Methods:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allGalleryImages(req, res) {
    try {
      const data = await Image_Gallery.findAll({
        where: {
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Gallery Images:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async getallsupplier(req, res) {
    try {
      const data = await Supplier.findAll({
        where: {
          status: true,
        },
        paranoid: false,
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Gallery Images:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async getallGooglePlace(req, res) {
    const { input } = req.query;

    try {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;

      const result = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&components=country:in&key=${apiKey}`,
      );

      // Extract only the predictions array
      const places = result.data.predictions;

      // Send only the places array as the response
      return res.send({ places });
    } catch (error) {
      console.error("Error fetching places:", error);
      res.status(500).json({ error: "Failed to fetch places data" });
    }
  }

  async getallCountsOrderStatus(req, res) {
    try {
      const Pending = await Product_Order.count({
        // include: [{ model: Product_Order_Detail, where: { status: true } }],
        where: {
          order_status_id: IDS.order_status.Pending,
        },
      });

      const Processing = await Product_Order.count({
        where: {
          order_status_id: IDS.order_status.Processing,
        },
      });

      const PickupScheduled = await Product_Order.count({
        where: {
          order_status_id: IDS.order_status.PickupScheduled,
        },
      });

      const Shipped = await Product_Order.count({
        where: {
          order_status_id: IDS.order_status.Shipped,
        },
      });

      const Delivered = await Product_Order.count({
        where: {
          order_status_id: IDS.order_status.Delivered,
        },
      });

      const Cancelled = await Product_Order.count({
        where: {
          order_status_id: IDS.order_status.Cancelled,
        },
      });
      const Rejected = await Product_Order_Detail.count({
        where: {
          status: false,
        },
      });

      const Returned = await Product_Order_Detail.count({
        where: {
          return_status: false,
        },
      });

      const Replaced = await Product_Order.count({
        where: {
          order_status_id: IDS.order_status.Replaced,
        },
      });

      const ReturnRequested = await Product_Order.count({
        include: [
          {
            model: Return_Order,
            where: {
              return_status_id: IDS.return_status.ReturnRequested,
            },
          },
        ],
      });

      const ReturnPickupScheduled = await Product_Order.count({
        include: [
          {
            model: Return_Order,
            where: {
              return_status_id: IDS.return_status.PickupScheduled,
            },
          },
        ],
      });

      const ReturnItemPicked = await Product_Order.count({
        include: [
          {
            model: Return_Order,
            where: {
              return_status_id: IDS.return_status.ItemPicked,
            },
          },
        ],
      });

      // const Returned = await Product_Order.count({
      //   include: [
      //     {
      //       model: Return_Order,
      //       where: {
      //         return_status_id: IDS.return_status.Returned,
      //       },
      //     },
      //   ],
      // });

      const ReturnRejected = await Product_Order.count({
        include: [
          {
            model: Return_Order,
            where: {
              return_status_id: IDS.return_status.ReturnRejected,
            },
          },
        ],
      });

      const RefundRequest = await RefundOrders.count({
        include: [
          {
            model: Product_Order,
          },
        ],
        where: {
          payment_status: null,
        },
      });

      const RefundAccepted = await RefundOrders.count({
        include: [
          {
            model: Product_Order,
          },
        ],
        where: {
          payment_status: 1,
        },
      });

      const RefundRejected = await RefundOrders.count({
        include: [
          {
            model: Product_Order,
          },
        ],
        where: {
          payment_status: 0,
        },
      });

      const data = {
        Pending: Pending,
        Processing: Processing,
        PickupScheduled: PickupScheduled,
        Shipped: Shipped,
        Delivered: Delivered,
        Cancelled: Cancelled,
        Rejected: Rejected,
        Replaced: Replaced,
        ReturnRequested: ReturnRequested,
        ReturnPickupScheduled: ReturnPickupScheduled,
        ReturnItemPicked: ReturnItemPicked,
        Returned: Returned,
        ReturnRejected: ReturnRejected,
        RefundRequest: RefundRequest,
        RefundAccepted: RefundAccepted,
        RefundRejected: RefundRejected,
      };

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Product Details:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allDeliveryBoysVendor(req, res) {
    try {
      const result = await Store_Detail.findAll({
        include: [
          {
            model: Vendors_Delivery_Boy,
            where: { delivery_boy_id: req?.params?.id },
          },
        ],
        where: {
          status: true,
        },
      });

      const data = result?.map((item) => ({
        id: item.id,
        name: item.store_name,
      }));

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Vendor Delivery Boy Masters:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async getallCountsDeliveryBoy(req, res) {
    try {
      const Pending = await Users.count({
        include: [
          {
            model: Delivery_Boy_Detail,
            where: {
              approval_status_id: IDS.ApprovalStatus.Pending,
            },
          },
        ],
        where: {
          role_id: IDS.RoleId.DeliveryBoy,
        },
      });

      const Approved = await Users.count({
        include: [
          {
            model: Delivery_Boy_Detail,
            where: {
              approval_status_id: IDS.ApprovalStatus.Approved,
            },
          },
        ],
        where: {
          role_id: IDS.RoleId.DeliveryBoy,
        },
      });
      const Rejected = await Users.count({
        include: [
          {
            model: Delivery_Boy_Detail,
            where: {
              approval_status_id: IDS.ApprovalStatus.Rejected,
            },
          },
        ],
        where: {
          role_id: IDS.RoleId.DeliveryBoy,
        },
      });

      const data = {
        Pending: Pending,
        Approved: Approved,
        Rejected: Rejected,
      };

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Counting Delivery Boy Status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  // async getallDeliveryBoy(req, res) {
  //   try {
  //     const country_id = req?.query?.country_id || "";
  //     const state_id = req?.query?.state_id || "";
  //     const city_id = req?.query?.city_id || "";
  //     const pincode_id = req?.query?.pincode_id || "";
  //     const gender_id = req?.query?.gender_id || "";

  //     const result = await Users.finAll({
  //       include: [
  //         {
  //           model: Delivery_Boy_Detail,
  //           include: [
  //             {
  //               model: Country,
  //             },
  //             {
  //               model: State,
  //             },
  //             {
  //               model: City,
  //             },
  //             {
  //               model: Pincode,
  //             },
  //           ],
  //           where: {
  //             ...(country_id ? { country_id } : {}),
  //             ...(state_id ? { state_id } : {}),
  //             ...(city_id ? { city_id } : {}),
  //             ...(pincode_id ? { pincode_id } : {}),
  //             approval_status_id: IDS.ApprovalStatus.Approved,
  //           },
  //         },
  //       ],
  //       where: {
  //         role_id: IDS.RoleId.DeliveryBoy,
  //         ...(gender_id ? { gender_id } : {}),
  //       },
  //     });

  //     return Base.sendResponse(res, HTTPS.OK, result);
  //   } catch (error) {
  //     console.error("Error in Counting Delivery Boy Status:", error);
  //     return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
  //   }
  // }

  // async allStorePaymentMethods(req, res) {
  //   try {
  //     // Fetch store payment methods with associated payment types
  //     const result = await Store_Payment_Method.findAll({
  //       include: [
  //         {
  //           model: Payment_Type,
  //         },
  //       ],
  //       where: {
  //         store_detail_id: req?.params?.id,
  //         status: true,
  //       },
  //     });

  //     // Process the result to extract necessary data
  //     const data = result?.map((item) => {
  //       return {
  //         id: item?.payment_type_id,
  //         name: item?.Payment_Type?.name,
  //         image: item?.Payment_Type?.image,
  //       };
  //     });

  //     return Base.sendResponse(res, HTTPS.OK, data);
  //   } catch (error) {
  //     console.error("Error in store payment methods Masters:", error);
  //     return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
  //   }
  // }

  // async allVendorsAddOnCategories(req, res) {
  //   try {
  //     const store_id = req?.query?.store_id || "";

  //     const data = await Food_Add_On_Category.findAll({
  //       include: [
  //         {
  //           model: Food_Add_On,
  //           where: {
  //             status: true,
  //             store_id,
  //           },
  //         },
  //       ],
  //       where: {
  //         status: true,
  //         store_id,
  //       },
  //     });

  //     return Base.sendResponse(res, HTTPS.OK, data);
  //   } catch (error) {
  //     console.error("Error in Cancel Reason List:", error);
  //     return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
  //   }
  // }

  // async allVendorsAddOns(req, res) {
  //   try {
  //     const store_id = req?.query?.store_id || "";
  //     const add_on_category_id = req?.query?.add_on_category_id || "";

  //     const data = await Food_Add_On.findAll({
  //       where: {
  //         status: true,
  //         store_id,
  //         add_on_category_id,
  //       },
  //     });

  //     return Base.sendResponse(res, HTTPS.OK, data);
  //   } catch (error) {
  //     console.error("Error in Cancel Reason List:", error);
  //     return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
  //   }
  // }

  async allCancelReason(req, res) {
    try {
      const data = await Cancel_Reason.findAll({
        where: {
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Cancel Reason List:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allReturnReason(req, res) {
    try {
      const data = await Return_Reason.findAll({
        where: {
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Return Reason List:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allVendorsBrands(req, res) {
    try {
      const data = await Brand.findAll({
        include: [
          {
            model: Store_Brand,
            where: { store_id: req?.params?.id },
          },
        ],
        where: {
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Stores Brands:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allFaqCategories(req, res) {
    try {
      const data = await Faq_Category.findAll({
        where: {
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Faq Categories:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async getAboutUsContent(req, res) {
    try {
      const data = await About_Us.findOne({
        where: {
          id: 1,
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Faq Categories:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async getT_AND_C(req, res) {
    try {
      const data = await Terms_And_Condition.findOne({
        where: {
          id: 1,
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Faq Categories:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async getPrivacyPolicy(req, res) {
    try {
      const data = await Privacy_Policy.findOne({
        where: {
          id: 1,
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Faq Categories:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async gethelp(req, res) {
    try {
      const data = await Help.findOne({
        where: {
          id: 1,
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Faq Categories:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async getFaqs(req, res) {
    try {
      const data = await Faq.findAll({
        // include: [
        //   {
        //     model: Faq,
        //     where: { status: true },
        //   },
        // ],
        where: { status: true },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Faqs:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allProductsByVariantIds(req, res) {
    try {
      // Ensure variantIds is an array
      const variantIds = Array.isArray(req?.body?.variant_id)
        ? req.body.variant_id
        : [];
      const addOns = Array.isArray(req?.body?.addOns) ? req.body.addOns : [];

      if (variantIds.length === 0) {
        return Base.sendError(res, HTTPS.BAD_REQUEST, {
          message: "Variant IDs are required and should be an array.",
        });
      }

      const data = await Product.findAll({
        include: [
          {
            model: Product_Variant,
            where: {
              id: { [Op.in]: variantIds },
            },
          },
          {
            model: Store_Detail,
          },
        ],
        where: { status: true },
      });

      // Send success response
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in fetching Product by variant id:", error);

      // Send detailed error response
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, {
        message: "An error occurred while getting Product by variant id.",
        error: error.message, // Send the actual error message for debugging
      });
    }
  }

  async getAppSetup(req, res) {
    try {
      // Fetch user with roles and permissions
      const data = await App_Setup.findOne({});
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Getting App setups:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  // async getSocialLinks(req, res) {
  //   try {
  //     // Fetch user with roles and permissions
  //     const data = await Social_Link.findAll({ where: { status: true } });
  //     return Base.sendResponse(res, HTTPS.OK, data);
  //   } catch (error) {
  //     console.error("Error in Getting App setups:", error);
  //     return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
  //   }
  // }

  async getRejectReasons(req, res) {
    try {
      // Fetch user with roles and permissions
      const data = await Reject_Reason.findAll({
        where: {
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Getting Reject_Reason:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async getDiscountType(req, res) {
    try {
      // Fetch user with roles and permissions
      const data = await Discount_Type.findAll({});
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Getting Discount Types:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async getCountryCodes(req, res) {
    try {
      const data = await Country_Code.findAll({ where: { status: true } });
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Getting Country Codes:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async generateOrderInvoice(req, res) {
    try {
      const data = await InvoiceGenerater(req?.params?.id);
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Getting Country Codes:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }
  async allDeliveryType(req, res) {
    try {
      const data = await Delivery_Type.findAll({
        where: {
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Cancel Reason List:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allColor(req, res) {
    try {
      const category_id = req.query.category_id;
      const whereClause = {};

      if (category_id) {
        const ids = category_id
          .split(",")
          .map((id) => Number(id))
          .filter((id) => !isNaN(id)); // 🔥 remove NaN

        if (ids.length > 0) {
          whereClause.category_id = { [Op.in]: ids };
        }
      }

      const data = await Colour.findAll({
        include: [
          {
            model: Color_Category,
            ...(Object.keys(whereClause).length && { where: whereClause }),
          },
        ],
        where: {
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in allColor:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allGender(req, res) {
    try {
      const data = await Gender.findAll({
        attribute: ["id", "name"],
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in countryDetails:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }
  async allFrameType(req, res) {
    try {
      const data = await Frame_Type.findAll({
        attribute: ["id", "name"],
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in countryDetails:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allFaceWidth(req, res) {
    try {
      const data = await Face_Width.findAll({
        attribute: ["id", "name"],
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in countryDetails:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allMaterial(req, res) {
    const category_id = req.query.category_id || "";

    const whereClause = { status: true };

    if (category_id) {
      const ids = category_id
        .split(",")
        .map((id) => Number(id))
        .filter((id) => !isNaN(id)); // ✅ remove NaN

      if (ids.length > 0) {
        whereClause.category_id = { [Op.in]: ids };
      }
    }

    try {
      const data = await Material.findAll({
        where: whereClause,
        attributes: ["id", "name"], // ✅ attributes (not attribute)
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in allMaterial:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allShape(req, res) {
    try {
      const data = await Shape.findAll({
        attribute: ["id", "name"],
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in countryDetails:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allOffer(req, res) {
    try {
      const data = await Offer.findAll({});

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in countryDetails:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allSocialMedia(req, res) {
    try {
      const data = await Social_Link.findAll({ where: { status: true } });
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in allSocialMedia:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async allAppointmentReasons(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const options = {
        where: {
          status: true,
          [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
        },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Appointment_Reason, options, req, res, Op);
    } catch (error) {
      console.error("Error in allAppointmentReasons:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async allCouponType(req, res) {
    try {
      const data = await Coupon_Type.findAll({});
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in allSocialMedia:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async allAddOn(req, res) {
    try {
      const data = await Addon.findAll({
        where: { status: true },
      });
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in allSocialMedia:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async allLenseProduct(req, res) {
    try {
      const id = req.params.id;
      const data = await Product.findAll({
        // include: [
        //   {
        //     model: Stocks,
        //     where: { stock_status_id: IDS.StockStatus.Available },
        //   },
        // ],
        where: { status: true, p_category_id: 1, lens_type_id: id },
      });
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in allSocialMedia:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async allStock(req, res) {
    const product_id = req.params.id;
    try {
      const data = await Stocks.findAll({
        where: { stock_status_id: IDS.StockStatus.Available, product_id },
      });
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in allSocialMedia:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async allStockAvailableSale(req, res) {
    const product_id = req.params.id;
    try {
      const data = await Stocks.findAll({
        where: {
          stock_status_id: {
            [Op.ne]: IDS.StockStatus.Damaged,
          },
          product_id,
        },
      });
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in allSocialMedia:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async ExcelToJson(req, res) {
    try {
      const xlsx = require("xlsx");
      const fs = require("fs");

      // Read the Excel file
      const workbook = xlsx.readFile(
        "E:/KF Node Projects/Bapat Optices/bapat_node/public/sample/Bapat Products2.xlsx",
      );

      // const sheet = workbook.Sheets[workbook.SheetNames[0]];
      // const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });

      // const result = [];
      // let currentProduct = null;
      // let currentVariant = null;

      // rows.forEach((r) => {
      //   if (r.name) {
      //     // new product
      //     currentProduct = { name: r.name.toString(), variants: [] };
      //     result.push(currentProduct);
      //   }
      //   if (r.variant) {
      //     // new variant
      //     currentVariant = {
      //       variant: r.variant.toString(),
      //       stock: Number(r.stock || 0),
      //       items: [],
      //     };
      //     currentProduct.variants.push(currentVariant);
      //   }
      //   // always add item
      //   currentVariant.items.push({
      //     barcode: r.barcode.toString(),
      //     model: r.model.toString(),
      //     images: r.images.toString(),
      //   });
      // });

      // -----------------------------------------------------

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });

      const result = [];
      let currentProduct = null;
      let currentVariant = null;

      rows.forEach((r) => {
        // ---- New product ----
        if (r.name) {
          currentProduct = {
            name: r.name.toString(),
            image: r.image.toString(),
            manufacturer: r.manufacturer.toString(),
            description: r.description.toString(),
            gender: r.gender.toString(),
            shape: r.shape.toString(),
            material: r.material.toString(),
            frame_type: r.frame_type.toString(),
            face_width: r.face_width.toString(),
            tax_percentage: r.tax_percentage,
            p_category: r.p_category.toString(),
            brand: r.brand.toString(),
            made_in: r.made_in.toString(),
            variants: [],
          };
          result.push(currentProduct);
        }

        // ---- New variant ----

        if (r.v_name) {
          currentVariant = {
            v_name: r.v_name.toString(),
            color: r.color.toString(),
            price: r.price.toString(),
            mrp: r.mrp.toString(),
            size: r.size.toString(),
            general_stock: Number(r.general_stock || 0),
            images: [], // images are stored on the variant
            items: [],
          };
          currentProduct.variants.push(currentVariant);
        }

        // ---- Add images to the current variant ----
        if (r.images) {
          const imgs = r.images
            .toString()
            .split(",")
            .map((img) => img.trim())
            .filter(Boolean);
          if (currentVariant) currentVariant.images.push(...imgs);
        }

        // ---- Add item (barcode/model) to current variant ----
        if (r.barcode || r.model) {
          currentVariant.items.push({
            barcode: r.barcode?.toString() || "",
            barcode_image: r.barcode_image?.toString() || "",
            model: r.model?.toString() || "",
          });
        }
      });

      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      console.error("Error:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async allProductsOrderVarient(req, res) {
    try {
      const data = await Product_Variant.findAll({
        where: {
          status: true,
          product_id: req.params.id,
          general_stock: {
            [Sequelize.Op.gt]: 0,
          },
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Products:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }
  async allOrderProducts(req, res) {
    try {
      const data = await Product.findAll({
        include: [
          {
            model: Product_Variant,
            where: {
              general_stock: { [Sequelize.Op.gt]: 0 },
            },
          },
        ],
        where: {
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Products:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async AllBannerType(req, res) {
    try {
      const data = await Banner_Type.findAll({
        where: { status: true },
      });
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in allSocialMedia:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async AllCoating(req, res) {
    try {
      const data = await Coating.findAll({
        where: { status: true },
      });
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in allSocialMedia:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async InvoiceGenerateNormal(req, res) {
    try {
      const { order_id, isAdvance } = req.body;
      const isAdvanceBool = String(isAdvance) === "true" || isAdvance === true;
      const pdf = await InvoiceGeneraterNormal(order_id,isAdvanceBool);
      return Base.sendResponse(res, HTTPS.OK, pdf);
    } catch (error) {
      console.error("Error in allSocialMedia:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
  async InvoiceGenerateReturn(req, res) {
    try {
      const { order_id } = req.body;
      const pdf = await InvoiceGeneraterReturn(order_id);
      return Base.sendResponse(res, HTTPS.OK, pdf);
    } catch (error) {
      console.error("Error in allSocialMedia:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
  async InvoiceGenerateCancel(req, res) {
    try {
      const { order_id } = req.body;
      const pdf = await InvoiceGeneraterCancel(order_id);
      return Base.sendResponse(res, HTTPS.OK, pdf);
    } catch (error) {
      console.error("Error in allSocialMedia:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async PrescriptionValue(req, res) {
    try {
      const name = req.query.name?.trim() || ""; // ✅ match frontend

      // stop if empty search
      if (!name) {
        return Base.sendResponse(res, HTTPS.OK, []);
      }

      const data = await Prescription_Master.findAll({
        where: {
          status: true,
          name: {
            [Op.like]: `%${name}%`,
          },
        },
        order: [["name", "ASC"]], // optional
        limit: 5, // optional (better performance)
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in PrescriptionValue:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async AllPriceRange(req, res) {
    try {
      const lowestPrice = await Product.min("price");
      const highestPrice = await Product.max("price");

      return Base.sendResponse(res, HTTPS.OK, {
        lowest_price: lowestPrice,
        highest_price: highestPrice,
      });
    } catch (error) {
      console.error("Error in AllPriceRange:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async AllCoupon(req, res) {
    try {
      const amount = req.query.amount ? parseFloat(req.query.amount) : null;

      const whereClause = {
        status: true,
      };

      if (amount !== null) {
        whereClause.required_amount = {
          [Op.lte]: amount,
        };
      }

      const options = {
        include: [
          {
            model: Discount_Type,
          },
        ],
        where: whereClause,
        order: [["createdAt", "DESC"]],
      };
      const data = await Coupon.findAll(options);
      return Base.sendResponse(res, HTTPS.OK, {
        data: data,
      });
    } catch (error) {
      console.error("Error fetching Coupons:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new MasterController();
