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
const { Career, JobType, Shift, sequelize } = require("../../../../../models/index");
const { Op } = require("sequelize");

class CareerController {

  // Create Career
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const {
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
        shift_type_id
      } = req.body;

      
      if (!name || !job_type_id || !shift_type_id) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.BAD_REQUEST,
          "Name, job_type_id, and shift_type_id are required."
        );
      }

      
      const exists = await CheckExits(Career, { name }, t);
      if (exists) {
        await t.rollback();
        return Base.sendError(res, HTTPS.CONFLICT, "Career with this name already exists.");
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
        shift_type_id
      };

      const result = await CreateNew(Career, data, t);
      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, result);
    } catch (error) {
      await t.rollback();
      console.error("Career create error:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, "Error creating career.");
    }
  }

  //find all
  async findAll(req, res) {
    try {
      const careers = await Career.findAll({
        include: [
          { model: JobType},
          { model: Shift}
        ],
        order: [['createdAt', 'DESC']],
      });

      return Base.sendResponse(res, HTTPS.OK, careers);
    } catch (error) {
      console.error('Error fetching Careers:', error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  
//find one
  async findOne(req, res) {
  try {
    const { id } = req.params;

    const career = await Career.findOne({
      where: { id },
      include: [
        { model: JobType },
        { model: Shift }
      ]
    });

    if (!career) {
      return Base.sendError(res, HTTPS.NOT_FOUND, "Career not found.");
    }

    return res.status(HTTPS.SUCCESS).json({
      success: true,
      message: "Career fetched successfully",
      data: career
    });
  } catch (error) {
    console.error("FindOne Career error:", error);
    return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, "Error fetching career.");
  }
}

//update

  async update(req, res) {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const {
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
      shift_type_id
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
      shift_type_id
    };

    const result = await UpdateData(Career, data, { id }, t);

    await t.commit();
    return res.status(HTTPS.SUCCESS).json({
      success: true,
      message: "Career updated successfully",
      data: result
    });
  } catch (error) {
    await t.rollback();
    console.error("Career update error:", error);
    return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, "Error updating career.");
  }
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

