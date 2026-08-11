const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Base = require("../../../../../helper/exception_handling");
const {
  HTTPS,
} = require("../../../../../helper/https-status-codes/https-status-codes");
const {
  Users,
  Logs,
  Roles,
  Roles_Permissions,
  Store_Detail,
  Permissions,
  Country,
  Bank_Detail,
  Kyc_Document,
  s_category,
  sequelize,
} = require("../../../../../models/index");
const IDS = require("../../../../../helper/fix_ids");
const {
  CheckExits,
  UpdateData,
} = require("../../../../../helper/common/utils/dbUtils");

class AuthController {
  async adminLogin(req, res) {
    try {
      const { email, password } = req.body;

      // Fetch user with roles and permissions
      const user = await Users.findOne({
        include: [
          {
            model: Roles,
            include: [
              {
                model: Roles_Permissions,
                include: [Permissions],
              },
            ],
          },
          // {
          //   model: Store_Detail
          // }
        ],
        where: {
          email: email.trim(),
          status: true,
          role_id: IDS.RoleId.Admin,
        },
      });

      if (!user) {
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found.");
      }

      // if(user.id != IDS.UserId.Admin){
      //   if(user.Store_Detail?.approval_status_id != IDS.ApprovalStatus.Approved) {
      //     return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Your account is not Approved yet.");
      //   }
      // }

      // Verify the password
      const isMatch = await bcrypt.compare(password.trim(), user.password);
      if (!isMatch) {
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "Incorrect password.");
      }

      // Extract permissions
      const arrayOfPermissionIds = user.Role.Roles_Permissions.map(
        (permission) => permission.permission_id,
      );

      // Generate JWT token
      const token = jwt.sign(
        {
          user_id: user.id,
          name: user.name,
          role_id: user.role_id,
          role: user.Role?.name,
          // store_id: user?.Store_Detail?.id,
          permissions: arrayOfPermissionIds,
        },
        process.env.SECRETKEY,
        { expiresIn: "365d" },
      );

      // Prepare response data
      const data = {
        token,
        role: user.Role.name || "Unknown",
        permissions: arrayOfPermissionIds,
      };

      await Logs.create({ ip: req?.ip, user_id: user.id });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in adminLogin:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async adminDetails(req, res) {
    try {
      // Fetch user with roles and permissions
      const user = await Users.findOne({
        include: [
          {
            model: Roles,
            include: [
              {
                model: Roles_Permissions,
                include: [Permissions],
              },
            ],
          },
        ],
        where: {
          id: req.user.user_id,
        },
      });

      if (!user) {
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found.");
      }

      // Extract permissions
      const arrayOfPermissionIds = user.Role.Roles_Permissions.map(
        (permission) => permission.permission_id,
      );

      // Prepare response data
      const data = {
        role: user.Role.name,
        permissions: arrayOfPermissionIds,
      };

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in adminDetails:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async getUser(req, res) {
    try {
      const data = await Users.findOne({
        // include: [
        //   {
        //     model: Store_Detail,
        //     include: [
        //       {
        //         model: s_category
        //       }
        //     ],
        //   }
        // ],
        where: {
          id: req.user.user_id,
        },
      });

      if (!data) {
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found.");
      }

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in adminDetails:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async CustomerLogin(req, res) {
    try {
      const { contact_no } = req.body;

      // Fetch user with roles and permissions
      const user = await Users.findOne({
        include: [
          {
            model: Roles,
            include: [
              {
                model: Roles_Permissions,
                include: [Permissions],
              },
            ],
          },
        ],
        where: {
          contact_no: contact_no,
          role_id: IDS.RoleId.Customer,
          status: true,
        },
      });

      if (!user) {
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found.");
      }

      // Extract permissions
      const arrayOfPermissionIds = user.Role.Roles_Permissions.map(
        (permission) => permission.permission_id,
      );

      // Generate JWT token
      const token = jwt.sign(
        {
          user_id: user.id,
          name: user.name,
          role_id: user.role_id,
          role: user.Role?.name,
          permissions: arrayOfPermissionIds,
        },
        process.env.SECRETKEY,
        { expiresIn: "365d" },
      );

      // Prepare response data
      const data = {
        token,
        role: user.Role.name || "Unknown",
        permissions: arrayOfPermissionIds,
      };

      await Logs.create({ ip: req?.ip, user_id: user.id });

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in customerLogin:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async CustomerSignup(req, res) {
    try {
      const { contact_no, name } = req.body;

      // Fetch user with roles and permissions
      const create = await Users.create({
        name: name,
        contact_no: contact_no,
        role_id: IDS.RoleId.Customer,
        country_code_id: req.body.country_code_id,
        image: "/public/assets/images/user-circle.png",
      });

      const user = await Users.findOne({
        include: [
          {
            model: Roles,
            include: [
              {
                model: Roles_Permissions,
                include: [Permissions],
              },
            ],
          },
        ],
        where: {
          contact_no: contact_no,
          status: true,
        },
      });

      if (!user) {
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found.");
      }

      // Extract permissions
      const arrayOfPermissionIds = user.Role.Roles_Permissions.map(
        (permission) => permission.permission_id,
      );

      // Generate JWT token
      const token = jwt.sign(
        {
          user_id: user.id,
          name: user.name,
          role_id: user.role_id,
          role: user.Role?.name,
          permissions: arrayOfPermissionIds,
        },
        process.env.SECRETKEY,
        { expiresIn: "365d" },
      );

      // Prepare response data
      const data = {
        token,
        role: user.Role.name || "Unknown",
        permissions: arrayOfPermissionIds,
      };

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in customerSignup:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  checkExist = async (req, res) => {
    try {
      const data = await Users.findOne({ where: { email: req.body.email } });

      if (!data) {
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found.");
      }

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      console.error("Error in adminDetails:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  };

  UpdatePasswordWL = async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { email, contact_no, password } = req.body;
      if (!password || (!email && !contact_no)) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Password and either email or contact number are required.",
        );
      }

      const whereClause = {};
      if (email) {
        whereClause.email = email;
      } else {
        whereClause.contact_no = contact_no;
      }

      const data = await CheckExits(Users, whereClause, t);

      const isMatch = await bcrypt.compare(password, data.password);
      if (isMatch) {
        await t.rollback();
        return Base.sendError(
          res,
          HTTPS.NOT_ACCEPTABLE,
          "Password Cannot be same as Previos password",
        );
      }
      if (!data) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_ACCEPTABLE, "User not found.");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      if (email) {
        await UpdateData(
          Users,
          { password: hashedPassword },
          { email: email },
          t,
        );
      } else {
        await UpdateData(
          Users,
          { password: hashedPassword },
          { contact_no: contact_no },
          t,
        );
      }

      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error in adminDetails:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  };

  checkVendorExist = async (req, res) => {
    try {
      const data = await Users.findOne({
        where: {
          contact_no: req.body.contact_no,
        },
      });

      if (!data) {
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found.");
      }

      if (data && data?.role_id != IDS.RoleId.Vendor) {
        return Base.sendError(
          res,
          HTTPS.ALREADY_REPORTED,
          "Contact Already Exists.",
        );
      }

      const result = await Users.findOne({
        include: [
          {
            model: Store_Detail,
            include: [
              {
                model: Country,
              },
              {
                model: s_category,
              },
            ],
          },
          {
            model: Kyc_Document,
          },
          {
            model: Bank_Detail,
          },
        ],
        where: {
          contact_no: req.body.contact_no,
        },
      });

      if (
        result &&
        result?.role_id == IDS.RoleId.Vendor &&
        result?.Store_Detail?.approval_status_id != IDS.ApprovalStatus.Rejected
      ) {
        return Base.sendError(
          res,
          HTTPS.ALREADY_REPORTED,
          "Contact Already Exists.",
        );
      }

      const user = {
        name: result?.name,
        contact_no: result?.contact_no,
        email: result?.email,
        store_name: result?.Store_Detail?.store_name,
        account_no: result?.Bank_Detail?.account_no,
        ifsc: result?.Bank_Detail?.ifsc,
        bank_name: result?.Bank_Detail?.bank_name,
        aadhar_image: result?.Kyc_Document?.aadhar_image,
        driving_license_image: result?.Kyc_Document?.driving_license_image,
        pan_image: result?.Kyc_Document?.pan_image,
        country_id: {
          value: result?.Store_Detail?.country_id,
          name: "country_id",
          label: result?.Store_Detail?.Country?.name,
        },
        s_category_id: {
          value: result?.Store_Detail?.s_category_id,
          name: "s_category_id",
          label: result?.Store_Detail?.s_category?.name,
        },
      };

      return Base.sendResponse(res, HTTPS.OK, user);
    } catch (error) {
      console.error("Error in Vendor Details:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  };

  async updatePassword(req, res) {
    const t = await sequelize.transaction();
    try {
      const data = await CheckExits(
        Users,
        {
          email: req.body.email,
        },
        t,
      );

      if (!data) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "User not found.");
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      await UpdateData(
        Users,
        { password: hashedPassword },
        { email: req.body.email },
        t,
      );

      await t.commit();

      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error in adminDetails:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR);
    }
  }

  async postEditPassword(req, res) {
    try {
      const currentPassword = req.body.current_password?.trim();
      const newPassword = req.body.new_password?.trim();

      const user = await Users.findOne({
        where: {
          id: req.user.user_id,
          status: true,
        },
      });

      if (!user) {
        return Base.sendError(
          res,
          HTTPS.ALREADY_REPORTED,
          "User not found or deactivated",
        );
      }

      bcrypt.compare(currentPassword, user.password, async (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          const hashedPassword = await bcrypt.hash(newPassword, 10);

          const update = await Users.update(
            { password: hashedPassword },
            {
              where: {
                id: req.user.user_id,
              },
            },
          );
          return Base.sendResponse(
            res,
            HTTPS.OK,
            "Password updated successfully",
          );
        } else {
          return Base.sendError(
            res,
            HTTPS.ALREADY_REPORTED,
            "Invalid current password",
          );
        }
      });
    } catch (error) {
      console.log(error);
      return res.send(Base.sendError(error));
    }
  }
}

module.exports = new AuthController();
