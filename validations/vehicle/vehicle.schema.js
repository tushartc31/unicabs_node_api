const joi = require("joi");
const schema = {
    vehicle: joi.object().keys({
        vehicleId: joi.string().max(100),
        vehicleType: joi.string().max(100).required(),
        vehicleName: joi.string().max(100).required(),
        vehicleNumber: joi.string().pattern(new RegExp("^[A-Z]{2}[0-9]{1,2}(?:[A-Z])?(?:[A-Z]*)?[0-9]{4}$")).message("Invalid vehicle type number").required(),
    }),
};

module.exports = schema;