const { create, getDriverByMobile, getDriverByDriverId, getDriverList, updateDriver, deleteDriver } = require("../services/driver.service")
const AppError = require('../../utils/appError');
module.exports = {
    createDriver: async (req, res, next) => {
        try {
            const body = req.body;
            // check if driver already exist
            // Validate if driver exist in our database
            const oldDriver = await getDriverByMobile(body.driverMobile);
            if (oldDriver) {
                // throw new Error("driver Already Exist.");
                return res.status(200).json({
                    success: 0,
                    message: "Driver Already Exist.",
                    driverId: oldDriver?.driverId ?? ""
                });
            }
            const result = await create(body);
            if (!result.affectedRows) {
                throw new Error('Failed! Create Driver');
            }
            console.log(result);
            return res.status(200).json({
                success: 1,
                message: "Driver created successfully",
                driverId: body.driverId ?? ""
            });
        } catch (e) {
            next(e);
        }
    },

    getDriverByDriverId: async (req, res, next) => {
        try {
            const driverId = req.params.driverId;
            const result = await getDriverByDriverId(driverId);
            if (!result) {
                throw new AppError('Driver Record not found!', 404);
            }
            return res.json({
                success: 1,
                driver: result,
            });
        } catch (e) {
            next(e);
        }
    },
    
    getDriverByDriverMobile: async (req, res, next) => {
        try {
            const driverMobile = req.query.driverMobile;
            const result = await getDriverByMobile(driverMobile);
            if (!result) {
                throw new AppError('Driver Record not found!', 404);
            }
            return res.json({
                success: 1,
                driver: result,
            });
        } catch (e) {
            next(e);
        }
    },

    getDriverList: async (req, res, next) => {
        try {
            let limit = parseInt(req.query.limit);
            if(!limit){
                limit = 5
            }
            let offset = parseInt(req.query.offset);
            if(!offset){
                offset = 0
            }
            let searchQuery = req.query.searchQuery;
            if(!searchQuery){
                searchQuery = ""
            }
            const result = await getDriverList(offset,limit,searchQuery);
            return res.json({
                success: 1,
                driverList: result,
            });
        } catch (e) {
            next(e);
        }
    },

    updateDriver: async (req, res, next) => {
        try {
            const id = req.params.id;
            const body = req.body;
            // const salt = genSaltSync(10);
            // body.password = hashSync(body.password, salt);
            const result = await updateDriver(id, body);
            if (!result.affectedRows) {
                throw new Error(`Failed to update driver record!`);
            }
            return res.json({
                success: 1,
                message: "Driver updated successfully",
            });
        } catch (e) {
            next(e);
        }
    },

    deleteDriver: async (req, res, next) => {
        try {
            const id = req.params.id;
            const result = await deleteDriver(id);
            if (!result.affectedRows) {
                throw new Error(`Failed to delete driver record!`);
            }
            return res.json({
                success: 1,
                message: "Driver deleted successfully",
            });
        } catch (e) {
            next(e);
        }
    },
}