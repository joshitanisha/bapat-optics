const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
} = require("../../../../../helper/common/utils/dbUtils");
const Base = require("../../../../../helper/exception_handling");
const IDS = require("../../../../../helper/fix_ids");
const {
  HTTPS,
} = require("../../../../../helper/https-status-codes/https-status-codes");
const {
  Users,
  Logs,
  User_Address,
  Product_Order,
  Product_Order_Detail,
  Users_Address_Details,
  Product,
  Order_status,
  Store_Detail,
  Area,
  Country,
  State,
  City,
  Pincode,
  Wallet,
  Wallet_History,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
class BrandController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const term = req.query.term?.trim() || "";
      const searchEmail = req.query.searchEmail?.trim() || "";
      const searchNumber = req.query.searchNumber?.trim() || "";
// console.log("termterm",term)
      const whereClause = {
        role_id: IDS.RoleId.Customer,
      };

      const andConditions = [];

      if (term) {
        andConditions.push({ name: { [Op.like]: `%${term}%` } });
      }

      if (searchEmail) {
        andConditions.push({ email: { [Op.like]: `%${searchEmail}%` } });
      }

      if (searchNumber) {
        andConditions.push({ contact_no: { [Op.like]: `%${searchNumber}%` } });
      }

      if (andConditions.length > 0) {
        whereClause[Op.and] = andConditions;
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
            model: Logs,
          },
          {
            model: Wallet,
          },
          {
            model: User_Address,
            include: [
              {
                model: Users_Address_Details,
                include: [
                  {
                    model: Area,
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
                ],
              },
            ],
          },
          {
            model: Product_Order,
            as: "customer_orders",
          },
        ],
        where: whereClause,
        // where: {
        //   [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
        //   role_id: IDS.RoleId.Customer
        // },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Users, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Users:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      // const include = [

      //   {
      //     model: User_Address,
      //   },
      //   {
      //     model: Product_Order,
      //     as: "customer_orders",
      //      order: [["createdAt", "DESC"]],
      //     include: [
      //       {
      //         model: Product_Order_Detail,
      //         include: [
      //           {
      //             model: Product,
      //           },
      //         ],
      //       },
      //       {
      //         model: Order_status,
      //       },

      //     ],
      //   },
      // ];
      // const result = await CheckExits(Users, { id: req.params.id }, t, include);

      // if (!result) {
      //   await t.rollback();
      //   return Base.sendError(res, HTTPS.NOT_FOUND, "User not found");
      // }

      const result = await Users.findOne({
        where: { id: req.params.id },
        include: [
          {
            model: User_Address,
          },
          {
            model: Product_Order,
            as: "customer_orders",
            include: [
              {
                model: Product_Order_Detail,
                include: [
                  {
                    model: Product,
                  },
                ],
              },
              {
                model: Order_status,
              },
            ],
          },
        ],
        order: [
          [
            { model: Product_Order, as: "customer_orders" },
            "createdAt",
            "DESC",
          ],
        ],
        transaction: t,
      });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching User:", error);
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
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found");
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
        "User status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating User status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async getDownloadExcelCustomerList(req, res) {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Customer List");
      const filePath = path.join(__dirname, "Customer_List.xlsx");

      const term = req.query.term || "";
      const fromDate = req.query.from
        ? new Date(req.query.from.trim()).setHours(0, 0, 0, 0)
        : null;
      const toDate = req.query.to
        ? new Date(req.query.to.trim()).setHours(23, 59, 59, 999)
        : null;

      let whereClause = {
        role_id: IDS.RoleId.Customer,
      };

      // Date filter
      if (fromDate && toDate) {
        whereClause.createdAt = {
          [Op.between]: [fromDate, toDate],
        };
      } else if (fromDate) {
        whereClause.createdAt = {
          [Op.gte]: fromDate,
        };
      } else if (toDate) {
        whereClause.createdAt = {
          [Op.lte]: toDate,
        };
      }

      // Term filter
      if (term) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${term}%` } },
          { email: { [Op.like]: `%${term}%` } },
          { contact_no: { [Op.like]: `%${term}%` } },
        ];
      }

      const customerRecords = await Users.findAll({
        where: whereClause,
        order: [["createdAt", "DESC"]],
      });

      worksheet.addRow([
        "Sr No",
        "Customer Name",
        "Email",
        "Contact Number",
        "Created At",
      ]);

      let DataArray = [];

      customerRecords.forEach((data, index) => {
        const result = {
          name: data?.name || "-",
          email: data?.email || "-",
          contact_no: data?.contact_no || "-",
          createdAt: data?.createdAt?.toISOString().split("T")[0] || "-",
        };

        DataArray.push(result);
      });

      DataArray.forEach((record, index) => {
        worksheet.addRow([
          index + 1,
          record.name,
          record.email,
          record.contact_no,
          record.createdAt,
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

  async WalletTransaction(req, res) {
    const t = await sequelize.transaction();
    try {
      const { amount, transaction_type, transaction_id } = req?.body;

      const wallet = await Wallet.findOne({
        where: { user_id: req?.params?.id },
        transaction: t,
      });

      const currentAmount = parseFloat(wallet?.amount);
      const requestAmount = parseFloat(amount);
      let totalAmount;
      let transaction_type_id;
      let description;
      if (transaction_type === "debit") {
        transaction_type_id = IDS?.Transaction_type?.Debit;
        description = "Amount Minus by admin";
        if (currentAmount < requestAmount) {
          await t.rollback();
          return Base.sendError(res, HTTPS.OK, "Insufficient Balance");
        }
        totalAmount = currentAmount - requestAmount;
      } else if (transaction_type === "credit") {
        transaction_type_id = IDS?.Transaction_type?.Credit;
        description = "Amount Add by admin";
        totalAmount = currentAmount + requestAmount;
      } else {
        await t.rollback();
        return Base.sendError(res, HTTPS.OK, "Transaction Type Is Required");
      }

      if (wallet) {
        const updateWallet = await UpdateData(
          Wallet,
          { amount: totalAmount },
          { user_id: req?.params?.id },
          t
        );
      } else {
        const updateWallet = await CreateNew(
          Wallet,
          { user_id: req?.params?.id, amount: amount },
          t
        );
      }

      const createHistory = await CreateNew(
        Wallet_History,
        {
          wallet_id: wallet?.id,
          transaction_type: transaction_type,
          amount: amount,
          description,
          transaction_id: transaction_id,
          transaction_type_id,
        },
        t
      );

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, createHistory);
    } catch (error) {
      await t.rollback();
      console.error("Error Updating Wallet:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new BrandController();
