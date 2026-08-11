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
  Prescriptions,
  Prescriptions_Type,
  Prescription_Details,
  Lens,
  Lens_Option,
  Eye_Unit,
  Eye_Type,
  LensType,
  Addon,
  Product,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");

class CareerController {
  // Create Career
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const {
        // lens_option_id,
        // lens_id,
        lens_type_id,
        addon_id,
        prescriptions_type_id,
        vision,
        product_id,
        lense_product_id,
        a_size,
        b_size,
        dbl,
        fh,
      } = req.body;

      const data = {
        user_id: req.user.user_id,
        lens_type_id,
        addon_id,
        product_id,
        prescriptions_type_id,
        lense_product_id,
      };
      if (a_size) {
        data.a_size = a_size;
      }
      if (b_size) {
        data.b_size = b_size;
      }
      if (dbl) {
        data.dbl = dbl;
      }
      if (fh) {
        data.fh = fh;
      }

      if (req.files && req.files.pdf) {
        data.pdf = await File_Uploade(req.files?.pdf, "/uploads/prescription");
      }
      const prescription = await Prescriptions.create(data, { transaction: t });

      if (Number(prescriptions_type_id) === 1) {
        // Ensure vision is an object, not a string
        let parsedVision = vision;
        if (typeof vision === "string") {
          try {
            parsedVision = JSON.parse(vision);
          } catch (err) {
            console.error("Invalid JSON in vision field:", vision);
            parsedVision = {};
          }
        }

        const visionData = [];

        for (const eyeId in parsedVision) {
          for (const labelId in parsedVision[eyeId]) {
            for (const headId in parsedVision[eyeId][labelId]) {
              visionData.push({
                prescription_id: prescription.id,
                eye_type_id: eyeId,
                vission_type_id: labelId,
                eye_unit_id: headId,
                name: parsedVision[eyeId][labelId][headId],
              });
            }
          }
        }

        if (visionData.length > 0) {
          await Prescription_Details.bulkCreate(visionData, { transaction: t });
        }
      }

      await t.commit();
      return Base.sendResponse(res, HTTPS.CREATED, {
        prescription,
      });
    } catch (error) {
      await t.rollback();
      console.error("Prescription create error:", error);
      return Base.sendError(
        res,
        HTTPS.INTERNAL_SERVER_ERROR,
        "Error creating prescription."
      );
    }
  }

  async findAll(req, res) {
    try {
      const careers = await Prescriptions.findAll({
        where: { user_id: req.user.user_id },
        include: [
          { model: Lens },
          { model: Prescriptions_Type },
          { model: LensType },
          { model: Addon },
          { model: Lens_Option },
          { model: Product, as: "Lense" },
          { model: Prescription_Details },
        ],
        order: [["createdAt", "DESC"]],
      });

      return Base.sendResponse(res, HTTPS.OK, careers);
    } catch (error) {
      console.error("Error fetching Careers:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  //find one
  async findOne(req, res) {
    try {
      const id = req.query.id || "";
      const where = {};
      const queryOptions = {
        include: [{ model: Prescription_Details }],
      };

      if (id) {
        where.id = id;
        queryOptions.where = where;
      } else {
        queryOptions.order = [["createdAt", "DESC"]];
      }

      const prescription = await Prescriptions.findOne(queryOptions);

      if (!prescription) {
        return Base.sendError(res, HTTPS.NOT_FOUND, "Prescription not found.");
      }

      return Base.sendResponse(res, HTTPS.OK, prescription);
    } catch (error) {
      console.error("FindOne Prescription error:", error);
      return Base.sendError(
        res,
        HTTPS.INTERNAL_SERVER_ERROR,
        "Error fetching prescription."
      );
    }
  }

  async getAllStaticPrescription(req, res) {
    try {
      const { id } = req.params;

      const career = await Career.findAll({
        where: { id },
        include: [{ model: JobType }, { model: Shift }],
      });

      if (!career) {
        return Base.sendError(res, HTTPS.NOT_FOUND, "Career not found.");
      }

      return res.status(HTTPS.SUCCESS).json({
        success: true,
        message: "Career fetched successfully",
        data: career,
      });
    } catch (error) {
      console.error("FindOne Career error:", error);
      return Base.sendError(
        res,
        HTTPS.INTERNAL_SERVER_ERROR,
        "Error fetching career."
      );
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
        shift_type_id,
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
      };

      const result = await UpdateData(Career, data, { id }, t);

      await t.commit();
      return res.status(HTTPS.SUCCESS).json({
        success: true,
        message: "Career updated successfully",
        data: result,
      });
    } catch (error) {
      await t.rollback();
      console.error("Career update error:", error);
      return Base.sendError(
        res,
        HTTPS.INTERNAL_SERVER_ERROR,
        "Error updating career."
      );
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

      return Base.sendResponse(
        res,
        HTTPS.OK,
        {},
        "Career deleted successfully"
      );
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
