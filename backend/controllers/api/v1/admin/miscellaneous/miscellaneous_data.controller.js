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
  Miscellaneous_Data,
  Miscellaneous_Reason,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
class Miscellaneous_DataController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const term = req.query.term?.trim() || "";
      const faq_category_id = req.query.faq_category_id?.trim() || "";

      let whereClause = {
        [Op.or]: [
          {
            [Op.and]: [{ comment: { [Op.like]: `%${term}%` } }, ,],
          },
        ],
      };

      if (faq_category_id) {
        whereClause.miscellaneous_reason_id = faq_category_id;
      }
      const fromDate = req.query.from ? new Date(req.query.from.trim()) : null;
      const toDate = req.query.to ? new Date(req.query.to.trim()) : null;
      let startCheckDate;

      if (toDate) {
        startCheckDate = new Date(toDate);
        startCheckDate.setDate(startCheckDate.getDate() + 1);
        startCheckDate.setHours(0, 0, 0, 0);
      }

      if (fromDate && toDate) {
        whereClause.date = {
          [Op.between]: [fromDate.toISOString(), startCheckDate.toISOString()],
        };
      } else if (fromDate) {
        whereClause.date = {
          [Op.gte]: fromDate.toISOString(),
        };
      } else if (toDate) {
        whereClause.date = {
          [Op.lte]: startCheckDate.toISOString(),
        };
      }
      const options = {
        include: [{ model: Miscellaneous_Reason }],
        where: whereClause,
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Miscellaneous_Data, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Miscellaneous_Datas:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const include = [
        {
          model: Miscellaneous_Reason,
        },
      ];
      const result = await CheckExits(
        Miscellaneous_Data,
        { id: req.params.id },
        t,
        include
      );

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Faq not found");
      }

      const data = {
        comment: result?.comment,
        rupees: result?.rupees,
        date: result?.date,
        miscellaneous_reason_id: {
          value: result?.miscellaneous_reason_id,
          name: "miscellaneous_reason_id",
          label: result?.Miscellaneous_Reason?.name,
        },
      };

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Faq :", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
  // Create a new country
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        miscellaneous_reason_id: req.body.miscellaneous_reason_id,
        comment: req.body?.comment?.trim(),
        date: req.body?.date?.trim(),
        rupees: req.body?.rupees?.trim(),
      };
      // const exists = await CheckExits(Miscellaneous_Data, { name: data?.name }, t);

      // if (exists) {
      //   await t.rollback();
      //   return Base.sendError(
      //     res,
      //     HTTPS.NOT_ACCEPTABLE,
      //     "Miscellaneous Data already exists"
      //   );
      // }

      const newItem = await CreateNew(Miscellaneous_Data, data, t);

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.CREATED,
        newItem,
        "Miscellaneous Data  Created"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error creating Miscellaneous_Data:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a country by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        miscellaneous_reason_id: req.body.miscellaneous_reason_id,
        comment: req.body?.comment?.trim(),
        date: req.body?.date?.trim(),
        rupees: req.body?.rupees?.trim(),
      };

      // const exists = await CheckExits(Miscellaneous_Data, { name: data?.name }, t);

      // if (exists?.id != id && exists !== null) {
      //   await t.rollback();
      //   return Base.sendError(
      //     res,
      //     HTTPS.NOT_ACCEPTABLE,
      //     "Miscellaneous Data name already in use"
      //   );
      // }

      const update = await UpdateData(Miscellaneous_Data, data, { id: id }, t);

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        {},
        "Miscellaneous Data  updated"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Miscellaneous_Data:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete a country by ID
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Miscellaneous_Data, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_FOUND,
          "Miscellaneous Data not found"
        );
      }

      await Miscellaneous_Data.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Miscellaneous Data Deleted Successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Miscellaneous_Data:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Miscellaneous_Data, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Miscellaneous_Data,
        { status: result.status ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Miscellaneous Data status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Miscellaneous Data status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async getDownloadExcelCustomerList(req, res) {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Customer List");
      const filePath = path.join(__dirname, "Customer_List.xlsx");

      const term = req.query.term?.trim() || "";
      const faq_category_id = req.query.faq_category_id?.trim() || "";

      let whereClause = {
        [Op.or]: [
          {
            [Op.and]: [{ comment: { [Op.like]: `%${term}%` } }, ,],
          },
        ],
      };

      if (faq_category_id) {
        whereClause.miscellaneous_reason_id = faq_category_id;
      }
      const fromDate = req.query.from ? new Date(req.query.from.trim()) : null;
      const toDate = req.query.to ? new Date(req.query.to.trim()) : null;
      let startCheckDate;

      if (toDate) {
        startCheckDate = new Date(toDate);
        startCheckDate.setDate(startCheckDate.getDate() + 1);
        startCheckDate.setHours(0, 0, 0, 0);
      }

      if (fromDate && toDate) {
        whereClause.date = {
          [Op.between]: [fromDate.toISOString(), startCheckDate.toISOString()],
        };
      } else if (fromDate) {
        whereClause.date = {
          [Op.gte]: fromDate.toISOString(),
        };
      } else if (toDate) {
        whereClause.date = {
          [Op.lte]: startCheckDate.toISOString(),
        };
      }

      const customerRecords = await Miscellaneous_Data.findAll({
        include: [{ model: Miscellaneous_Reason }],
        where: whereClause,
        order: [["createdAt", "DESC"]],
      });

      worksheet.addRow([
        "Sr No",
        "Responssible Person",
        "Reason",
        "Date",
      
      ]);

      let DataArray = [];

      customerRecords.forEach((data, index) => {
        const result = {
          name: data?.Miscellaneous_Reason?.name || "-",
          comment: data?.comment || "-",
         
          date: data?.date?.toISOString().split("T")[0] || "-",
        };

        DataArray.push(result);
      });

      DataArray.forEach((record, index) => {
        worksheet.addRow([
          index + 1,
          record.name,
          record.comment,
          record.date,
          
        ]);
      });

      await workbook.xlsx.writeFile(filePath);

      res.download(filePath, "Customer_List.xlsx", (err) => {
        if (err) {
          console.error(err);
          res
            .status(500)
            .send("An error occurred while generating the Excel file.");
        }

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    } catch (error) {
      console.error(error);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      res
        .status(500)
        .send("An error occurred while generating the Excel file.");
    }
  }
}

module.exports = new Miscellaneous_DataController();
