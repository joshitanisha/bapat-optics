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
const {
  Users,
  Subscription,
  Subscription_History,
  Plan,
  Wallet,
  Wallet_History,
  sequelize,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
class SubscriptionController {
  // Fetch all Data
  async findAll(req, res) {
    try {
      const term = req.query.term || "";
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const per_page = req.query.per_page ? parseInt(req.query.per_page) : 10;
      const startDate = req.query.startDate
        ? new Date(req.query.startDate)
        : null;
      const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

      const user_wallet = await CheckExits(Wallet, {
        user_id: req?.user?.user_id,
      });

      const whereCondition = {
        wallet_id: user_wallet?.id,
      };

      if (startDate) {
        whereCondition.createdAt = { [Op.gte]: startDate };
      }

      if (endDate) {
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setHours(23, 59, 59, 999);
        whereCondition.createdAt = {
          ...whereCondition.createdAt,
          [Op.lte]: adjustedEndDate,
        };
      }

      const { count, rows: walletHistory } =
        await Wallet_History.findAndCountAll({
          where: whereCondition,
          order: [["createdAt", "DESC"]],
          offset: (page - 1) * per_page,
          limit: per_page,
          distinct: true,
        });

      const total_pages = Math.ceil(count / per_page);

      return Base.sendResponse(res, HTTPS.OK, {
        user_wallet: user_wallet,
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
