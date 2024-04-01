const joi = require("joi");
const schema = {
    admin: joi.object().keys({
        userName: joi.string().max(100).required(),
        email: joi.string().email().required(),
        // password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
        password: joi.string().min(6).max(30).required(),
        mobile: joi.number().integer().min(1000000000).message("Invalid mobile number").max(9999999999).message("Invalid contact number").required(),
        userRole: joi.string().pattern(new RegExp("^(admin|user)$")).message("Invalid user role").required()
    }),
    login: joi.object({
        mobile: joi.number().integer().min(1000000000).message("Invalid mobile number").max(9999999999).message("Invalid contact number").required(),
        password: joi.string().max(30).required()
    })
};

module.exports = schema;