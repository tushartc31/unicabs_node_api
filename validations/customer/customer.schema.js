const joi = require("joi");
const schema = {
    customer: joi.object().keys({
        customerId: joi.string().max(100),
        customerName: joi.string().max(100).required(),
        customerMobile: joi.number().integer().min(1000000000).message("Invalid mobile number").max(9999999999).message("Invalid mobile number").required(),
    }),
};

module.exports = schema;