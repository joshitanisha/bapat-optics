const Base = require("../helper/exception_handling");
const { HTTPS } = require("../helper/https-status-codes/https-status-codes");
const { Users, Roles, Roles_Permissions } = require("../models");

const PermissionMiddleware = (additionalParam) => {
  return async (req, res, next) => {
    try {
      // Fetch the user and their permissions
      const user = await Users.findOne({
        include: [
          {
            model: Roles,
            include: [
              {
                model: Roles_Permissions,
              },
            ],
          },
        ],
        where: {
          id: req.user.user_id,
        },
      });

      if (!user) {
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found");
      }

      // Extract permissions from user's roles
      const arrayOfPermissionIds = user?.Role?.Roles_Permissions.map(
        (obj) => obj.dataValues.permission_id
      );

      // Check if the permission exists in the user's permissions
      if (arrayOfPermissionIds.includes(Number(additionalParam))) {
        return next(); // Proceed to next middleware or route handler
      } else {
        return Base.sendError(res, HTTPS.FORBIDDEN, "Permission Denied");
      }
    } catch (error) {
      // Handle unexpected errors
      console.error("error", error);

      return Base.sendError(
        res,
        HTTPS.FORBIDDEN,
        "Error verifying permissions"
      );
    }
  };
};

module.exports = {
  PermissionMiddleware,
};
