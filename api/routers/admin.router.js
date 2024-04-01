const { checkToken } = require("../../auth/token_validation");
const { createAdmin, getAdminByAdminId, getAdminList, login, updateAdmin, deleteAdmin } = require('../controllers/admin.controller');
const router = require('express').Router();
const { addAdminValidation, loginValidation } = require('../../validations/admin/admin.validation');

router.post("/createAdmin", addAdminValidation, createAdmin);
router.post("/login", loginValidation, login);
router.get("/userList", checkToken, getAdminList);
router.get("/:id", checkToken, getAdminByAdminId);
router.patch("/update/:id", checkToken, addAdminValidation, updateAdmin);
router.delete("/delete/:id", checkToken, deleteAdmin);

module.exports = router;