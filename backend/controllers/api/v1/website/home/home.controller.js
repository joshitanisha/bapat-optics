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
  Home_Banner,
  Advertisement_Banner,
  s_category,
  Career,
  Help_Message,
  Notification,
  Product,
  Product_Order_Detail,
  Users,
  Product_Order,
  Plans,
  Store_Banner,
  JobType,
  Shift,
  Career_Resume,
  sequelize,
  Language,
  Qualification,
  Career_Qualification,
  Career_language,
  Terms_And_Condition,
  Privacy_Policy,
  Refund_Policy,
  All_Banner,
  p_category,
  Header_News,
  Gender,
  Trending_Product,
  Shipping_Policy,
  Admin_Notifiction,
  Subscriber,
} = require("../../../../../models/index");
const { Op } = require("sequelize");

class HomeController {
  async allHomeBanners(req, res) {
    try {
      // Fetch user with roles and permissions
      const data = await Home_Banner.findAll({
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

  async allHeaderNews(req, res) {
    try {
      // Fetch user with roles and permissions
      const data = await Header_News.findAll({
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

  async allTrandingProduct(req, res) {
    try {
      // Fetch user with roles and permissions
      const data = await Trending_Product.findAll({
        include: [
          {
            model: Product,
            where: {
              status: true,
            },
          },
          { model: Gender },
        ],
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

  async allBanners(req, res) {
    try {
      const banner_type_id = req.params.id || "";

      const whereClause = { status: true };
      if (banner_type_id) {
        whereClause.banner_type_id = banner_type_id;
      }
      const data = await All_Banner.findOne({
        include: [{ model: p_category }],
        where: whereClause,
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Units:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allStoreBanners(req, res) {
    try {
      const data = await Store_Banner.findOne({
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

  async allTermsandConditions(req, res) {
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

  async allPrivacyPolicy(req, res) {
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
  async findAllShippingPolicy(req, res) {
    try {
      const data = await Shipping_Policy.findOne({
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

  async allRefundPolicy(req, res) {
    try {
      const data = await Refund_Policy.findOne({
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

  async allAddBanners(req, res) {
    try {
      // Fetch user with roles and permissions
      const data = await Advertisement_Banner.findAll({
        where: {
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Add Banners:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allStoreCategories(req, res) {
    try {
      // Fetch user with roles and permissions
      const data = await s_category.findAll({
        where: {
          status: true,
        },
      });

      return Base.sendResponse(res, HTTPS.FOUND, data);
    } catch (error) {
      console.error("Error in Store category:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async PostHelpMessage(req, res) {
    try {
      const data = {
        message: req?.body?.message,
        user_id: req?.user?.user_id,
      };
      const result = await Help_Message.create(data);

      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      console.error("Error in Getting App setups:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async allCareers(req, res) {
    try {
      // Fetch user with roles and permissions
      const data = await Career.findAll({
        include: [
          { model: JobType },
          { model: Shift },
          {
            model: Career_language,
            include: [
              {
                model: Language,
              },
            ],
          },
          {
            model: Career_Qualification,
            include: [
              {
                model: Qualification,
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Units:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async getCareer(req, res) {
    try {
      const data = await Career.findOne({
        where: { id: req.params.id },
        include: [
          { model: JobType },
          { model: Shift },
          {
            model: Career_language,
            include: [
              {
                model: Language,
              },
            ],
          },
          {
            model: Career_Qualification,
            include: [
              {
                model: Qualification,
              },
            ],
          },
        ],
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Units:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async postCareer(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        name: req?.body?.name,
        career_id: req?.body?.career_id,
      };

      if (req.files && req.files.resume) {
        data.resume = await File_Uploade(
          req.files?.resume,
          "/uploads/masters/career",
        );
      }

      const newResume = await CreateNew(Career_Resume, data, t);
      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        newResume,
        "Resume Created successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error creating Resume:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async allNotifications(req, res) {
    try {
      // Fetch user with roles and permissions
      const data = await Notification.findAll({
        include: [
          { model: Users },
          {
            model: Product_Order,
            include: [
              {
                model: Product_Order_Detail,
                include: [
                  {
                    model: Product,
                  },
                ],
              },
            ],
          },
          { model: Plans },
        ],
        order: [["createdAt", "DESC"]],
        where: { user_id: req.user.user_id, status: 1 },
      });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in Notifications :", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async NotificationStatus(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      console.log(id, "idididid");

      const result = await CheckExits(Notification, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Notification,
        { status: result.status ? false : true },
        { id },
        t,
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Blog status updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Blog status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async postSubscriber(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        email: req?.body?.email?.trim(),
      };
      const newSubscriber = await CreateNew(Subscriber, data, t);
      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        newSubscriber,
        "Subscriber Created Successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error Creating Subscriber:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async postProductSearch(req, res) {
    const t = await sequelize.transaction();
    try {
      const datanotification = {
        message: `A customer searched for the "${req.body.name}" on the website.`,
        status: true,
        seen_status: false,
      };

      await CreateNew(Admin_Notifiction, datanotification, t);

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.OK,

        "Search History Created Successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error Creating Subscriber:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new HomeController();
