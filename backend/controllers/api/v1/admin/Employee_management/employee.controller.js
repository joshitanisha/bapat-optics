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
  Users,
  Roles,
  Delivery_Boy_Detail,
  Doctor_Details,
  Wallet,
  p_category,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
const IDS = require("../../../../../helper/fix_ids");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
const {
  update_user,
  create_User,
} = require("../../../../../helper/order_notification");
class EmployeeController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const email = req.query.email?.trim() || "";
      const contact_no = req.query.contact_no?.trim() || "";
      const role_id = req.query.role_id || "";
      const fromDate = req.query.from ? new Date(req.query.from.trim()) : null;
      const toDate = req.query.to ? new Date(req.query.to.trim()) : null;
      let startCheckDate;

      if (toDate) {
        startCheckDate = new Date(toDate);
        startCheckDate.setDate(startCheckDate.getDate() + 1);
        startCheckDate.setHours(0, 0, 0, 0);
      }

      if (fromDate && toDate) {
        whereClause.createdAt = {
          [Op.between]: [fromDate.toISOString(), startCheckDate.toISOString()],
        };
      } else if (fromDate) {
        whereClause.createdAt = {
          [Op.gte]: fromDate.toISOString(),
        };
      } else if (toDate) {
        whereClause.createdAt = {
          [Op.lte]: startCheckDate.toISOString(),
        };
      }
      const options = {
        include: [
          {
            model: Roles,
          },
          {
            model: Doctor_Details,
          },
        ],
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
          [Op.or]: [{ email: { [Op.like]: `%${email}%` } }],
          [Op.or]: [{ contact_no: { [Op.like]: `%${contact_no}%` } }],
          ...(role_id
          ? { role_id: role_id }                 // honour the caller’s filter (if not 4)
          : { role_id: { [Op.ne]: 4 } }), 
        },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Users, options, req, res, Op);
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
          model: Roles,
        },
        {
          model: Doctor_Details,
          include: [
            {
              model: p_category,
            },
          ],
        },
      ];
      const result = await CheckExits(Users, { id: req.params.id }, t, include);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found");
      }

      const data = {
        name: result?.name,
        email: result?.email,
        contact_no: result?.contact_no,
        image: result?.image,
        description: result?.description,
        fees: req.body?.fees,
        expirence: result?.Doctor_Detail?.expirence,
        designation: result?.Doctor_Detail?.designation,
        time: result?.Doctor_Detail?.time,
        fees: result?.Doctor_Detail?.fees,
        degree: result?.Doctor_Detail?.degree,
        hospital_name: result?.Doctor_Detail?.hospital_name,
        address: result?.Doctor_Detail?.address,
        specialization: result?.Doctor_Detail?.specialization,
        role_id: {
          value: result?.role_id,
          name: "role_id",
          label: result?.Role?.name,
        },
        category_id: {
          value: result?.Doctor_Detail?.category_id,
          name: "category_id",
          label: result?.Doctor_Detail?.p_category?.name,
        },
      };
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Brand:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new country
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        name: req.body?.name?.trim(),
        email: req.body?.email?.trim(),
        contact_no: req.body?.contact_no?.trim(),
        // description: req.body?.description?.trim(),
        role_id: req.body?.role_id,
        status: true,
      };

      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      data.password = hashedPassword;

      if (req.files && req.files?.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/user"
        );
      }

      const contactexits = await CheckExits(
        Users,
        { contact_no: data?.contact_no },
        t
      );

      if (contactexits) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Contact No already exists"
        );
      }

      const emailexits = await CheckExits(Users, { email: data?.email }, t);
      if (emailexits) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Email ID already exists"
        );
      }

      const newItem = await CreateNew(Users, data, t);

      const wallet = await CreateNew(
        Wallet,
        { user_id: newItem.id, amount: 0 },
        t
      );
      if (Number(req.body?.role_id) === IDS.RoleId.DeliveryBoy) {
        await CreateNew(
          Delivery_Boy_Detail,
          {
            user_id: newItem.id,
            approval_status_id: IDS.ApprovalStatus.Approved,
          },
          t
        );
      }
      const generateDoctorCode = async () => {
        const lastDoctor = await Doctor_Details.findOne({
          order: [["id", "DESC"]],
          attributes: ["id"],
        });
        const nextId = (lastDoctor?.id || 0) + 1;
        const paddedId = String(nextId).padStart(6, "0");
        return `DOC${paddedId}`;
      };

      if (Number(req.body?.role_id) === IDS.RoleId.Doctor) {
        const doctorCode = await generateDoctorCode();
        const data = {
          doctor_code: doctorCode,
          user_id: newItem.id,
          fees: req.body?.fees?.trim(),
          expirence: req.body?.expirence?.trim(),
          designation: req.body?.designation?.trim(),
          time: req.body?.time?.trim(),
          degree: req.body?.degree,
          hospital_name: req.body?.hospital_name?.trim(),
          address: req.body?.address?.trim(),
          specialization: req.body?.specialization,
          category_id: req.body?.category_id,
        };
        await CreateNew(Doctor_Details, data, t);
      }

      if (Number(req.body?.role_id) === IDS.RoleId.DeliveryBoy) {
        await create_User(newItem.id);
      }
      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newItem);
    } catch (error) {
      await t.rollback();
      console.error("Error creating User:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async doctorCommission(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        commission: req.body?.commission,
      };

      await UpdateData(Doctor_Details, data, { user_id: req.params.id }, t);
      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, data);
    } catch (error) {
      await t.rollback();
      console.error("Error creating User:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a country by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        name: req.body?.name?.trim(),
        email: req.body?.email?.trim(),
        contact_no: req.body?.contact_no?.trim(),
        description: req.body?.description?.trim(),
        role_id: req.body?.role_id,
      };

      if (req.body.password) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        data.password = hashedPassword;
      }

      if (req.files && req.files?.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/user"
        );
      }

      const contactexits = await CheckExits(
        Users,
        { contact_no: data?.contact_no },
        t
      );
      if (contactexits?.id != id && contactexits !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Contact No already exists"
        );
      }

      const emailexits = await CheckExits(Users, { email: data?.email }, t);
      if (emailexits?.id != id && emailexits !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Email ID already exists"
        );
      }

      const update = await UpdateData(Users, data, { id: id }, t);

      if (Number(req.body?.role_id) === IDS.RoleId.Doctor) {
        const data = {
          user_id: id,
          fees: req.body?.fees?.trim(),
          expirence: req.body?.expirence?.trim(),
          designation: req.body?.designation?.trim(),
          time: req.body?.time?.trim(),
          degree: req.body?.degree,
          hospital_name: req.body?.hospital_name?.trim(),
          address: req.body?.address?.trim(),
          specialization: req.body?.specialization,
          category_id: req.body?.category_id,
        };
        await UpdateData(Doctor_Details, data, { user_id: id }, t);
      }
      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "User updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating User:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a country by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Users, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found");
      }

      await Users.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "User Deleted Successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting User:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Users, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Users,
        { status: result.status ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Brand status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Brand status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async getDownloadExcelUserList(req, res) {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("User List");

       const name = req.query.term?.trim() || "";
      const email = req.query.email?.trim() || "";
      const contact_no = req.query.contact_no?.trim() || "";
      const role_id = req.query.role_id || "";
      const fromDate = req.query.from ? new Date(req.query.from.trim()) : null;
      const toDate = req.query.to ? new Date(req.query.to.trim()) : null;
      // Optional filter logic
      const whereClause = {};
      if (req.body.role_id) {
        whereClause.role_id = req.body.role_id;
      }
      if (req.body.status) {
        whereClause.status = req.body.status;
      }

      const userRecords = await Users.findAll({
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
          [Op.or]: [{ email: { [Op.like]: `%${email}%` } }],
          [Op.or]: [{ contact_no: { [Op.like]: `%${contact_no}%` } }],
          ...(role_id
          ? { role_id: role_id }                 // honour the caller’s filter (if not 4)
          : { role_id: { [Op.ne]: 4 } }), 
        },
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Roles,
          },
        ],
      });

      worksheet.addRow(["Sr No", "Role", "Name", "Email", "Contact No"]);

      let DataArray = [];

      userRecords.forEach((user, index) => {
        const result = {
          role: user?.Role?.name || "-",
          name: user?.name || "-",
          email: user?.email || "-",
          contact_no: user?.contact_no || "-",
        };

        DataArray.push(result);
      });

      DataArray.forEach((record, index) => {
        worksheet.addRow([
          index + 1,
          record.role,
          record.name,
          record.email,
          record.contact_no,
        ]);
      });

      const filePath = path.join(__dirname, "User_List.xlsx");
      await workbook.xlsx.writeFile(filePath);

      res.download(filePath, "User_List.xlsx", (err) => {
        if (err) {
          console.log(err);
          res
            .status(500)
            .send("An error occurred while generating the Excel file.");
        }

        fs.unlinkSync(filePath);
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("An error occurred while generating the Excel file.");
    }
  }
}

module.exports = new EmployeeController();
