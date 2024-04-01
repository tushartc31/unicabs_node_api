const { checkToken } = require("../../auth/token_validation");
const { addDriverValidation } = require("../../validations/driver/driver.validation");
const { createDriver, getDriverByDriverId, getDriverByDriverMobile, getDriverList, updateDriver, deleteDriver } = require("../controllers/driver.controller");
const router = require('express').Router();


router.post("/create", checkToken, addDriverValidation, createDriver);
router.get("/driverList", checkToken, getDriverList);
router.get("/:driverId", checkToken, getDriverByDriverId);
router.get("/", checkToken, getDriverByDriverMobile);
router.patch("/update/:id", checkToken, addDriverValidation, updateDriver);
router.delete("/delete/:id", checkToken, deleteDriver);

module.exports = router;