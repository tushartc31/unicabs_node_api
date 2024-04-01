const { checkToken } = require("../../auth/token_validation");
const { addCustomerValidation } = require("../../validations/customer/customer.validation");
const { createCustomer, getCustomerByCustomerId, getCustomerByCustomerMobile, getCustomerList, updateCustomer, deleteCustomer } = require("../controllers/customer.controller");
const router = require('express').Router();


router.post("/create", checkToken, addCustomerValidation, createCustomer);
router.get("/customerList", checkToken, getCustomerList);
router.get("/:customerId", checkToken, getCustomerByCustomerId);
router.get("/", checkToken, getCustomerByCustomerMobile);
router.patch("/update/:id", checkToken, addCustomerValidation, updateCustomer);
router.delete("/delete/:id", checkToken, deleteCustomer);

module.exports = router;