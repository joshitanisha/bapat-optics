const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
} = require("../../../../../../helper/common/utils/dbUtils");
const Base = require("../../../../../../helper/exception_handling");
const {
  HTTPS,
} = require("../../../../../../helper/https-status-codes/https-status-codes");
const {
  Users,
  Subscription,
  Subscription_History,
  Plan,
  Wallet,
  Wallet_History,
  Transaction_Type,
  sequelize,
} = require("../../../../../../models/index");
const { Op } = require("sequelize");
class SubscriptionController {
  // Fetch all Data
  async findAll(req, res) {
    try {
      const term = req.query.term || "";
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const per_page = req.query.per_page ? parseInt(req.query.per_page) : 10;
      const fromDate = req.query.startDate
        ? new Date(req.query.startDate.trim())
        : null;
      const toDate = req.query.endDate
        ? new Date(req.query.endDate.trim())
        : null;
      let startCheckDate;

      if (toDate) {
        startCheckDate = new Date(toDate);
        startCheckDate.setDate(startCheckDate.getDate() + 1);
        startCheckDate.setHours(0, 0, 0, 0);
      }

      let whereClause = {};

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

      const whereClauseCustomer = {};

      if (term) {
        whereClauseCustomer.name = { [Op.like]: `%${term}%` };
      }
      const { count, rows: walletHistory } =
        await Wallet_History.findAndCountAll({
          include: [
            { model: Transaction_Type },
            {
              model: Wallet,
              required: true,
              include: [
                { model: Users, required: true, where: whereClauseCustomer },
              ],
            },
          ],
          where: whereClause,
          order: [["createdAt", "DESC"]],
          offset: (page - 1) * per_page,
          limit: per_page,
          distinct: true,
        });

      const total_pages = Math.ceil(count / per_page);

      return Base.sendResponse(res, HTTPS.OK, {
        data: walletHistory,
        current_page: page,
        total_pages: total_pages,
        per_page: per_page,
        total: count,
        search_name: term,
      });
    } catch (error) {
      console.error("Error fetching Wallet:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const result = await CheckExits(
        Wallet,
        { user_id: req?.user?.user_id },
        t
      );

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Wallet not found");
      }
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Wallet:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async findOneUserWallet(req, res) {
    const t = await sequelize.transaction();
    try {
      const result = await CheckExits(
        Wallet,
        { user_id: req?.params?.id },
        t
      );

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Wallet not found");
      }
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Wallet:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async transaction(req, res) {
    const t = await sequelize.transaction();
    try {
      const { amount, transaction_type, description, transaction_id } =
        req?.body;

      const wallet = await CheckExits(
        Wallet,
        { user_id: req?.user?.user_id },
        t
      );

      if (!wallet) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Wallet not found");
      }

      const currentAmount = parseFloat(wallet?.amount);
      const requestAmount = parseFloat(amount);
      let totalAmount;

      if (transaction_type === "debit") {
        if (currentAmount < requestAmount) {
          await t.rollback();
          return Base.sendError(res, HTTPS.OK, "Insufficient Balance");
        }
        totalAmount = currentAmount - requestAmount;
      } else if (transaction_type === "credit") {
        totalAmount = currentAmount + requestAmount;
      } else {
        await t.rollback();
        return Base.sendError(res, HTTPS.OK, "Transaction Type Is Required");
      }

      const updateWallet = await UpdateData(
        Wallet,
        { amount: totalAmount },
        { user_id: req?.user?.user_id },
        t
      );

      const createHistory = await CreateNew(
        Wallet_History,
        {
          wallet_id: wallet?.id,
          transaction_type: transaction_type,
          amount: amount,
          description: description,
          transaction_id: transaction_id,
        },
        t
      );

      await t.commit();
      return Base.sendResponse(res, HTTPS.CREATED, createHistory);
    } catch (error) {
      await t.rollback();
      console.error("Error Updating Wallet:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Wallet, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Wallet,
        { status: result.status ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Wallet status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Wallet status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new SubscriptionController();
