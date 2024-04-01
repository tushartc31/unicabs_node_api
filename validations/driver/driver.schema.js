const joi = require("joi");
const schema = {
    driver: joi.object().keys({
        driverId: joi.string().max(100),
        driverName: joi.string().max(100).required(),
        driverMobile: joi.number().integer().min(1000000000).message("Invalid mobile number").max(9999999999).message("Invalid mobile number").required(),
    }),
};

module.exports = schema;