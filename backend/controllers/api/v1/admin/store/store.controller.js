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
const { Users, Store_Detail, Store_Payment_Method, Store_Product_Category, s_category, Roles, Wallet, Restaurant_Category, Approval_Status, Kyc_Document,
    State, Country, City, Pincode, p_category, p_sub_category, S_P_Sub_Category, Vendors_Delivery_Boy, sequelize } = require("../../../../../models/index");
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");
const IDS = require("../../../../../helper/fix_ids");
const vendors_delivery_boys = require("../../../../../models/vendors_delivery_boys");
const { sendMail } = require("../../../../../helper/NodeMailer");
class SCategoryController {
    // Fetch all countries
    async findAll(req, res) {
        try {
            const name = req.query.term?.trim() || "";
            const approval_status_id = req.query.approval_status_id || "";
            const storeCategory = req.query.storeCategory || "";
            const restaurantCategory = req.query.restaurantCategory || "";
            const sortOrder = req.query.sortOrder || "DESC";

            const options = {
                include: [
                    {
                        model: Store_Detail,
                        include: [
                            {
                                model: s_category,
                            },
                            {
                                model: Restaurant_Category,
                                required: false
                            },
                            {
                                model: Country,
                            },
                            {
                                model: State,
                            },
                            {
                                model: City,
                            },
                            {
                                model: Pincode,
                            },
                            {
                                model: Approval_Status,
                            },
                            {
                                model: Vendors_Delivery_Boy,
                                include: [
                                    {
                                        model: Users,
                                    }
                                ]
                            },
                        ],
                        where: {
                            ...(approval_status_id ? { approval_status_id } : {}),
                            ...(storeCategory ? { s_category_id: storeCategory } : {}),
                            ...(restaurantCategory ? { restaurant_category_id: restaurantCategory } : {}),
                        },
                    },
                    {
                        model: Kyc_Document
                    }
                ],
                where: {
                    // [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
                },
                order: [["createdAt", sortOrder]],
            };
            await Paginate(Users, options, req, res, Op);
        } catch (error) {
            console.error("Error fetching countries:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }

    // Fetch a single country by ID
    async findOne(req, res) {
        const t = await sequelize.transaction();
        try {
            const include = [
                {
                    model: Store_Detail,
                    include: [
                        {
                            model: s_category,
                        },
                        {
                            model: Restaurant_Category,
                        },
                        {
                            model: Store_Product_Category,
                        },
                        {
                            model: Store_Payment_Method,
                        },
                        {
                            model: Approval_Status,
                        },
                        {
                            model: Vendors_Delivery_Boy,
                            include: [
                                {
                                    model: Users,
                                }
                            ]
                        }
                    ],
                },
                {
                    model: Kyc_Document
                }
            ];
            const result = await CheckExits(Users, { id: req.params.id }, t, include);
            if (!result) {
                await t.rollback();
                return Base.sendError(res, HTTPS.NOT_FOUND, "Store not found");
            }
            await t.commit();

           

            return Base.sendResponse(res, HTTPS.OK, result);
        } catch (error) {
            await t.rollback();
            console.error("Error fetching Users:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }

    // Update a country by ID
    // async update(req, res) {
    //     const t = await sequelize.transaction();
    //     try {
    //         const { id } = req.params;

    //         const data = {
    //             name: req.body?.name.trim(),
    //         }

    //         if (req.files && req.files.image) {
    //             data.image = await File_Uploade(req.files?.image, "/uploads/masters/s_category")
    //         }

    //         const exits = await CheckExits(s_category, { name: data.name }, t);

    //         if (exits?.id != id && exits !== null) {
    //             await t.rollback();
    //             return Base.sendError(
    //                 res,
    //                 HTTPS.NOT_ACCEPTABLE,
    //                 "Category name already in use"
    //             );
    //         }

    //         const update = await UpdateData(s_category, data, { id: id, }, t);

    //         await t.commit();
    //         return Base.sendResponse(
    //             res,
    //             HTTPS.ACCEPTED,
    //             "category updated successfully"
    //         );
    //     } catch (error) {
    //         await t.rollback();
    //         console.error("Error updating category:", error);
    //         return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    //     }
    // }

    // Delete a country by ID
    async delete(req, res) {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;

            const user = await CheckExits(Users, { id }, t);

            if (!user) {
                await t.rollback();
                return Base.sendError(res, HTTPS.NOT_FOUND, "Users not found");
            }

            const store_details = await Store_Detail.findAll({
                where: {
                    user_id: id,
                },
                transaction: t,
            });

            for (const detail of store_details) {

                await Store_Product_Category.destroy({
                    where: {
                        store_detail_id: detail.id,
                    },
                    transaction: t,
                });

                await Store_Payment_Method.destroy({
                    where: {
                        store_detail_id: detail.id,
                    },
                    transaction: t,
                });

            }

            await Store_Detail.destroy({
                where: {
                    user_id: id,
                },
                transaction: t,
            });

            await Users.destroy({
                where: {
                    id: id,
                },
                transaction: t,
            });

            await t.commit();
            return Base.sendResponse(res, HTTPS.OK, "Category deleted successfully");
        } catch (error) {
            await t.rollback();
            console.error("Error deleting Category:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }

    // Update the status of a country
    async status(req, res) {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;

            const store = await CheckExits(Store_Detail, { user_id: id }, t);

            if (!store) {
                await t.rollback();
                return Base.sendError(res, HTTPS.NOT_FOUND, "Store not found");
            }

            await UpdateData(
                Store_Detail,
                { status: store.status ? false : true },
                { user_id: id },
                t
            );

            await UpdateData(
                Users,
                { status: store.status ? false : true },
                { id: id },
                t
            );

            await t.commit();

            return Base.sendResponse(
                res,
                HTTPS.OK,
                "Store status updated successfully"
            );
        } catch (error) {
            await t.rollback();
            console.error("Error updating Category status:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }

    async storeStatus(req, res) {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;
            const { approval_status_id } = req?.body;

            const store = await CheckExits(Store_Detail, { user_id: id }, t);
            const user = await CheckExits(Users, { id: id }, t);

            if (!store) {
                await t.rollback();
                return Base.sendError(res, HTTPS.NOT_FOUND, "Store not found");
            }

            await UpdateData(Store_Detail, { approval_status_id: approval_status_id }, { user_id: id }, t);
            await UpdateData(Users,
                { status: approval_status_id == IDS.ApprovalStatus.Approved ? true : false },
                { id: id }, t);


            await t.commit();

            const statusMapping = {
                [IDS.ApprovalStatus.Approved]: "Approved",
                [IDS.ApprovalStatus.Rejected]: "Rejected",
                [IDS.ApprovalStatus.OnHold]: "On Hold",
                [IDS.ApprovalStatus.UnderReview]: "Under Review"
            };

            const store_status = statusMapping[approval_status_id] || "Pending";

            const mailOptions = {
                from: "ankur.jain@profcyma.in",
                to: user?.email,
                subject: "Product Request",
            };

            if (store_status === "Approved") {
                mailOptions.html = `
                    <b>Thank you for Showing Intrest !</b>
                    <p> Your request has been ${store_status} with E-mail ${user?.email}</p>
                    <br> here's the link to Vendor Admin Pannel  :- https://themoon-admin.profcymabackend.com/ 
                    <br> Use Your Email ID and Password You Create at the Time of Registration Request 
                    <br>
                    <h3>We Wish You All The Best !</h3>
                    <br>
                    <br> Thanks and Regard 
                    <br> Ankur Jain
                    <br> Backend Developer 
                    <br> Profcyma
                    <br>   
                    <img src="https://profcyma.com/assets/images/logo/Profcyma-logotwo.png" alt="Profcyma Logo" style="width: 200px; height: 100px;">
                `;
            } else {
                mailOptions.html = `
                   <b>Thank you for Showing Intrest!</b>
                    <p> Your request has been ${store_status} with 
                    <br> Name ${user?.name}</p> 
                    <br> E-mail ${user?.email}</p> 
                    <br> Mobile No ${user?.contact_no}</p> 
                `;
            }

            sendMail(mailOptions);

            return Base.sendResponse(
                res,
                HTTPS.OK,
                "Store status updated successfully"
            );
        } catch (error) {
            // await t.rollback();
            console.error("Error updating Store status:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }

    async CategoryAccept(req, res) {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;

            const result = await CheckExits(p_category, { id }, t);

            if (!result) {
                await t.rollback();
                return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
            }

            await UpdateData(p_category, { status: result.status ? false : true, user_id: 1 }, { id }, t);
            const created = await CreateNew(Store_Product_Category, { store_detail_id: req?.body?.store_detail_id, p_category_id: id }, t);



            await t.commit();

            return Base.sendResponse(res, HTTPS.OK, "Category status updated successfully");
        } catch (error) {
            await t.rollback();
            console.error("Error updating category status:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }

    async SubCategoryAccept(req, res) {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;

            const result = await CheckExits(p_sub_category, { id }, t);
            const checkCategory = await CheckExits(Store_Product_Category, { store_detail_id: req?.body?.store_detail_id, p_category_id: req?.body?.p_category_id }, t);

            if (!checkCategory) {
                await t.rollback();
                return Base.sendError(res, HTTPS.NOT_FOUND, "Category Not Found Or Inactive");
            }

            if (!result) {
                await t.rollback();
                return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
            }

            await UpdateData(p_sub_category, { status: result.status ? false : true, user_id: 1 }, { id }, t);
            const created = await CreateNew(S_P_Sub_Category, { store_detail_id: req?.body?.store_detail_id, s_p_category_id: checkCategory?.id, p_sub_category_id: id }, t);


            await t.commit();

            return Base.sendResponse(res, HTTPS.OK, "Sub Category status updated successfully");
        } catch (error) {
            await t.rollback();
            console.error("Error updating sub category status:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }

    async AssignDeliveryBoys(req, res) {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;

            if (req.body.delivery_boy_id) {
                const DeliveryBoysIds = Array.isArray(req.body.delivery_boy_id) ? req.body.delivery_boy_id : [req.body.delivery_boy_id];

                await Vendors_Delivery_Boy.destroy({ where: { store_id: id, }, transaction: t, });

                for (const item of DeliveryBoysIds) {
                    await CreateNew(Vendors_Delivery_Boy, { store_id: id, delivery_boy_id: item }, t);
                }
            }

            await t.commit();

            return Base.sendResponse(res, HTTPS.OK, "Category status updated successfully");
        } catch (error) {
            await t.rollback();
            console.error("Error updating category status:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }
}

module.exports = new SCategoryController();
