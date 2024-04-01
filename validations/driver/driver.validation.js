const {
    driver
} = require("./driver.schema");

module.exports = {
    addDriverValidation: async (req, res, next) => {
        const value = await driver.validate(req.body);
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