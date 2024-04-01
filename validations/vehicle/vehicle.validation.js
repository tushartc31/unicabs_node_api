const {
    vehicle
} = require("./vehicle.schema");

module.exports = {
    addVehicleValidation: async (req, res, next) => {
        const value = await vehicle.validate(req.body);
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