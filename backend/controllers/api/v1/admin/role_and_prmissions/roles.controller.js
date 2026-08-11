const Base = require("../../../../../helper/exception_handling");
const { HTTPS } = require("../../../../../helper/https-status-codes/https-status-codes");
const { Op } = require("sequelize");
const {
  Roles,
  Roles_Permissions,
  Permissions,
  sequelize,
} = require("../../../../../models/index");

const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
} = require("../../../../../helper/common/utils/dbUtils");

class RolesController {
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      const options = {
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
        },
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Roles, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Brands:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const include = [{ model: Roles_Permissions }]
      const result = await CheckExits(Roles, { id: req.params.id }, t, include);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Role not found");
      }
      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, result);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Brand:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const { name, permission_id } = req.body;

      // Input validation
      if (!name || !name.trim()) {
        return Base.sendError(res, HTTPS.BAD_REQUEST, "Role name is required");
      }

      const trimmedName = name.trim();

      // Check if the role already exists before creation
      const exists = await CheckExits(Roles, { name: trimmedName }, t);
      if (exists) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Role already exists");
      }

      // Create the new role
      const data = { name: trimmedName };
      const newItem = await CreateNew(Roles, data, t);

      // Handle permissions if provided
      if (permission_id && Array.isArray(permission_id) && permission_id.length > 0) {
        // Map the permission_id array to rolePermissions objects
        const rolePermissions = permission_id.map((permission_id) => ({
          role_id: newItem.id,
          permission_id,  // This is fine; you're using the variable name correctly.
        }));

        // Use bulkCreate to insert all role permissions at once
        await Roles_Permissions.bulkCreate(rolePermissions, { transaction: t });
      }

      // Commit the transaction if everything is successful
      await t.commit();
      return Base.sendResponse(res, HTTPS.CREATED, newItem);

    } catch (error) {
      // Rollback the transaction in case of an error
      await t.rollback();
      console.error("Error creating Role:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { name, permission_id } = req.body;
      const data = { name: name?.trim() };

      // If password exists, hash it before saving
      if (req.body.password) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        data.password = hashedPassword;
      }

      // Check permissions
      if (permission_id && Array.isArray(permission_id)) {
        // Fetch current permissions for the role
        const currentPermissions = await Roles_Permissions?.findAll({
          where: { role_id: req.params.id },
          transaction: t,
        });

        const currentPermissionIds = currentPermissions?.map(
          (cp) => cp.permission_id
        );

        // Find permissions to remove and to add
        const permissionsToRemove = currentPermissionIds?.filter(
          (id) => !permission_id.includes(id)
        );
        const permissionsToAdd = permission_id.filter(
          (id) => !currentPermissionIds.includes(id)
        );

        // Ensure permissions to add exist in the permissions table
        const validPermissions = await Permissions.findAll({
          where: {
            id: permissionsToAdd,
          },
          transaction: t,
        });

        const validPermissionIds = validPermissions.map((perm) => perm.id);

        // Check if all permissions to add are valid
        const invalidPermissions = permissionsToAdd.filter(
          (id) => !validPermissionIds.includes(id)
        );

        if (invalidPermissions.length > 0) {
          await t.rollback();
          return res.status(400).send({
            message: `Invalid permission IDs: ${invalidPermissions.join(', ')}`,
          });
        }

        // Remove permissions that are no longer needed
        if (permissionsToRemove.length > 0) {
          await Roles_Permissions.destroy({
            where: { role_id: req.params.id, permission_id: permissionsToRemove },
            transaction: t,
          });
        }

        // Add new permissions
        if (permissionsToAdd.length > 0) {
          const rolePermissions = permissionsToAdd.map((permissionId) => ({
            role_id: req.params.id,
            permission_id: permissionId,
          }));
          await Roles_Permissions.bulkCreate(rolePermissions, {
            transaction: t,
          });
        }
      }

      // Check if the role name already exists
      if (data.name) {
        const existingRole = await Roles.findOne({
          where: { name: data.name },
          transaction: t,
        });

        if (existingRole?.id != req.params.id && existingRole !== null) {
          await t.rollback();
          return res.send(
            Base.sendError("Role with the same name already exists")
          );
        }
      }

      // Update the role
      const update = await UpdateData(Roles, data, { id: id }, t);

      await t.commit();
      return Base.sendResponse(res, HTTPS.ACCEPTED, "Role updated successfully");

    } catch (error) {
      await t.rollback();
      console.error("Error updating Role:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }


  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Roles, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Role not found");
      }

      await Roles.destroy({ where: { id }, transaction: t, });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "Role Deleted Successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Role:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Roles, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Roles,
        { status: result.status ? false : true },
        { id },
        t
      );

      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, "Role status updated successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error updating Role status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new RolesController();
