const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
    PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


// Wallet routes
const WalletController = require("../../../../../controllers/api/v1/admin/wallets/wallet/wallet.controller");
router.get("/", WalletController.findAll);

router.get("/:id", WalletController.findOneUserWallet);
router.get("/my-wallet", WalletController.findOne);
router.post("/transaction", WalletController.transaction);
router.post("/:id", WalletController.status);


module.exports = router;
