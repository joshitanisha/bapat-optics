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
const { HTTPS } = require("../../../../../helper/https-status-codes/https-status-codes");
const { Home_Banner, Advertisement_Banner, s_category, Help_Message,Store_Banner, sequelize } = require("../../../../../models/index");
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
            }
            const result = await Help_Message.create(data);

            return Base.sendResponse(res, HTTPS.OK, result);
        } catch (error) {
            console.error("Error in Getting App setups:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
        }
    }



}

module.exports = new HomeController();
