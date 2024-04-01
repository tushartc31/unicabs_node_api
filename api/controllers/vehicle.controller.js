const { create, getVehicleByNumber, getVehicleByVehicleId, getVehicleList, updateVehicle, deleteVehicle} = require('../services/vehicle.service');
const AppError = require('../../utils/appError');
module.exports = {
    createVehicle: async (req, res, next) => {
        try {
            const body = req.body;
            // check if vehicletype already exist
            // Validate if vehicletype exist in our database
            const oldvehicle = await getVehicleByNumber(body.vehicleNumber);
            if (oldvehicle) {
                return res.status(200).json({
                    success: 0,
                    message: "vehicle Already Exist.",
                    vehicleId: oldvehicle?.vehicleId
                });
            }
            const result = await create(body);
            if (!result.affectedRows) {
                throw new Error('Failed! Create vehicle');
            }
            console.log(result);
            return res.status(200).json({
                success: 1,
                message: "vehicle created successfully",
                vehicleId: result?.vehicleId ?? ""
            });
        } catch (e) {
            next(e);
        }
    },

    getVehicleByNumber: async (req, res, next) => {
        try {
            const vehicleNumber = req.query.vehicleNumber;
            const result = await getVehicleByNumber(vehicleNumber);
            if (!result) {
                throw new AppError('vehicle Record not found!', 404);
            }
            return res.json({
                success: 1,
                vehicle: result,
            });
        } catch (e) {
            next(e);
        }
    },

    getVehicleById: async (req, res, next) => {
        try {
            const vehicleId = req.params.vehicleId;
            const result = await getVehicleByVehicleId(vehicleId);
            if (!result) {
                throw new AppError('vehicle Record not found!', 404);
            }
            return res.json({
                success: 1,
                vehicle: result,
            });
        } catch (e) {
            next(e);
        }
    },

    getVehicleList: async (req, res, next) => {
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
            const result = await getVehicleList(offset,limit,searchQuery);
            return res.json({
                success: 1,
                vehicleList: result,
            });
        } catch (e) {
            next(e);
        }
    },

    updateVehicle: async (req, res, next) => {
        try {
            const id = req.params.id;
            const body = req.body;
            // const salt = genSaltSync(10);
            // body.password = hashSync(body.password, salt);
            const result = await updateVehicle(id, body);
            if (!result.affectedRows) {
                throw new Error(`Failed to update vehicle record!`);
            }
            return res.json({
                success: 1,
                message: "vehicle updated successfully",
            });
        } catch (e) {
            next(e);
        }
    },

    deleteVehicle: async (req, res, next) => {
        try {
            const id = req.params.id;
            const result = await deleteVehicle(id);
            if (!result.affectedRows) {
                throw new Error(`Failed to delete vehicle record!`);
            }
            return res.json({
                success: 1,
                message: "vehicle deleted successfully",
            });
        } catch (e) {
            next(e);
        }
    }
}