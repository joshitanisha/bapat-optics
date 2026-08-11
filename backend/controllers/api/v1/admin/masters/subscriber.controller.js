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
const { Subscriber, sequelize } = require("../../../../../models/index");
const { Op } = require("sequelize");
class SubscriberController {
  // Fetch all countries
  async findAll(req, res) {
    try {
      const email = req.query.term?.trim() || "";
      const options = {
        where: {
          [Op.or]: [{ email: { [Op.like]: `%${email}%` } }],
        },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Subscriber, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Subscribers:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  //   // Fetch a single country by ID
  //   async findOne(req, res) {
  //     const t = await sequelize.transaction();
  //     try {
  //       const result = await CheckExits(Subscriber, { id: req.params.id }, t);

  //       if (!result) {
  //         await t.rollback();
  //         return Base.sendError(res, HTTPS.NOT_FOUND, "Appointment Reason not found");
  //       }
  //       await t.commit();
  //       return Base.sendResponse(res, HTTPS.OK, result);
  //     } catch (error) {
  //       await t.rollback();
  //       console.error("Error fetching Subscriber:", error);
  //       return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
  //     }
  //   }

  //   // Create a new country
  //   async create(req, res) {
  //     const t = await sequelize.transaction();
  //     try {
  //       const data = {
  //         name: req.body?.name?.trim(),
  //         status: true
  //       };
  //       const exists = await CheckExits(Subscriber, { name: data?.name }, t);

  //       if (exists) {
  //         await t.rollback();
  //         return Base.sendError(
  //           res,
  //           HTTPS.NOT_ACCEPTABLE,
  //           "Appointment Reason already exists"
  //         );
  //       }

  //       const newItem = await CreateNew(Subscriber, data, t);

  //       await t.commit();

  //       return Base.sendResponse(
  //         res,
  //         HTTPS.CREATED,
  //         newItem,
  //         "Appointment Reason  Created"
  //       );
  //     } catch (error) {
  //       await t.rollback();
  //       console.error("Error creating Subscriber:", error);
  //       return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
  //     }
  //   }

  //   // Update a country by ID
  //   async update(req, res) {
  //     const t = await sequelize.transaction();
  //     try {
  //       const { id } = req.params;

  //       const data = {
  //         name: req.body?.name?.trim(),
  //       };

  //       const exists = await CheckExits(Subscriber, { name: data?.name }, t);

  //       if (exists?.id != id && exists !== null) {
  //         await t.rollback();
  //         return Base.sendError(
  //           res,
  //           HTTPS.NOT_ACCEPTABLE,
  //           "Appointment Reason name already in use"
  //         );
  //       }

  //       const update = await UpdateData(Subscriber, data, { id: id }, t);

  //       await t.commit();
  //       return Base.sendResponse(
  //         res,
  //         HTTPS.ACCEPTED,
  //         {},
  //         "Appointment Reason  updated"
  //       );
  //     } catch (error) {
  //       await t.rollback();
  //       console.error("Error updating Subscriber:", error);
  //       return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
  //     }
  //   }

  //   // Delete a country by ID
  //   async delete(req, res) {
  //     const t = await sequelize.transaction();
  //     try {
  //       const { id } = req.params;
  //       // Check if the country exists
  //       const result = await CheckExits(Subscriber, { id }, t);

  //       if (!result) {
  //         await t.rollback();
  //         return Base.sendError(res, HTTPS.NOT_FOUND, "Appointment Reason not found");
  //       }

  //       await Subscriber.destroy({ where: { id }, transaction: t });

  //       await t.commit();
  //       return Base.sendResponse(
  //         res,
  //         HTTPS.OK,
  //         "Appointment Reason Deleted Successfully"
  //       );
  //     } catch (error) {
  //       await t.rollback();
  //       console.error("Error Deleting Subscriber:", error);
  //       return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
  //     }
  //   }

  //   // Update the status of a country
  //   async status(req, res) {
  //     const t = await sequelize.transaction();
  //     try {
  //       const { id } = req.params;

  //       const result = await CheckExits(Subscriber, { id }, t);

  //       if (!result) {
  //         await t.rollback();
  //         return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
  //       }

  //       await UpdateData(
  //         Subscriber,
  //         { status: result.status ? false : true },
  //         { id },
  //         t
  //       );

  //       await t.commit();

  //       return Base.sendResponse(
  //         res,
  //         HTTPS.OK,
  //         "Appointment Reason status updated successfully"
  //       );
  //     } catch (error) {
  //       await t.rollback();
  //       console.error("Error updating Appointment Reason status:", error);
  //       return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
  //     }
  //   }
}

module.exports = new SubscriberController();
