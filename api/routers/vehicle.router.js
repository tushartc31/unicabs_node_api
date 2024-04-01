const { checkToken } = require("../../auth/token_validation");
const { addVehicleValidation } = require("../../validations/vehicle/vehicle.validation");
const { createVehicle, getVehicleList, getVehicleById, updateVehicle, deleteVehicle, getVehicleByNumber} = require("../controllers/vehicle.controller");
const router = require('express').Router();

router.post("/create", checkToken, addVehicleValidation, createVehicle);
router.get("/vehicleList", checkToken, getVehicleList);
router.get("/getVehicleByNumber/", checkToken, getVehicleByNumber);
router.get("/:vehicleId", checkToken, getVehicleById);
router.patch("/update/:id", checkToken, addVehicleValidation, updateVehicle);
router.delete("/delete/:id", checkToken, deleteVehicle);

module.exports = router;