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
  Our_Team,
  sequelize,
  Team_Social_Link,
  Social_Link,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
class Our_TeamController {
  // Fetch all blog
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const options = {
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
        },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Our_Team, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Our_Team:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single blog by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const result = await Our_Team.findOne({
        where: { id: req.params.id },
        include: [
          { model: Team_Social_Link, include: [{ model: Social_Link }] },
        ],
        transaction: t,
      });

      const data = {
        name: result?.name,
        designation: result.designation,
        image: result.image,

        social_media: result.Team_Social_Links.map((product_quantity) => ({
          id: product_quantity?.id,
          link: product_quantity?.link,
          social_media_id: {
            value: product_quantity.social_media_id,
            name: "social_media_id",
            label: product_quantity?.Social_Link?.name,
          },
        })),
      };
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Our_Team:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Create a new blog
  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = {
        name: req.body?.name?.trim(),
        subname: req.body?.subname?.trim(),
        designation: req.body?.designation?.trim(),
        status: true,
        image: await File_Uploade(req.files?.image, "/uploads/masters/our_tem"),
      };
      const exists = await CheckExits(Our_Team, { name: data?.name }, t);

      if (exists) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Our_Team already exists"
        );
      }

      const newItem = await CreateNew(Our_Team, data, t);
      if (req.body.social_media) {
        const socialMediaData = JSON.parse(req.body.social_media);

        for (const socialMedia of socialMediaData) {
          const socialMediaEntry = {
            our_team_id: newItem.id,
            link: socialMedia.link,
            social_media_id: socialMedia.social_media_id,
          };
          await Team_Social_Link.create(socialMediaEntry, {
            transaction: t,
          });
        }
      }
      await t.commit();

      return Base.sendResponse(res, HTTPS.CREATED, newItem);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Our_Team:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a blog by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const data = {
        name: req.body?.name?.trim(),
        subname: req.body?.subname?.trim(),
       designation: req.body?.designation?.trim(),
        status: true,
      };

      if (req.files && req.files.image) {
        data.image = await File_Uploade(
          req.files?.image,
          "/uploads/masters/our_tem"
        );
      }

      const exists = await CheckExits(Our_Team, { name: data?.name }, t);

      if (exists?.id != id && exists !== null) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Our_Team name already in use"
        );
      }

      const update = await UpdateData(Our_Team, data, { id: id }, t);
      await Team_Social_Link.destroy({
        where: {
          our_team_id: req.params.id,
        },
        transaction: t,
      });

      if (req.body.social_media) {
        const socialMediaData = JSON.parse(req.body.social_media);

        for (const socialMedia of socialMediaData) {
          const socialMediaEntry = {
            our_team_id: id,
            link: socialMedia.link,
            social_media_id: socialMedia.social_media_id,
          };
          await Team_Social_Link.create(socialMediaEntry, {
            transaction: t,
          });
        }
      }

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Our_Team updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Our_Team:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Delete blog by id
  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Our_Team, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Our_Team not found");
      }

      await Our_Team.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "Our_Team Deleted Successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Our_Team:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Our_Team, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Our_Team,
        { status: result.status ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Our_Team status updated successfully"
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Our_Team status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new Our_TeamController();
