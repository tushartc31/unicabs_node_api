const {
    admin,
    login
} = require("./admin.schema");

module.exports = {
    addAdminValidation: async (req, res, next) => {
        const value = await admin.validate(req.body);
        errorMessage(value, res, next);
    },
    loginValidation: async (req, res, next) => {
        const value = await login.validate(req.body);
        errorMessage(value, res, next);
    }
};

const errorMessage = (value, res, next) => {
    if (value.error) {
        return res.json({
            success: 0,
            message: value.error.details[0].message
        })
    } else {
        next();
    }
}