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
const { Career, JobType, Shift, sequelize, Language, Qualification, Career_Qualification, Career_language } = require("../../../../../models/index");
const { Op } = require("sequelize");

class CareerController {

    async create(req, res) {
        const t = await sequelize.transaction();
        try {
            const Count = await Career.count({});
            const data = {
                name: req.body?.name,
                description: req.body?.description,
                skill: req.body?.skill,
                job_location: req.body.job_location,
                role_permission: req.body.role_permission,
                hr_name: req.body.hr_name,
                recruiter_email: req.body.recruiter_email,
                job_type_id: req.body?.job_type_id,
                shift_type_id: req.body?.shift_type_id,
                recruiter_contact_number: req.body?.recruiter_contact_number,
                start_annual_package: req.body?.start_annual_package,
                end_annual_package: req.body?.end_annual_package,
                company_name: req.body?.company_name,
                vacancy: req.body?.vacancy,
                experience_from: req.body?.experience_from,
                experience_to: req.body?.experience_to,
                deadline: req.body?.deadline
            };


            if (req?.files && req?.files?.image) {
                data.image = await File_Uploade(
                    req.files?.image,
                    "/uploads/masters/career"
                );


            }

            console.log(req.body, '000000000000000000000');


            const existingCategory = await CheckExits(
                Career,
                { name: data?.name },
                t
            );

            if (existingCategory) {
                await t.rollback();
                return Base.sendError(
                    res,
                    HTTPS.NOT_ACCEPTABLE,
                    "Category already exists"
                );
            }
            const newCareer = await CreateNew(Career, data, t);

            console.log(newCareer, 'newCareer');


            const lang_id = req?.body?.language_id;
            if (lang_id && lang_id?.length > 0) {
                for (let lid of lang_id) {
                    await CreateNew(
                        Career_language,
                        {
                            career_id: newCareer?.id,
                            language_id: lid,
                        },
                        t
                    );
                }
            }

            const qualification = req?.body?.qualification_id;
            if (qualification && qualification?.length > 0) {
                for (let qid of qualification) {
                    await CreateNew(
                        Career_Qualification,
                        {
                            career_id: newCareer?.id,
                            qualification_id: qid,
                        },
                        t
                    );
                }
            }

            // const newLanguage = await CreateNew(Career_language, data, t);


            await t.commit();
            return Base.sendResponse(res, HTTPS.CREATED, newCareer);
        } catch (error) {
            await t.rollback();
            console.error("Error creating Career:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }

    //find all
    async findAll(req, res) {
        try {

            const name = req.query.term?.trim() || "";
            const whereClause = {};
            if (name) {
                whereClause.name = { [Op.like]: `%${name}%` };
            }
            const options = {
                where: whereClause,
                include: [
                    { model: JobType },
                    { model: Shift },
                    { model: Career_language },
                    { model: Career_Qualification }
                ],
                order: [['createdAt', 'DESC']],
            }
            await Paginate(Career, options, req, res, Op);
        } catch (error) {
            console.error('Error fetching Careers:', error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }


    //find one
    async findOne(req, res) {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;

            const career = await Career.findOne({
                where: { id },
                include: [
                    { model: JobType },
                    { model: Shift },
                    {
                        model: Career_language,
                        include: [
                            {
                                model: Language
                            }
                        ]
                    },
                    {
                        model: Career_Qualification, include: [
                            {
                                model: Qualification
                            }
                        ]
                    }
                ]
            });

            let language_id = [];
            for (const item of career?.Career_languages) {
                language_id.push({
                    name: "language_id",
                    label: item?.Language?.name,
                    value: item?.Language?.id,
                });
            }
            let qualification_id = [];
            for (const item of career?.Career_Qualifications) {
                qualification_id.push({
                    name: "qualification_id",
                    label: item?.Qualification?.name,
                    value: item?.Qualification?.id,
                });
            }

            const data = {
                id: career?.id,
                name: career?.name,
                description: career?.description,
                skill: career?.skill,
                job_location: career?.job_location,
                role_permission: career?.role_permission,
                hr_name: career?.hr_name,
                recruiter_email: career?.recruiter_email,
                recruiter_contact_number: career?.recruiter_contact_number,
                start_annual_package: career?.start_annual_package,
                end_annual_package: career?.end_annual_package,
                company_name: career?.company_name,
                vacancy: career?.vacancy,
                image: career?.image,
                experience_from: career?.experience_from,
                experience_to: career?.experience_to,
                deadline: career?.deadline,
                shift_type_id: {
                    name: 'shift_type_id',
                    label: career?.JobType?.name,
                    value: career?.JobType?.id,
                }, job_type_id: {
                    name: 'job_type_id',
                    label: career?.Shift?.name,
                    value: career?.Shift?.id,
                },
                language_id: language_id,
                qualification_id: qualification_id

            }




            if (!career) {
                return Base.sendError(res, HTTPS.NOT_FOUND, "Career not found.");
            }
            await t.commit();
            return Base.sendResponse(res, HTTPS.OK, data);
        } catch (error) {
            console.error("FindOne Career error:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, "Error fetching career.");
        }
    }

    //update

    async update(req, res) {
        const t = await sequelize.transaction();
        // try {
        const { id } = req.params;

        const {
            career_id,
            name,
            description,
            skill,
            job_location,
            role_permission,
            hr_name,
            recruiter_email,
            recruiter_contact_number,
            start_annual_package,
            end_annual_package,
            job_type_id,
            shift_type_id,
            company_name,
            experience_from,
            experience_to,
            vacancy,
            deadline

        } = req.body;

        // Check if career exists
        const career = await Career.findOne({ where: { id }, transaction: t });
        if (!career) {
            await t.rollback();
            return Base.sendError(res, HTTPS.NOT_FOUND, "Career not found.");
        }

        const data = {
            name,
            description,
            skill,
            job_location,
            role_permission,
            hr_name,
            recruiter_email,
            recruiter_contact_number,
            start_annual_package,
            end_annual_package,
            job_type_id,
            shift_type_id,
            company_name,
            vacancy,
            experience_from,
            experience_to,
            deadline,
        };

        if (req?.files && req.files?.image) {
            data.image = await File_Uploade(req.files?.image, "/uploads/masters/career")
        }




        const qualification = req?.body?.qualification_id;

        // const lang_id = req?.body?.language_id;
        if (req?.body?.language_id) {
            const langIds = JSON.parse(req.body.language_id);

            if (langIds && langIds?.length > 0) {
                for (let lid of langIds) {
                    await Career_language.destroy({
                        where: { career_id: id },
                        transaction: t,
                    });
                }
            }
            if (langIds && langIds?.length > 0) {
                for (let lid of langIds) {
                    await CreateNew(
                        Career_language,
                        {
                            career_id: id,
                            language_id: lid,
                        },
                        t
                    );
                }
            }

        }
        if (req?.body?.qualification_id) {
            const qualIds = JSON.parse(req.body.qualification_id);

            if (qualIds) {
                for (let lid of qualIds) {
                    await Career_Qualification.destroy({
                        where: { career_id: id },
                        transaction: t,
                    });
                }
            }
            if (qualIds && qualIds?.length > 0) {
                for (let qid of qualIds) {
                    await CreateNew(
                        Career_Qualification,
                        {
                            career_id: id,
                            qualification_id: qid,
                        },
                        t
                    );
                }
            }
        }


        const result = await UpdateData(Career, data, { id }, t);

        await t.commit();
        return Base.sendResponse(res, HTTPS.OK, {}, "Career Updated successfully");

        // } catch (error) {
        //   await t.rollback();
        //   console.error("Career update error:", error);
        //   return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, "Error updating career.");
        // }
    }

    // Delete Career
    async delete(req, res) {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;

            const exists = await CheckExits(Career, { id }, t);
            if (!exists) {
                await t.rollback();
                return Base.sendError(res, HTTPS.NOT_FOUND, "Career not found");
            }

            await Career.destroy({ where: { id }, transaction: t });
            await t.commit();

            return Base.sendResponse(res, HTTPS.OK, {}, "Career deleted successfully");
        } catch (error) {
            await t.rollback();
            console.error("Error deleting career:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }

    // Update the status of a State
    async status(req, res) {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;

            const city = await CheckExits(Career, { id }, t);

            if (!city) {
                await t.rollback();
                return Base.sendError(res, HTTPS.NOT_FOUND, "City not found");
            }

            await UpdateData(
                Career,
                { status: city.status ? false : true },
                { id },
                t
            );

            await t.commit();

            return Base.sendResponse(
                res,
                HTTPS.OK,
                "City status updated successfully"
            );
        } catch (error) {
            await t.rollback();
            console.error("Error updating State status:", error);
            return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
        }
    }
}

module.exports = new CareerController();

