const joi = require("joi");
require("../../constants/db_tables_field");
const schema = {
    booking: joi.object().keys({
        bookingDate: joi.date().required(),
        pickup: joi.string().max(100).required(),
        drop: joi.string().max(100).required(),
        tripType: joi.string().pattern(new RegExp("^(oneway|round|8/80|localtransfer|package)$")).message("Invalid trip type").required(),
        customerId  : joi.string().max(10).allow(''),
        customerName  : joi.string().max(100).allow(''),
        customerMobile  : joi.number().integer().min(1000000000).message("Invalid mobile number").max(9999999999).message("Invalid mobile number").allow(''),
        carType : joi.string().max(100).allow(''),
        vehicleId: joi.string().max(10).allow(''),
        vehicleName  : joi.string().max(100).allow(''),
        vehicleNumber: joi.string().pattern(new RegExp("^[A-Z]{2}[0-9]{1,2}(?:[A-Z])?(?:[A-Z]*)?[0-9]{4}$")).message("Invalid vehicle type number").allow(''),
        vehicleType: joi.string().max(100).allow(''),
        vendorName: joi.string().max(100).allow(''),
        vendorMobile: joi.string().max(100).allow(''),
        bookingPrice: joi.number().required(),
        vendorPrice: joi.number(),
        commissionPrice: joi.number(),
        driverId: joi.string().max(10).allow(''),
        driverName: joi.string().max(100).allow(''),
        driverMobile: joi.string().max(100).allow(''),
        note: joi.string().max(100).allow(''),
        creatorId: joi.string().max(10).allow(''),
        creatorName: joi.string().max(100).allow('')
    })
};

module.exports = schema;